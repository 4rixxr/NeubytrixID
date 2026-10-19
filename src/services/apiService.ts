import { Material, SchoolLevel } from '../types';

export const analyzeUploadedFile = async (
  fileName: string,
  _fileType: string,
  schoolLevel: SchoolLevel,
  grade: string,
  rawContent?: string
): Promise<Partial<Material>> => {
  try {
    const response = await fetch('/api/gemini/analyze-material', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fileName,
        fileType: _fileType,
        schoolLevel,
        grade,
        rawContent,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data && data.summary) {
        return {
          title: data.title || fileName.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' '),
          originalFileName: fileName,
          rawText: rawContent || data.summary.simpleOverview || '',
          summary: data.summary,
          flashcards: data.flashcards || [],
          quizQuestions: data.quizQuestions || [],
          conceptMap: data.conceptMap || [],
          aiExplanation: data.aiExplanation || 'Materi berhasil dianalisis dengan Neuby AI.',
        };
      }
    }
  } catch (err) {
    console.warn('Fallback to local analyzer:', err);
  }

  // Fallback if offline or API unavailable
  const content =
    rawContent ||
    `Materi ${fileName}: Membahas konsep penting sesuai kurikulum ${schoolLevel} (${grade}). Disusun secara terstruktur untuk memudahkan pemahaman dengan konsep kunci dan latihan terarah.`;

  return {
    title: fileName.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' '),
    originalFileName: fileName,
    rawText: content,
    summary: {
      simpleOverview: `Ringkasan materi ${fileName} untuk jenjang ${schoolLevel} ${grade}, memuat konsep utama dan prinsip penting yang perlu dikuasai.`,
      bulletPoints: [
        'Konsep dasar dan definisi esensial materi.',
        'Prinsip kerja, rumus, atau urutan langkah penerapan.',
        'Contoh kasus kontekstual dan tips mengingat cepat.',
        'Poin evaluasi yang sering muncul pada ujian sekolah.',
      ],
      keyTerms: [
        { term: 'Konsep Inti', definition: 'Ide pokok yang mendasari seluruh pembahasan dalam bab ini.' },
        { term: 'Aplikasi Praktis', definition: 'Penerapan konsep dalam kehidupan sehari-hari atau penyelesaian soal.' },
      ],
    },
    flashcards: [
      {
        id: `fc-${Date.now()}-1`,
        question: `Apa konsep terpenting dari materi ${fileName}?`,
        answer: 'Pemahaman mendalam mengenai definisi, rumus, dan hubungan antar variabel yang dibahas.',
        hint: 'Perhatikan bagian awal bab rangkuman materi.',
        difficulty: 'mudah',
        status: 'unseen',
      },
      {
        id: `fc-${Date.now()}-2`,
        question: 'Bagaimana cara menerapkan materi ini saat menghadapi soal ujian?',
        answer: 'Identifikasi variabel yang diketahui, hubungkan dengan rumus utama, lalu hitung secara sistematis.',
        hint: 'Langkah terstruktur 3 tahap.',
        difficulty: 'sedang',
        status: 'unseen',
      },
    ],
    quizQuestions: [
      {
        id: `qz-${Date.now()}-1`,
        topic: 'Konsep Dasar',
        difficulty: 'mudah',
        question: `Tujuan utama dari mempelajari materi ${fileName} adalah...`,
        options: [
          'Memahami konsep dasar secara konseptual dan terapan',
          'Hanya sekadar menghafal definisi tanpa mengerti rumus',
          'Mengabaikan latihan soal mandiri',
          'Melewatkan evaluasi pemahaman berkala',
        ],
        correctIndex: 0,
        explanation: 'Pemahaman konseptual yang kuat memungkinkan siswa menyelesaikan berbagai variasi soal dengan percaya diri.',
      },
    ],
    conceptMap: [
      { id: 'cm-1', label: 'Pengantar Bab', description: 'Dasar konsep', connections: ['Penerapan'] },
      { id: 'cm-2', label: 'Penerapan', description: 'Contoh nyata dan latihan', connections: [] },
    ],
    aiExplanation: `Materi ${fileName} ini sangat menarik dan aplikatif untuk siswa ${schoolLevel} (${grade}). Pelajari secara bertahap dan ulangi flashcard untuk retensi memori jangka panjang!`,
  };
};

export interface ChatMessageItem {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  time: string;
  modelUsed?: string;
  grounded?: boolean;
  searchQueries?: string[];
  sources?: Array<{ title: string; uri: string }>;
  attachedDocTitle?: string;
}

export interface ChatOptions {
  model?: string;
  systemInstruction?: string;
  useSearch?: boolean;
  documentContext?: {
    id?: string;
    title: string;
    fileName?: string;
    content: string;
    summary?: string;
  };
  userContext?: {
    name: string;
    schoolLevel: string;
    grade: string;
  };
}

export const sendGeminiChatMessage = async (
  history: Array<{ role: 'user' | 'model'; content: string }>,
  options: ChatOptions = {}
): Promise<{
  text: string;
  modelUsed: string;
  grounded?: boolean;
  searchQueries?: string[];
  sources?: Array<{ title: string; uri: string }>;
}> => {
  try {
    const response = await fetch('/api/gemini/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: history,
        model: options.model || 'gemini-3.5-flash',
        systemInstruction: options.systemInstruction,
        useSearch: options.useSearch ?? false,
        documentContext: options.documentContext,
        userContext: options.userContext,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return {
        text: data.response || 'Tidak ada balasan dari model.',
        modelUsed: data.modelUsed || options.model || 'gemini-3.5-flash',
        grounded: Boolean(data.grounded),
        searchQueries: data.searchQueries || [],
        sources: data.sources || [],
      };
    }
  } catch (err) {
    console.warn('sendGeminiChatMessage error:', err);
  }

  // Fallback
  return {
    text: `Halo! Saya Neuby AI. Koneksi jaringan sedang disesuaikan. Jika Anda melampirkan dokumen atau mengaktifkan pencarian web, silakan ulangi pesan dalam beberapa saat.`,
    modelUsed: options.model || 'gemini-3.5-flash',
    grounded: false,
    searchQueries: [],
    sources: [],
  };
};

export const askAiTutor = async (

  query: string,
  userContext: { name: string; schoolLevel: string; grade: string },
  activeMaterial?: Material | null
): Promise<string> => {
  try {
    const response = await fetch('/api/gemini/tutor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query,
        userContext,
        activeMaterial,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data && data.response) {
        return data.response;
      }
    }
  } catch (error) {
    console.warn('Using local fallback for askAiTutor:', error);
  }

  // Fallback responses if offline or server disconnected
  const q = query.toLowerCase();

  if (q.includes('lambung') || q.includes('pencernaan') || q.includes('enzim') || q.includes('pepsin')) {
    return `Hai **${userContext.name}**! Di lambung terjadi pencernaan kimiawi dan mekanik:

1. **Getah Lambung** menghasilkan asam klorida (**HCl**) yang berfungsi membunuh bakteri patogen dan mengaktifkan pepsinogen menjadi **pepsin**.
2. **Enzim Pepsin**: Memecah molekul protein kompleks menjadi pepton (rantai peptida yang lebih pendek).
3. **Enzim Renin**: Berfungsi mengendapkan kasein (protein susu).
4. **Lapisan Mukus**: Melindungi dinding lambung agar tidak terkikis oleh asam lambung sendiri.

💡 *Tips Ujian*: Jika ada soal tentang pencernaan protein pertama kali terjadi di mana, jawabannya adalah di **lambung** (bukan di mulut)!`;
  }

  if (q.includes('fungsi kuadrat') || q.includes('parabola') || q.includes('diskriminan')) {
    return `Halo **${userContext.name}**! Berikut rangkuman rumus cepat **Fungsi Kuadrat** ($y = ax^2 + bx + c$):

• **Diskriminan**: $D = b^2 - 4ac$
  - Jika $D > 0$: Memotong sumbu X di 2 titik nyata berbeda.
  - Jika $D = 0$: Menyinggung sumbu X di 1 titik (akar kembar).
  - Jika $D < 0$: Melayang (tidak menyentuh sumbu X).

• **Sumbu Simetri**: $x = -\\frac{b}{2a}$
• **Nilai Puncak / Optimum**: $y = -\\frac{D}{4a}$

Apakah kamu mau mencoba satu contoh soal perhitungan koordinat puncak? 📐`;
  }

  if (q.includes('eksplanasi') || q.includes('bahasa')) {
    return `Halo **${userContext.name}**! **Teks Eksplanasi** memiliki 3 struktur wajib:

1. **Pernyataan Umum**: Mengenalkan fenomena atau peristiwa yang akan diterangkan (misalnya: Proses Terjadinya Gempa Bumi).
2. **Deretan Penjelas**: Rangkaian sebab-akibat (kausalitas) dan kronologis bagaimana peristiwa tersebut terjadi step-by-step.
3. **Interpretasi / Ulasan**: Kesimpulan atau tanggapan penutup penulis atas fenomena tersebut.`;
  }

  return `Pertanyaan bagus, **${userContext.name}**! 🌟

Untuk jenjang **${userContext.schoolLevel} (${userContext.grade})**, kunci memahami topik "${query}" adalah:
1. Pahami definisi inti tanpa menghafal kaku.
2. Identifikasi rumus atau hukum dasar yang berlaku.
3. Hubungkan dengan contoh di kehidupan sehari-hari.

Apakah kamu ingin penjelasan yang lebih mendalam, contoh soal latihan kuis, atau peta konsep singkat untuk topik ini?`;
};
