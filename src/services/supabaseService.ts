// Optional adapter; the learning workspace uses local data and optional Firebase document sync.
// Never use public buckets or an anonymous user code as authorization.
import { createClient } from '@supabase/supabase-js';
const env = import.meta.env;
export const SUPABASE_URL = env.VITE_SUPABASE_URL || '';
export const SUPABASE_ANON_KEY = env.VITE_SUPABASE_ANON_KEY || '';
export const supabase = SUPABASE_URL && SUPABASE_ANON_KEY ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;
export interface UploadResult { success: boolean; fileUrl?: string; fileName: string; fileSize: number; userCode: string; storagePath?: string; error?: string; timestamp: string; }
export async function uploadDocumentToSupabase(file: File, userCode: string, extraMetadata?: Record<string, unknown>): Promise<UploadResult> {
  const result = { fileName: file.name, fileSize: file.size, userCode, timestamp: new Date().toISOString() };
  try {
    if (!supabase) throw new Error('Penyimpanan Supabase belum dikonfigurasi.');
    if (file.size > 10 * 1024 * 1024 || !file.size) throw new Error('Ukuran file harus antara 1 byte dan 10 MB.');
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) throw new Error('Autentikasi Supabase diperlukan. Login Google Firebase tidak memberikan sesi Supabase.');
    const storagePath = `${user.id}/${crypto.randomUUID()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    const { error } = await supabase.storage.from('documents').upload(storagePath, file, { upsert: false });
    if (error) throw error;
    const { error: metadataError } = await supabase.from('study_documents').insert({ owner_id: user.id, file_name: file.name, storage_path: storagePath, metadata: extraMetadata || {} });
    if (metadataError) { await supabase.storage.from('documents').remove([storagePath]); throw metadataError; }
    // The private file is referenced by storage path; callers request a fresh signed URL when needed.
    return { ...result, success: true, storagePath };
  } catch (error) { return { ...result, success: false, error: error instanceof Error ? error.message : 'Unggah gagal.' }; }
}
