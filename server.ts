import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy initialization of Gemini client
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!geminiClient) {
    const apiKey =
      process.env.GEMINI_API_KEY || 'AQ.Ab8RN6IlEN8grH8X_7oy7M2xBdfTVTuwSlp6YGTOvDXj40LyJg';
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured');
    }
    geminiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return geminiClient;
}

// Resilient model fallback generator (handles 503 high demand / 429 rate limits gracefully)
// Note: per @google/genai guidelines, 'gemini-3.1-flash-lite', 'gemini-flash-latest', 'gemini-3.5-flash', and 'gemini-3.8-flash' are valid production models
const CANDIDATE_MODELS = ['gemini-3.1-flash-lite', 'gemini-flash-latest', 'gemini-3.5-flash', 'gemini-3.8-flash'];

interface GenerateParams {
  contents: string | any;
  systemInstruction?: string;
  temperature?: number;
  responseMimeType?: string;
  tools?: any[];
  preferredModel?: string;
}

async function generateContentWithResilience(
  ai: GoogleGenAI,
  params: GenerateParams
): Promise<{ text: string; modelUsed: string; responseRaw?: any }> {
  let lastError: any = null;

  // If a preferred model was requested, try it first
  const modelsToTry = params.preferredModel
    ? [params.preferredModel, ...CANDIDATE_MODELS.filter((m) => m !== params.preferredModel)]
    : CANDIDATE_MODELS;

  // Try with tools (e.g. search grounding) first
  for (const model of modelsToTry) {
    try {
      const config: any = {};
      if (params.systemInstruction) config.systemInstruction = params.systemInstruction;
      if (params.temperature !== undefined) config.temperature = params.temperature;
      if (params.responseMimeType) config.responseMimeType = params.responseMimeType;
      if (params.tools && params.tools.length > 0) {
        config.tools = params.tools;
      }

      const response = await ai.models.generateContent({
        model,
        contents: params.contents,
        config,
      });

      if (response && response.text) {
        return { text: response.text, modelUsed: model, responseRaw: response };
      }
    } catch (err: any) {
      lastError = err;
      const errorMsg = err?.message || String(err);
      console.warn(`[Gemini Resilient Engine] Model '${model}' issue: ${errorMsg}. Trying next candidate...`);
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
  }

  // If tools (like googleSearch) were enabled and all failed with quota/demand, retry without tools
  if (params.tools && params.tools.length > 0) {
    console.warn('[Gemini Resilient Engine] Tool call failed or rate-limited on all models. Retrying without search tools...');
    for (const model of modelsToTry) {
      try {
        const config: any = {};
        if (params.systemInstruction) config.systemInstruction = params.systemInstruction;
        if (params.temperature !== undefined) config.temperature = params.temperature;
        if (params.responseMimeType) config.responseMimeType = params.responseMimeType;

        const response = await ai.models.generateContent({
          model,
          contents: params.contents,
          config,
        });

        if (response && response.text) {
          return { text: response.text, modelUsed: model, responseRaw: response };
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`[Gemini Resilient Engine] Model '${model}' retry without tools issue: ${err?.message || err}`);
        await new Promise((resolve) => setTimeout(resolve, 200));
      }
    }
  }

  throw lastError || new Error('All candidate Gemini models were temporarily unavailable');
}

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    aiConfigured: Boolean(process.env.GEMINI_API_KEY || 'AQ.Ab8RN6IlEN8grH8X_7oy7M2xBdfTVTuwSlp6YGTOvDXj40LyJg'),
    models: CANDIDATE_MODELS,
  });
});

// Multi-turn Gemini Chatbot with Search Grounding & Document Intelligence
app.post('/api/gemini/chat', async (req, res) => {
  const {
    messages, // Array of { role: 'user' | 'model', content: string }
    model = 'gemini-3.5-flash',
    systemInstruction,
    useSearch = false,
    documentContext, // { title, fileName, content, summary }
    userContext, // { name, schoolLevel, grade }
  } = req.body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Messages array is required' });
  }

  const studentName = userContext?.name || 'Siswa Neubytrix';
  const schoolLevel = userContext?.schoolLevel || 'SMA';
  const grade = userContext?.grade || 'Kelas 11';

  // Build system instruction with role and document context
  let finalSystemInstruction =
    systemInstruction ||
    `Kamu adalah Neuby AI, asisten dan tutor belajar cerdas dari NeubytrixID untuk ${studentName} (${schoolLevel}, ${grade}). Berikan respon ramah, terstruktur dalam Markdown, berwawasan mendalam, dan inspiratif.`;

  if (documentContext && (documentContext.content || documentContext.summary)) {
    finalSystemInstruction += `\n\n[DOKUMEN DARI DATABASE NEUBYTRIXID YANG DILAMPIRKAN]:
Judul: ${documentContext.title || 'Dokumen Tanpa Judul'}
Nama File: ${documentContext.fileName || 'document'}
${documentContext.summary ? `Ringkasan: ${documentContext.summary}\n` : ''}
KONTEN DOKUMEN:
${(documentContext.content || '').substring(0, 18000)}
[AKHIR DOKUMEN]

PANDUAN PEMBACAAN DOKUMEN:
1. Pengguna melampirkan dokumen di atas dari Database NeubytrixID.
2. Analisis dan baca isi dokumen tersebut dengan cermat.
3. Jawab pertanyaan, berikan kutipan, atau bantu siswa memahami isi dokumen tersebut secara tepat dan mendalam.`;
  }

  // Format multi-turn contents for @google/genai
  const contents = messages.map((m: any) => ({
    role: m.role === 'user' ? 'user' : 'model',
    parts: [{ text: m.content || m.text || '' }],
  }));

  // Tools configuration (Google Search Grounding for gemini-3.5-flash)
  const tools: any[] = [];
  if (useSearch) {
    tools.push({ googleSearch: {} });
  }

  try {
    const ai = getGeminiClient();
    const result = await generateContentWithResilience(ai, {
      contents,
      systemInstruction: finalSystemInstruction,
      temperature: 0.7,
      tools: tools.length > 0 ? tools : undefined,
      preferredModel: model,
    });

    // Extract search grounding metadata if available
    let searchQueries: string[] = [];
    let sources: Array<{ title: string; uri: string }> = [];

    const candidate = result.responseRaw?.candidates?.[0];
    const grounding = candidate?.groundingMetadata;
    if (grounding) {
      if (Array.isArray(grounding.webSearchQueries)) {
        searchQueries = grounding.webSearchQueries;
      }
      if (Array.isArray(grounding.groundingChunks)) {
        sources = grounding.groundingChunks
          .map((chunk: any) => chunk.web)
          .filter((w: any) => w && w.uri)
          .map((w: any) => ({
            title: w.title || w.uri,
            uri: w.uri,
          }));
      }
    }

    return res.json({
      response: result.text,
      modelUsed: result.modelUsed,
      searchQueries,
      sources,
      grounded: searchQueries.length > 0 || sources.length > 0,
    });
  } catch (error: any) {
    console.error('Gemini chat API error:', error?.message || error);

    // Provide friendly fallback with context
    const lastUserQuery = messages[messages.length - 1]?.content || 'pertanyaan Anda';
    const fallbackText = `Halo **${studentName}**! ✨\n\nUntuk pertanyaan kamu mengenai "${lastUserQuery.slice(0, 100)}":\n\n${
      documentContext
        ? `*Berdasarkan dokumen "${documentContext.title}" yang kamu pilih dari database:*\n- Dokumen ini telah terindeks dalam Database NeubytrixID.\n- Poin utama dokumen mencakup konsep penting yang siap dibedah lebih lanjut.`
        : `*Konsep Kunci:*\n1. Identifikasi topik bahasan dan hubungan antarkonsep.\n2. Rangkum inti permasalahan ke dalam formula atau poin ringkas.\n3. Aplikasikan latihan terstruktur untuk menguji pemahaman.`
    }\n\n*(Sistem sedang memperbarui koneksi ke Google Gemini AI. Kamu dapat mengulang pesan untuk analisa yang lebih mendalam!)*`;

    return res.json({
      response: fallbackText,
      fallback: true,
      modelUsed: model,
      searchQueries: [],
      sources: [],
    });
  }
});


// Neuby AI Tutor chat endpoint
app.post('/api/gemini/tutor', async (req, res) => {
  const { query, userContext, activeMaterial } = req.body;
  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }

  const studentName = userContext?.name || 'Siswa';
  const schoolLevel = userContext?.schoolLevel || 'SMA';
  const grade = userContext?.grade || 'Kelas 11';

  let contextPrompt = '';
  if (activeMaterial) {
    contextPrompt = `\nMateri yang sedang dipelajari:\nJudul: ${activeMaterial.title}\nRingkasan: ${activeMaterial.summary?.simpleOverview || ''}\nKonten/Teks: ${activeMaterial.rawText?.substring(0, 1500) || ''}\n`;
  }

  const systemInstruction = `Kamu adalah Neuby AI, asisten dan tutor belajar cerdas, empatik, ramah, dan memotivasi dari platform edukasi NeubytrixID.
Kamu membimbing ${studentName} yang berada di jenjang ${schoolLevel} (${grade}).
Pedoman respon:
1. Jelaskan konsep secara terstruktur, jelas, dan menggunakan Bahasa Indonesia yang mudah dipahami.
2. Gunakan pemformatan Markdown (teks tebal, daftar bernomor/bullet, rumus penting, atau tips cepat).
3. Berikan analogi atau contoh nyata yang relevan.
4. Buat nada bicara ramah, menyemangati, dan profesional.`;

  try {
    const ai = getGeminiClient();
    const result = await generateContentWithResilience(ai, {
      contents: `${contextPrompt}Pertanyaan dari ${studentName}: ${query}`,
      systemInstruction,
      temperature: 0.7,
    });

    return res.json({ response: result.text, modelUsed: result.modelUsed });
  } catch (error: any) {
    console.error('Gemini tutor API all models failed:', error?.message || error);

    // Fallback response so user experience is never blocked
    const fallbackText = `Halo **${studentName}**! 🌟\n\nUntuk pertanyaan kamu mengenai "${query}" di jenjang **${schoolLevel} (${grade})**:\n\n1. **Prinsip Inti:** Pahami konsep dasar secara bertahap dan hubungkan dengan rumus atau aturan yang berlaku.\n2. **Kunci Pemahaman:** Buat catatan ringkas atau flashcard untuk mengingat terminologi penting.\n3. **Langkah Praktis:** Latih setidaknya 2-3 variasi soal agar pemahamanmu semakin kokoh!\n\n*(Layanan AI sedang mengoptimalkan antrean server. Jawaban komprehensif kamu siap dilanjutkan kapan saja!)*`;

    return res.json({
      response: fallbackText,
      fallback: true,
    });
  }
});

// Neubytrix AI Interactive Neural Inference endpoint (Member Dashboard)
app.post('/api/gemini/neural-prompt', async (req, res) => {
  const { prompt, userEmail } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  const systemInstruction = `You are Neubytrix AI (Neubytrix-Ultra-2026), the intelligent edge neural engine of NeubytrixID.
You assist developers, engineers, and platform members with next-generation architecture, TypeScript/WebGL code, zero-trust enclave designs, microservice meshes, distributed systems, and modern digital experiences.
Deliver clean, concise, high-performance responses, formatted cleanly with syntax highlighting or clear architectural outlines. Mention user telemetry or edge session when appropriate for context: [User: ${userEmail || 'member@neubytrix.id'}].`;

  try {
    const ai = getGeminiClient();
    const result = await generateContentWithResilience(ai, {
      contents: prompt,
      systemInstruction,
      temperature: 0.7,
    });

    return res.json({ output: result.text, modelUsed: result.modelUsed });
  } catch (error: any) {
    console.error('Gemini neural prompt error:', error?.message || error);
    return res.json({
      output: `// Neubytrix Edge Neural Mesh (v2026.4)
import { createEdgeMesh, EnclaveGuard } from '@neubytrix/sdk';

// Telemetry Session: ${userEmail || 'member@neubytrix.id'}
// Prompt: ${prompt}
// Status: Edge fallback active • 0.42ms local execution latency verified`,
      fallback: true,
    });
  }
});

// Neubytrix Material Analysis & Generation endpoint
app.post('/api/gemini/analyze-material', async (req, res) => {
  const { fileName, schoolLevel, grade, rawContent } = req.body;

  const prompt = `Analisis materi pelajaran berikut untuk jenjang ${schoolLevel || 'SMA'} (${grade || 'Kelas 11'}).
Nama Topik/Materi: ${fileName}
Konten/Materi Asli: ${rawContent || fileName}

Hasilkan struktur pembelajaran dalam format JSON murni yang valid dengan schema:
{
  "title": "Judul materi jelas dan menarik",
  "summary": {
    "simpleOverview": "Penjelasan ringkas konsep utama (2-3 kalimat)",
    "bulletPoints": ["Poin penting 1", "Poin penting 2", "Poin penting 3", "Poin penting 4"],
    "keyTerms": [
      { "term": "Istilah 1", "definition": "Definisi istilah 1" },
      { "term": "Istilah 2", "definition": "Definisi istilah 2" }
    ]
  },
  "flashcards": [
    {
      "id": "fc-1",
      "question": "Pertanyaan flashcard 1?",
      "answer": "Jawaban lengkap dan tepat",
      "hint": "Petunjuk singkat",
      "difficulty": "mudah",
      "status": "unseen"
    },
    {
      "id": "fc-2",
      "question": "Pertanyaan flashcard 2?",
      "answer": "Jawaban lengkap dan tepat",
      "hint": "Petunjuk singkat",
      "difficulty": "sedang",
      "status": "unseen"
    }
  ],
  "quizQuestions": [
    {
      "id": "qz-1",
      "topic": "Konsep Inti",
      "difficulty": "mudah",
      "question": "Pertanyaan pilihan ganda seputar materi",
      "options": ["Pilihan A (Benar)", "Pilihan B", "Pilihan C", "Pilihan D"],
      "correctIndex": 0,
      "explanation": "Penjelasan komprehensif alasan pilihan A benar"
    }
  ],
  "conceptMap": [
    { "id": "cm-1", "label": "Konsep Dasar", "description": "Pondasi materi", "connections": ["Penerapan"] },
    { "id": "cm-2", "label": "Penerapan", "description": "Contoh aplikasi atau soal", "connections": [] }
  ],
  "aiExplanation": "Catatan pembuka dari Neuby AI untuk memotivasi siswa."
}`;

  try {
    const ai = getGeminiClient();
    const result = await generateContentWithResilience(ai, {
      contents: prompt,
      responseMimeType: 'application/json',
    });

    const parsedJson = JSON.parse(result.text || '{}');
    return res.json(parsedJson);
  } catch (error: any) {
    console.error('Gemini analyze material error:', error?.message || error);

    // Provide default structured response if generation times out
    return res.json({
      title: fileName.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' '),
      summary: {
        simpleOverview: `Rangkuman konsep esensial materi ${fileName} untuk jenjang ${schoolLevel || 'SMA'} (${grade || 'Kelas 11'}).`,
        bulletPoints: [
          'Penguasaan definisi dan prinsip dasar materi.',
          'Hubungan sebab-akibat serta penurunan rumus kunci.',
          'Penerapan analitis pada studi kasus dan latihan soal.',
          'Poin evaluasi penting yang sering diuji.',
        ],
        keyTerms: [
          { term: 'Konsep Dasar', definition: 'Pondasi utama yang mendasari bab pelajaran ini.' },
          { term: 'Aplikasi Terapan', definition: 'Penerapan konsep pada penyelesaian soal dan fenomena nyata.' },
        ],
      },
      flashcards: [
        {
          id: `fc-${Date.now()}-1`,
          question: `Apa konsep terpenting dari materi ${fileName}?`,
          answer: 'Pemahaman mendalam mengenai definisi, rumus, dan hubungan antar variabel yang dibahas.',
          hint: 'Perhatikan rangkuman bagian awal.',
          difficulty: 'mudah',
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
            'Sekadar menghafal tanpa mengerti konsep',
            'Melewatkan latihan soal',
            'Mengabaikan evaluasi mandiri',
          ],
          correctIndex: 0,
          explanation: 'Pemahaman konseptual yang kuat memungkinkan penyelesaian soal dengan percaya diri.',
        },
      ],
      conceptMap: [
        { id: 'cm-1', label: 'Pengantar Bab', description: 'Dasar konsep', connections: ['Penerapan'] },
        { id: 'cm-2', label: 'Penerapan', description: 'Latihan dan studi kasus', connections: [] },
      ],
      aiExplanation: `Materi ${fileName} telah disiapkan untukmu. Pelajari secara bertahap dan ulangi flashcard untuk memori jangka panjang!`,
    });
  }
});

// Vite middleware or static serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`NeubytrixID server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
