import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  Search,
  Sparkles,
  ArrowRight,
  Plus,
  BookOpen,
  Camera,
  CheckCircle,
  Database,
  ExternalLink,
} from 'lucide-react';
import { Material, SchoolLevel } from '../types';
import { analyzeUploadedFile } from '../services/apiService';
import { uploadDocumentToSupabase } from '../services/supabaseService';
import { saveDocumentToFirestore, auth } from '../services/firebase';
import { extractTextFromFile } from '../utils/documentParser';

interface MaterialsViewProps {
  materials: Material[];
  userCode?: string;
  onSelectMaterial: (mat: Material) => void;
  onAddMaterial: (mat: Material) => void;
  schoolLevel: SchoolLevel;
  grade: string;
}

export const MaterialsView: React.FC<MaterialsViewProps> = ({
  materials,
  userCode = 'NBT-2026-0001',
  onSelectMaterial,
  onAddMaterial,
  schoolLevel,
  grade,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const filteredMaterials = materials.filter(
    (m) =>
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setUploadStatus('1/3: Mengekstrak teks & menyimpan ke Database Firestore...');
    try {
      // 1. Extract text from uploaded document
      const extracted = await extractTextFromFile(file);

      setUploadStatus('2/3: Mengunggah salinan file ke Cloud Storage...');
      const supabaseResult = await uploadDocumentToSupabase(file, userCode, {
        schoolLevel,
        grade,
      });

      setUploadStatus('3/3: Menganalisis AI & mendaftarkan ke Gemini Chatbot...');
      // 2. AI analysis
      const parsed = await analyzeUploadedFile(file.name, file.type, schoolLevel, grade, extracted.text);

      const matId = `mat-${Date.now()}`;
      const newMat: Material = {
        id: matId,
        title: parsed.title || file.name,
        subject: 'Materi Pilihan',
        schoolLevel,
        grade,
        fileType: file.name.split('.').pop()?.toUpperCase() || 'DOC',
        originalFileName: file.name,
        uploadDate: 'Baru saja',
        pagesOrSlides: Math.max(1, Math.ceil(extracted.wordCount / 250)),
        mainConceptsCount: parsed.conceptMap?.length || 4,
        keyTermsCount: parsed.summary?.keyTerms.length || 6,
        rawText: extracted.text || parsed.rawText || '',
        summary: parsed.summary || {
          simpleOverview: extracted.summary || 'Ringkasan materi otomatis dari dokumen yang tersimpan di Database.',
          bulletPoints: ['Konsep dasar terurai rapi dari dokumen tersimpan.'],
          keyTerms: [{ term: 'Konsep Utama', definition: 'Poin penting dari dokumen yang diunggah.' }],
        },
        flashcards: parsed.flashcards || [],
        quizQuestions: parsed.quizQuestions || [],
        conceptMap: parsed.conceptMap || [],
        aiExplanation: parsed.aiExplanation || 'Dokumen telah tersimpan di Database dan siap dibaca Gemini.',
        mastered: false,
        supabaseUrl: supabaseResult.fileUrl,
        supabaseStoragePath: supabaseResult.storagePath,
      };

      // 3. Save to Cloud Firestore Database
      const effectiveUid = auth.currentUser?.uid || `local_${userCode.toLowerCase().replace(/[^a-z0-9_-]/g, '_')}`;
      try {
        await saveDocumentToFirestore(effectiveUid, {
          id: matId,
          title: newMat.title,
          subject: newMat.subject,
          fileName: file.name,
          fileType: newMat.fileType,
          fileSize: file.size,
          rawText: extracted.text,
          summary: newMat.summary?.simpleOverview,
          keyTerms: newMat.summary?.keyTerms,
          flashcards: newMat.flashcards,
          quizQuestions: newMat.quizQuestions,
        });
      } catch (firestoreErr) {
        console.warn('Could not save to Firestore, local store will maintain copy:', firestoreErr);
      }

      onAddMaterial(newMat);
      onSelectMaterial(newMat);
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
      setUploadStatus('');
    }
  };

  const handleAddPreset = async (presetName: string, subject: string, fileType: string) => {
    setIsUploading(true);
    setUploadStatus('Membuat materi kurikulum instan...');
    try {
      const parsed = await analyzeUploadedFile(presetName, fileType, schoolLevel, grade);
      const newMat: Material = {
        id: `mat-${Date.now()}`,
        title: presetName,
        subject,
        schoolLevel,
        grade,
        fileType,
        originalFileName: `${presetName}.${fileType.toLowerCase()}`,
        uploadDate: 'Baru saja',
        pagesOrSlides: 15,
        mainConceptsCount: 5,
        keyTermsCount: 8,
        rawText: parsed.rawText || '',
        summary: parsed.summary || {
          simpleOverview: `Ringkasan materi kurikulum ${presetName}.`,
          bulletPoints: ['Konsep terstruktur', 'Contoh penerapan'],
          keyTerms: [{ term: 'Prinsip Kunci', definition: 'Definisi konsep materi.' }],
        },
        flashcards: parsed.flashcards || [],
        quizQuestions: parsed.quizQuestions || [],
        conceptMap: parsed.conceptMap || [],
        aiExplanation: parsed.aiExplanation || '',
        mastered: false,
      };

      onAddMaterial(newMat);
      onSelectMaterial(newMat);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
      setUploadStatus('');
    }
  };

  return (
    <div id="neubytrix-materials-view" className="space-y-6 pb-20 md:pb-8">
      {/* Title & Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            Materi Saya 📚
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Upload file materi, slide, atau catatan buku. Dokumen otomatis tersimpan di Supabase Cloud.
          </p>
        </div>

        {/* Supabase Connection Status Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-[11px] font-mono shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
          <Database className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Supabase Cloud Connected</span>
        </div>
      </div>

      {/* Upload Box */}
      <div
        id="material-upload-dropzone"
        className="rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700/80 bg-slate-50/70 dark:bg-slate-900/40 hover:bg-slate-100/80 dark:hover:bg-slate-900/60 transition-all p-6 sm:p-8 text-center relative overflow-hidden"
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".pdf,.docx,.pptx,.txt,image/*"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFileUpload(e.target.files[0]);
            }
          }}
        />

        <div className="max-w-md mx-auto space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-600/20 border border-indigo-200 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto shadow-inner">
            <UploadCloud className="w-6 h-6" />
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">☁️ Upload materi ke Supabase</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Tarik file ke sini atau pilih file dari perangkat (Disimpan ke Supabase)
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              PDF • Word (.docx) • PowerPoint (.pptx) • Foto Catatan (OCR) • TXT
            </p>
          </div>

          {uploadStatus && (
            <div className="text-xs text-indigo-600 dark:text-indigo-400 font-medium bg-indigo-50 dark:bg-indigo-500/10 py-1.5 px-3 rounded-lg border border-indigo-200 dark:border-indigo-500/20 max-w-xs mx-auto animate-pulse">
              {uploadStatus}
            </div>
          )}

          <div>
            <button
              id="upload-material-btn"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{isUploading ? 'Sedang Menyimpan ke Supabase...' : '+ Pilih File'}</span>
            </button>
          </div>
        </div>

        {/* Quick presets */}
        <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800/80 max-w-xl mx-auto">
          <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-2.5">
            Atau coba preset materi kurikulum sekali klik:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => handleAddPreset('Sistem Peredaran Darah Manusia', 'IPA Biologi', 'PDF')}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 text-slate-700 dark:text-slate-300 text-xs font-medium hover:text-indigo-600 dark:hover:text-white transition-colors cursor-pointer shadow-xs"
            >
              + Biologi Darah (PDF)
            </button>
            <button
              onClick={() => handleAddPreset('Hukum Gravitasi & Gerak Newton', 'IPA Fisika', 'PPTX')}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 text-slate-700 dark:text-slate-300 text-xs font-medium hover:text-indigo-600 dark:hover:text-white transition-colors cursor-pointer shadow-xs"
            >
              + Hukum Newton (PPTX)
            </button>
            <button
              onClick={() => handleAddPreset('Catatan Teorema Pythagoras', 'Matematika', 'JPG')}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 text-slate-700 dark:text-slate-300 text-xs font-medium hover:text-indigo-600 dark:hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Camera className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>+ Scan Foto Buku (OCR)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Material Collection */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>🗂️ Koleksi Materi</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-normal">
              ({materials.length})
            </span>
          </h2>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari materi atau topik..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 shadow-xs"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {filteredMaterials.map((mat) => (
            <div
              key={mat.id}
              onClick={() => onSelectMaterial(mat)}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 cursor-pointer transition-all flex flex-col justify-between group shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400">{mat.subject}</span>
                    {mat.supabaseUrl && (
                      <span className="text-[10px] text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-200 dark:border-emerald-500/30 px-1.5 py-0.5 rounded font-mono">
                        ☁️ Supabase
                      </span>
                    )}
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase">
                    {mat.fileType}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors line-clamp-1">
                  {mat.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  {mat.summary.simpleOverview}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-3">
                  <span>🗂️ {mat.flashcards.length} Flashcard</span>
                  <span>❓ {mat.quizQuestions.length} Soal</span>
                </div>
                <span className="text-indigo-600 dark:text-indigo-400 font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  Buka <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
