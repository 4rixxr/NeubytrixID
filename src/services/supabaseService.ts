import { createClient } from '@supabase/supabase-js';

const env = (import.meta as unknown as { env?: Record<string, string | undefined> }).env || {};

export const SUPABASE_URL =
  env.VITE_SUPABASE_URL || 'https://fqlywgozktuzpyrllqx.supabase.co';
export const SUPABASE_ANON_KEY =
  env.VITE_SUPABASE_ANON_KEY ||
  'sb_publishable_Vb95xro85UHBP4zqbz23qg_beorL8Ew';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export interface UploadResult {
  success: boolean;
  fileUrl?: string;
  fileName: string;
  fileSize: number;
  userCode: string;
  storagePath?: string;
  error?: string;
  timestamp: string;
}

/**
 * Uploads a document directly to Supabase Storage & registers metadata in Supabase
 */
export const uploadDocumentToSupabase = async (
  file: File,
  userCode: string,
  extraMetadata?: Record<string, any>
): Promise<UploadResult> => {
  const timestamp = new Date().toISOString();
  const cleanFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const filePath = `${userCode}/${Date.now()}_${cleanFileName}`;

  try {
    // 1. Try uploading to 'documents' bucket in Supabase Storage
    const { data: storageData, error: storageError } = await supabase.storage
      .from('documents')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    let publicUrl: string | undefined;

    if (!storageError && storageData) {
      const { data: urlData } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);
      publicUrl = urlData?.publicUrl;
    } else {
      // If 'documents' bucket not found or restricted, try 'materials' bucket
      const { data: matData, error: matError } = await supabase.storage
        .from('materials')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (!matError && matData) {
        const { data: urlData } = supabase.storage
          .from('materials')
          .getPublicUrl(filePath);
        publicUrl = urlData?.publicUrl;
      } else {
        console.warn(
          'Supabase storage upload returned notice (bucket might need public creation in Supabase dashboard):',
          storageError?.message || matError?.message
        );
      }
    }

    // 2. Try recording metadata in 'documents' table in Supabase
    try {
      await supabase.from('documents').insert({
        user_code: userCode,
        file_name: file.name,
        file_size: file.size,
        file_type: file.type,
        file_url: publicUrl || null,
        storage_path: filePath,
        metadata: extraMetadata || {},
        created_at: timestamp,
      });
    } catch (dbErr) {
      console.warn('Supabase DB table notice:', dbErr);
    }

    return {
      success: true,
      fileUrl: publicUrl,
      fileName: file.name,
      fileSize: file.size,
      userCode,
      storagePath: filePath,
      timestamp,
    };
  } catch (err: any) {
    console.error('Supabase upload exception:', err);
    return {
      success: false,
      fileName: file.name,
      fileSize: file.size,
      userCode,
      error: err?.message || 'Gagal mengupload dokumen ke Supabase',
      timestamp,
    };
  }
};
