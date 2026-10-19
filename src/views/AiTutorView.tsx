import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Bot,
  User,
  Sparkles,
  Paperclip,
  Search,
  Globe,
  Database,
  FileText,
  Upload,
  CheckCircle2,
  Trash2,
  ExternalLink,
  ChevronDown,
  BookOpen,
  Zap,
  BrainCircuit,
  Code2,
  HelpCircle,
  Copy,
  Check,
  RefreshCw,
  X,
  FileCheck,
} from 'lucide-react';
import { UserProfile, Material } from '../types';
import { sendGeminiChatMessage, ChatMessageItem } from '../services/apiService';
import { useFirebaseData } from '../hooks/useFirebaseData';
import { StoredDocument } from '../services/firebase';

interface AiTutorViewProps {
  profile: UserProfile;
  activeMaterial?: Material | null;
  userCode?: string;
  onAddXp: (amount: number) => void;
  onAiQuestionAsked?: () => void;
}

type BotRole = 'tutor' | 'researcher' | 'coder' | 'fast';
type GeminiModel = 'gemini-3.5-flash' | 'gemini-3.8-flash' | 'gemini-3.1-flash-lite' | 'gemini-flash-latest';

interface RoleConfig {
  id: BotRole;
  label: string;
  icon: any;
  description: string;
  systemInstruction: string;
}

const BOT_ROLES: RoleConfig[] = [
  {
    id: 'tutor',
    label: 'Neuby AI Tutor',
    icon: BookOpen,
    description: 'Tutor ramah, penjelasan bertahap, analogi mudah dipahami.',
    systemInstruction: `Kamu adalah Neuby AI Tutor, asisten dan tutor belajar cerdas, sabar, empatik, dan inspiratif dari NeubytrixID.
Pedoman respon:
1. Bimbing siswa memahami konsep secara bertahap dan gunakan analogi kontekstual sehari-hari.
2. Gunakan pemformatan Markdown yang sangat rapi (teks tebal, nomor langkah, tabel, atau rumus).
3. Jika siswa bertanya soal, jangan langsung berikan jawaban mentah tanpa penjelasan cara penyelesaiannya.
4. Gunakan Bahasa Indonesia yang ramah, santun, dan memotivasi.`,
  },
  {
    id: 'researcher',
    label: 'Deep Researcher',
    icon: BrainCircuit,
    description: 'Riset mendalam, analisis data terstruktur, fakta terverifikasi.',
    systemInstruction: `Kamu adalah Neubytrix Deep Research Intelligence.
Pedoman respon:
1. Berikan analisa komprehensif, akademis, dan berbasis fakta ilmiah objektif.
2. Strukturkan jawaban: Ringkasan Eksekutif, Analisis Mendalam, Komparasi Fakta, dan Kesimpulan.
3. Rujuk fakta terkini secara akurat.`,
  },
  {
    id: 'coder',
    label: 'Code & Tech Mentor',
    icon: Code2,
    description: 'Arsitektur sistem, TypeScript, Python, dan pemecahan bug.',
    systemInstruction: `Kamu adalah Neubytrix Code & Tech Architect.
Pedoman respon:
1. Berikan solusi kode yang bersih, type-safe (TypeScript/Python/Modern Web), dan optimal.
2. Jelaskan kompleksitas waktu/ruang (Big-O) jika relevan.
3. Sertakan komentar pada kode dan berikan praktik terbaik modern.`,
  },
  {
    id: 'fast',
    label: 'Quick Exam Coach',
    icon: Zap,
    description: 'Poin kunci ujian, rumus kilat, dan hafalan efisien.',
    systemInstruction: `Kamu adalah Quick Exam Coach dari NeubytrixID.
Pedoman respon:
1. Sajikan jawaban yang sangat padat, to-the-point, dan berorientasi pada kunci jawaban ujian.
2. Gunakan poin-poin singkat dan sorot kata kunci penting dengan teks tebal.`,
  },
];

export const AiTutorView: React.FC<AiTutorViewProps> = ({
  profile,
  activeMaterial,
  userCode = 'NBT-2026-0001',
  onAddXp,
  onAiQuestionAsked,
}) => {
  // Firebase Data & Document Store
  const {
    firebaseUser,
    isGoogleUser,
    documents,
    isUploadingDoc,
    uploadAndSaveDocument,
    handleGoogleLogin,
  } = useFirebaseData(userCode, profile);

  // Gemini Configuration States
  const [selectedRole, setSelectedRole] = useState<BotRole>('tutor');
  const [selectedModel, setSelectedModel] = useState<GeminiModel>('gemini-3.1-flash-lite');
  const [useSearchGrounding, setUseSearchGrounding] = useState<boolean>(true);

  // Attached Document from Database State
  const [activeDocument, setActiveDocument] = useState<StoredDocument | null>(null);
  const [isDocDropdownOpen, setIsDocDropdownOpen] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Multi-turn Messages
  const [messages, setMessages] = useState<ChatMessageItem[]>([
    {
      id: 'welcome-msg',
      sender: 'ai',
      text: `Halo **${profile.name}**! 👋 Saya **Gemini AI Chatbot** dari platform **NeubytrixID**.\n\nSaya dapat membantu membimbing materi pelajaran untuk jenjang **${profile.schoolLevel} (${profile.grade})**, membaca dokumen materi dari **Database Firestore**, serta mencari data terbaru dengan **Google Search Grounding**.\n\nApa topik atau dokumen yang ingin kita pelajari hari ini?`,
      time: 'Baru saja',
      modelUsed: 'gemini-3.1-flash-lite',
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState<string>('Gemini sedang mengetik...');

  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Auto-scroll on new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Set default active document if activeMaterial is provided
  useEffect(() => {
    if (activeMaterial && !activeDocument) {
      const matchDoc = documents.find((d) => d.id === activeMaterial.id || d.title === activeMaterial.title);
      if (matchDoc) {
        setActiveDocument(matchDoc);
      } else if (activeMaterial.rawText) {
        setActiveDocument({
          id: activeMaterial.id,
          userId: userCode,
          title: activeMaterial.title,
          subject: activeMaterial.subject,
          fileName: activeMaterial.originalFileName || `${activeMaterial.title}.pdf`,
          fileType: activeMaterial.fileType,
          rawText: activeMaterial.rawText,
          summary: activeMaterial.summary?.simpleOverview,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
    }
  }, [activeMaterial, documents, activeDocument, userCode]);

  // Handle Send Message (Multi-turn)
  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const userMsgId = `msg-${Date.now()}`;
    const userMsg: ChatMessageItem = {
      id: userMsgId,
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attachedDocTitle: activeDocument?.title,
    };

    // Update conversation thread
    const newThread = [...messages, userMsg];
    setMessages(newThread);
    setInput('');
    setLoading(true);

    // Dynamic loading status indicator
    if (activeDocument) {
      setLoadingStatus(`Membaca dokumen "${activeDocument.title}" dari database...`);
    } else if (useSearchGrounding) {
      setLoadingStatus('Mengakses Google Search Grounding...');
    } else {
      setLoadingStatus('Gemini sedang memproses...');
    }

    try {
      // Prepare history formatted for multi-turn Gemini API
      const historyForApi = newThread.map((m) => ({
        role: (m.sender === 'user' ? 'user' : 'model') as 'user' | 'model',
        content: m.text,
      }));

      // Find role system instruction
      const currentRoleObj = BOT_ROLES.find((r) => r.id === selectedRole) || BOT_ROLES[0];

      // Document context payload from Firestore database
      const documentContext = activeDocument
        ? {
            id: activeDocument.id,
            title: activeDocument.title,
            fileName: activeDocument.fileName,
            content: activeDocument.rawText,
            summary: activeDocument.summary,
          }
        : undefined;

      const result = await sendGeminiChatMessage(historyForApi, {
        model: selectedModel,
        systemInstruction: currentRoleObj.systemInstruction,
        useSearch: useSearchGrounding,
        documentContext,
        userContext: {
          name: profile.name,
          schoolLevel: profile.schoolLevel,
          grade: profile.grade,
        },
      });

      const aiMsg: ChatMessageItem = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: result.text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: result.modelUsed || selectedModel,
        grounded: result.grounded,
        searchQueries: result.searchQueries,
        sources: result.sources,
        attachedDocTitle: activeDocument?.title,
      };

      setMessages((prev) => [...prev, aiMsg]);
      onAddXp(25);
      if (onAiQuestionAsked) {
        onAiQuestionAsked();
      }
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'ai',
          text: 'Maaf, terjadi gangguan koneksi ke server Gemini. Silakan coba kembali sebentar lagi!',
          time: 'Baru saja',
          modelUsed: selectedModel,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Handle Document Upload directly from Chat
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const saved = await uploadAndSaveDocument(file, 'Dokumen Chat');
      setActiveDocument(saved);

      // Add a notification message in chat
      setMessages((prev) => [
        ...prev,
        {
          id: `doc-alert-${Date.now()}`,
          sender: 'ai',
          text: `📄 **Dokumen Berhasil Disimpan ke Database Firestore!**\n\n**Judul:** ${saved.title}\n**File:** ${saved.fileName} (${(file.size / 1024).toFixed(1)} KB)\n\nGemini sekarang telah membaca isi dokumen ini. Tanyakan apa saja mengenai dokumen tersebut!`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          modelUsed: selectedModel,
          attachedDocTitle: saved.title,
        },
      ]);
    } catch (err: any) {
      console.error('Upload error in chat:', err);
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `fresh-${Date.now()}`,
        sender: 'ai',
        text: `Sesi percakapan baru telah dimulai. Mode aktif: **${
          BOT_ROLES.find((r) => r.id === selectedRole)?.label
        }** dengan model **${selectedModel}**.\n${
          activeDocument ? `\n📄 Dokumen aktif: **${activeDocument.title}** (dari Database).` : ''
        }\nSilakan ajukan pertanyaanmu!`,
        time: 'Baru saja',
        modelUsed: selectedModel,
      },
    ]);
  };

  // Handle Google Login from Chat
  const handleChatGoogleLogin = async () => {
    try {
      await handleGoogleLogin();
    } catch (err: any) {
      if (err?.code === 'auth/popup-blocked' || err?.message?.includes('popup-blocked')) {
        setMessages((prev) => [
          ...prev,
          {
            id: `auth-notice-${Date.now()}`,
            sender: 'ai',
            text: '💡 **Info Autentikasi Google:** Browser atau iframe memblokir popup Google Sign-In. Anda tetap dapat menggunakan seluruh fitur AI Chatbot dan Database materi secara normal.',
            time: 'Baru saja',
            modelUsed: selectedModel,
          },
        ]);
      }
    }
  };
  const docQuickActions = [
    { label: '📖 Ringkas Dokumen', prompt: `Tolong buatkan ringkasan komprehensif dari dokumen "${activeDocument?.title}" ini dengan poin-poin utama.` },
    { label: '❓ 5 Soal Latihan', prompt: `Buatkan 5 soal latihan pilihan ganda beserta kunci jawaban dan penjelasannya berdasarkan dokumen "${activeDocument?.title}".` },
    { label: '🔍 Istilah Kunci', prompt: `Jelaskan semua istilah atau konsep kunci yang terdapat dalam dokumen "${activeDocument?.title}".` },
    { label: '💡 Rumus & Formula', prompt: `Ekstrak dan jelaskan rumus atau aturan penting yang ada di dalam dokumen "${activeDocument?.title}".` },
  ];

  // General Quick Prompts
  const generalQuickPrompts = [
    'Jelaskan cara kerja sistem respirasi sel dan siklus Krebs',
    'Rumus diskriminan dan sifat akar persamaan kuadrat',
    'Perbedaan respirasi aerob dan anaerob',
    'Tips manajemen waktu belajar persiapan ujian',
  ];

  return (
    <div
      id="neubytrix-gemini-ai-chat-view"
      className="space-y-4 pb-20 md:pb-8 max-w-4xl mx-auto flex flex-col h-[calc(100vh-130px)]"
    >
      {/* 1. TOP CONTROL BAR */}
      <div className="p-3.5 sm:p-4 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Brand & Status */}
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/25 shrink-0">
              <Bot className="w-5 h-5" />
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5">
                  Gemini Chatbot
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                    Neubytrix AI
                  </span>
                </h1>

                {/* Firestore Database Sync Badge */}
                <div
                  className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    isGoogleUser
                      ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                      : 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800'
                  }`}
                  title={isGoogleUser ? `Tersimpan di Cloud Firestore (${firebaseUser?.email})` : 'Disimpan di Firestore lokal'}
                >
                  <Database className="w-3 h-3" />
                  <span>{isGoogleUser ? 'Firestore Cloud Terhubung' : 'Database Aktif'}</span>
                </div>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Multi-turn reasoning • Membaca Dokumen Database • Google Search Grounding
              </p>
            </div>
          </div>

          {/* Action Tools & Google Sign-In */}
          <div className="flex items-center gap-2 flex-wrap">
            {!isGoogleUser && (
              <button
                id="btn-google-signin-chat"
                onClick={handleChatGoogleLogin}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 text-slate-800 dark:text-slate-200 text-xs font-semibold shadow-xs hover:bg-slate-50 transition-all cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5 text-blue-500" />
                <span>Masuk Akun Google</span>
              </button>
            )}

            <button
              onClick={handleClearChat}
              title="Mulai Sesi Baru"
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Configuration Row: Model Selector, Role Selector, Search Grounding Toggle */}
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2.5 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            {/* Model Selector */}
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <select
                id="select-gemini-model"
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value as GeminiModel)}
                className="bg-transparent font-bold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer text-xs"
              >
                <option value="gemini-3.1-flash-lite" className="dark:bg-slate-900">
                  gemini-3.1-flash-lite (Rekomendasi • Cepat & Stabil)
                </option>
                <option value="gemini-flash-latest" className="dark:bg-slate-900">
                  gemini-flash-latest (Auto Model Terbaru)
                </option>
                <option value="gemini-3.5-flash" className="dark:bg-slate-900">
                  gemini-3.5-flash (Search Grounding)
                </option>
                <option value="gemini-3.8-flash" className="dark:bg-slate-900">
                  gemini-3.8-flash (General Reasoning)
                </option>
              </select>
            </div>

            {/* Role Selector */}
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
              {React.createElement(BOT_ROLES.find((r) => r.id === selectedRole)?.icon || BookOpen, {
                className: 'w-3.5 h-3.5 text-purple-500',
              })}
              <select
                id="select-gemini-role"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as BotRole)}
                className="bg-transparent font-bold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer text-xs"
              >
                {BOT_ROLES.map((r) => (
                  <option key={r.id} value={r.id} className="dark:bg-slate-900">
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Google Search Grounding Toggle */}
          <div className="flex items-center gap-2">
            <button
              id="toggle-search-grounding"
              type="button"
              onClick={() => setUseSearchGrounding(!useSearchGrounding)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                useSearchGrounding
                  ? 'bg-blue-50 dark:bg-blue-950/70 border-blue-400 dark:border-blue-600 text-blue-700 dark:text-blue-300 shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
              }`}
            >
              <Search className={`w-3.5 h-3.5 ${useSearchGrounding ? 'text-blue-600 dark:text-blue-400' : ''}`} />
              <span>Google Search Grounding</span>
              <span
                className={`text-[9px] px-1.5 py-0.2 rounded-md ${
                  useSearchGrounding
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {useSearchGrounding ? 'AKTIF' : 'OFF'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. DATABASE DOCUMENT INTELLIGENCE PANEL */}
      <div className="px-1">
        <div className="flex items-center justify-between gap-2 p-2.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-800/50">
          {/* Active document pill or prompt to select */}
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-indigo-600/10 dark:bg-indigo-500/20 border border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300 flex items-center justify-center shrink-0">
              <Database className="w-4 h-4" />
            </div>

            <div className="min-w-0">
              {activeDocument ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-slate-900 dark:text-white truncate">
                    📄 Membaca: {activeDocument.title}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 shrink-0">
                    Tersimpan di Database
                  </span>
                </div>
              ) : (
                <div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Database Dokumen Tersimpan ({documents.length} Dokumen)
                  </span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    Pilih dokumen dari database agar Gemini dapat membaca seluruh isinya
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Document selection & upload actions */}
          <div className="flex items-center gap-2 shrink-0">
            {activeDocument && (
              <button
                onClick={() => setActiveDocument(null)}
                title="Lepas dokumen aktif"
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Dropdown for picking document from database */}
            <div className="relative">
              <button
                id="btn-select-doc-database"
                type="button"
                onClick={() => setIsDocDropdownOpen(!isDocDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300 text-xs font-bold shadow-xs hover:bg-indigo-50/50 transition-all cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Pilih Dokumen</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {isDocDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 p-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl z-40 space-y-1 max-h-64 overflow-y-auto">
                  <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800">
                    Dokumen di Cloud Firestore
                  </div>
                  {documents.length === 0 ? (
                    <div className="p-3 text-center text-xs text-slate-500">
                      Belum ada dokumen tersimpan. Silakan unggah dokumen baru!
                    </div>
                  ) : (
                    documents.map((doc) => (
                      <button
                        key={doc.id}
                        type="button"
                        onClick={() => {
                          setActiveDocument(doc);
                          setIsDocDropdownOpen(false);
                        }}
                        className={`w-full text-left p-2 rounded-xl flex items-start gap-2.5 transition-colors cursor-pointer ${
                          activeDocument?.id === doc.id
                            ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-bold'
                            : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <FileText className="w-4 h-4 shrink-0 mt-0.5 text-indigo-500" />
                        <div className="min-w-0 flex-1">
                          <div className="text-xs truncate font-semibold">{doc.title}</div>
                          <div className="text-[10px] text-slate-400 truncate">
                            {doc.fileType} • {doc.fileName}
                          </div>
                        </div>
                        {activeDocument?.id === doc.id && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        )}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Quick Upload Button */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.doc,.txt,.md,.json,.csv"
              onChange={handleFileUpload}
              className="hidden"
              id="chat-file-upload-input"
            />
            <button
              id="btn-upload-doc-chat"
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadingDoc}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              {isUploadingDoc ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Upload className="w-3.5 h-3.5" />
              )}
              <span className="hidden sm:inline">Upload Dokumen Baru</span>
              <span className="sm:hidden">Upload</span>
            </button>
          </div>
        </div>

        {/* Quick Action Chips when a Document is Active */}
        {activeDocument && (
          <div className="flex items-center gap-1.5 overflow-x-auto py-2 no-scrollbar">
            {docQuickActions.map((qa, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(qa.prompt)}
                className="text-[11px] px-3 py-1 rounded-xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 whitespace-nowrap transition-all shadow-xs cursor-pointer shrink-0 font-medium active:scale-95"
              >
                {qa.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 3. SCROLLABLE MESSAGES THREAD */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 scroll-smooth">
        {messages.map((m) => {
          const isUser = m.sender === 'user';
          const isCopied = copiedId === m.id;

          return (
            <div
              key={m.id}
              className={`flex items-start gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {/* Bot Avatar */}
              {!isUser && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shrink-0 mt-1 shadow-md shadow-indigo-600/20">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              {/* Message Content Bubble */}
              <div
                className={`max-w-[88%] sm:max-w-[78%] rounded-3xl p-4 sm:p-5 text-xs sm:text-sm leading-relaxed transition-all shadow-xs relative group ${
                  isUser
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-br-none shadow-md shadow-indigo-600/25'
                    : 'bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-none'
                }`}
              >
                {/* User Attached Document Tag */}
                {isUser && m.attachedDocTitle && (
                  <div className="mb-2 flex items-center gap-1.5 text-[10px] bg-white/15 px-2.5 py-1 rounded-lg w-fit text-indigo-100 font-semibold">
                    <FileCheck className="w-3 h-3" />
                    <span>Sumber: {m.attachedDocTitle} (Database)</span>
                  </div>
                )}

                {/* AI Header badges */}
                {!isUser && (
                  <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-100 dark:border-slate-800/80">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                        {m.modelUsed || selectedModel}
                      </span>

                      {m.grounded && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center gap-1 border border-blue-200 dark:border-blue-800">
                          <Globe className="w-2.5 h-2.5 text-blue-500" />
                          <span>Google Search Grounded</span>
                        </span>
                      )}

                      {m.attachedDocTitle && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 flex items-center gap-1">
                          <Database className="w-2.5 h-2.5" />
                          <span>Dokumen: {m.attachedDocTitle}</span>
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleCopyText(m.text, m.id)}
                      title="Salin jawaban"
                      className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                )}

                {/* Message Body */}
                <div className="whitespace-pre-line leading-relaxed font-normal">
                  {m.text}
                </div>

                {/* Search Grounding Sources & Queries (if present) */}
                {!isUser && m.sources && m.sources.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-1.5">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Search className="w-3 h-3 text-blue-500" />
                      <span>Sumber Penelusuran Google:</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {m.sources.slice(0, 4).map((src, sIdx) => (
                        <a
                          key={sIdx}
                          href={src.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/60 border border-slate-200 dark:border-slate-700 text-blue-600 dark:text-blue-400 font-medium transition-colors"
                        >
                          <span className="truncate max-w-[180px]">{src.title}</span>
                          <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Timestamp */}
                <div
                  className={`text-[10px] mt-2 font-medium ${
                    isUser ? 'text-indigo-200 text-right' : 'text-slate-400 dark:text-slate-500'
                  }`}
                >
                  {m.time}
                </div>
              </div>

              {/* User Avatar */}
              {isUser && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-1 shadow-sm">
                  {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
            </div>
          );
        })}

        {/* Loading Spinner with Status */}
        {loading && (
          <div className="flex items-center gap-3 text-xs text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900/90 p-4 rounded-2xl w-fit border border-indigo-200 dark:border-indigo-800 shadow-md animate-pulse">
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 animate-spin" />
            <span className="font-semibold">{loadingStatus}</span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* 4. GENERAL STARTER PROMPTS (if few messages) */}
      {messages.length <= 2 && (
        <div className="flex gap-2 overflow-x-auto py-1 px-0.5 no-scrollbar scroll-smooth">
          {generalQuickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(prompt)}
              className="text-[11px] px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white hover:border-indigo-400 dark:hover:border-indigo-500/50 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 whitespace-nowrap transition-all shadow-xs cursor-pointer shrink-0 active:scale-95"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* 5. INPUT BAR & CONTROLS */}
      <div className="relative p-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg">
        {/* Active attachment banner above input if document selected */}
        {activeDocument && (
          <div className="flex items-center justify-between px-3 py-1.5 mb-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800/40 text-xs">
            <div className="flex items-center gap-1.5 text-indigo-700 dark:text-indigo-300 truncate">
              <FileCheck className="w-3.5 h-3.5 shrink-0 text-indigo-600" />
              <span className="font-bold truncate">Gemini membaca: {activeDocument.title}</span>
            </div>
            <button
              onClick={() => setActiveDocument(null)}
              className="text-slate-400 hover:text-slate-700 dark:hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        <div className="flex items-center gap-2">
          {/* Paperclip attachment button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            title="Upload atau Lampirkan Dokumen ke Database"
            className="p-2.5 rounded-xl text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
            placeholder={
              activeDocument
                ? `Tanyakan sesuatu tentang dokumen "${activeDocument.title}"...`
                : 'Tanyakan konsep pelajaran, minta ringkasan, atau bahas soal ujian...'
            }
            className="flex-1 bg-transparent px-2 py-2 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
          />

          {/* Send Button */}
          <button
            id="btn-send-gemini-chat"
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            className="p-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-40 text-white font-bold transition-all shadow-md shadow-indigo-600/20 active:scale-95 cursor-pointer shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
