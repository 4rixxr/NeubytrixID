import { Material, SchoolLevel } from '../types';
import { validAnalysis } from '../shared/materialValidation';
export async function requestApi<T>(url: string, body: unknown, signal?: AbortSignal): Promise<T> {
  const controller = new AbortController();
  const abort = () => controller.abort();
  signal?.addEventListener('abort', abort, { once: true });
  const timeout = setTimeout(abort, 60000);
  try {
    if (signal?.aborted) controller.abort();
    const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), signal: controller.signal });
    const data = await response.json().catch(() => ({ error: 'Server tidak mengembalikan data yang valid. Jalankan aplikasi melalui server NeubytrixID.' }));
    if (!response.ok || data.error || data.fallback) throw new Error(data.error || 'AI belum dapat memproses permintaan. Silakan coba lagi.');
    return data as T;
  } catch (error) {
    if (controller.signal.aborted) throw new Error(signal?.aborted ? 'Permintaan dibatalkan.' : 'Permintaan melewati batas waktu. Coba kembali.');
    if (error instanceof TypeError) throw new Error('Tidak dapat terhubung ke server. Periksa koneksi dan coba kembali.');
    throw error;
  } finally { clearTimeout(timeout); signal?.removeEventListener('abort', abort); }
}
export async function analyzeUploadedFile(fileName: string, fileType: string, schoolLevel: SchoolLevel, grade: string, rawContent?: string): Promise<Partial<Material>> {
  const data = await requestApi<unknown>('/api/gemini/analyze-material', { fileName, fileType, schoolLevel, grade, rawContent });
  if (!validAnalysis(data)) throw new Error('Hasil analisis tidak lengkap. Materi belum disimpan. Coba kembali.');
  return { ...data, originalFileName: fileName, rawText: rawContent || [data.summary.simpleOverview, ...data.summary.bulletPoints].join('\n') };
}
export interface ChatMessageItem { id: string; sender: 'user' | 'ai'; text: string; time: string; modelUsed?: string; grounded?: boolean; searchQueries?: string[]; sources?: Array<{ title: string; uri: string }>; attachedDocTitle?: string; }
export interface ChatOptions { model?: string; systemInstruction?: string; useSearch?: boolean; documentContext?: { id?: string; title: string; fileName?: string; content: string; summary?: string }; userContext?: { name: string; schoolLevel: string; grade: string }; signal?: AbortSignal; }
export async function sendGeminiChatMessage(history: Array<{ role: 'user' | 'model'; content: string }>, options: ChatOptions = {}) {
  const messages = history.slice(-29);
  while (messages[0]?.role === 'model') messages.shift();
  const { signal, ...body } = options;
  const data = await requestApi<{ response: string; modelUsed: string; grounded: boolean; searchQueries: string[]; sources: Array<{ title: string; uri: string }> }>('/api/gemini/chat', { ...body, messages }, signal);
  if (!data.response?.trim()) throw new Error('AI tidak memberikan jawaban. Coba kembali.');
  return { text: data.response, modelUsed: data.modelUsed, grounded: data.grounded, searchQueries: data.searchQueries, sources: (data.sources || []).filter(s => /^https?:\/\//i.test(s.uri)) };
}
export async function askAiTutor(query: string, userContext: { name: string; schoolLevel: string; grade: string }, activeMaterial?: Material | null) {
  const data = await requestApi<{ response: string }>('/api/gemini/tutor', { query, userContext, activeMaterial });
  return data.response;
}
