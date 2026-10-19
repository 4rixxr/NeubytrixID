import { requestApi } from '../services/apiService';
export const MAX_FILE_BYTES = 10 * 1024 * 1024;
export const ACCEPTED_FILES = '.pdf,.docx,.pptx,.txt,.md,.csv,.json,.png,.jpg,.jpeg,.webp';
export async function extractTextFromFile(file: File): Promise<{ text: string; summary: string; wordCount: number }> {
  const extension = file.name.split('.').pop()?.toLowerCase() || '';
  if (!file.size) throw new Error('File kosong. Pilih dokumen yang berisi materi.');
  if (file.size > MAX_FILE_BYTES) throw new Error('Ukuran file maksimal 10 MB. Pecah dokumen menjadi beberapa bagian.');
  if (!ACCEPTED_FILES.split(',').includes(`.${extension}`)) throw new Error('Format tidak didukung. Gunakan PDF, DOCX, PPTX, TXT, Markdown, CSV, JSON, PNG, JPG, atau WebP.');
  let text = '';
  if (['txt', 'md', 'csv', 'json'].includes(extension)) text = await file.text();
  else if (extension === 'docx') {
    const { default: JSZip } = await import('jszip');
    try {
      const archive = await JSZip.loadAsync(await file.arrayBuffer());
      const document = archive.file('word/document.xml');
      if (!document) throw new Error('Dokumen Word tidak valid.');
      const xml = new DOMParser().parseFromString(await document.async('string'), 'application/xml');
      if (xml.getElementsByTagName('parsererror').length) throw new Error('XML Word rusak.');
      text = Array.from(xml.getElementsByTagName('w:p'), paragraph => Array.from(paragraph.getElementsByTagName('w:t'), part => part.textContent || '').join('')).join('\n');
    } catch { throw new Error('Dokumen Word tidak dapat dibaca. Pastikan file DOCX tidak rusak atau dilindungi password.'); }
  } else if (extension === 'pptx') {
    const { default: JSZip } = await import('jszip');
    try {
      const archive = await JSZip.loadAsync(await file.arrayBuffer());
      const slides = Object.keys(archive.files).filter(name => /^ppt\/slides\/slide\d+\.xml$/.test(name)).sort((a, b) => Number(a.match(/slide(\d+)/)?.[1]) - Number(b.match(/slide(\d+)/)?.[1]));
      if (slides.length > 200) throw new Error('Maksimal 200 slide per file.');
      for (const name of slides) {
        const xml = new DOMParser().parseFromString(await archive.file(name)!.async('string'), 'application/xml');
        text += Array.from(xml.getElementsByTagName('a:t'), el => el.textContent || '').join(' ') + '\n';
        if (text.length > 100000) throw new Error('Teks terlalu panjang. Pecah file presentasi.');
      }
    } catch (e) { throw new Error(e instanceof Error && e.message.startsWith('Teks') ? e.message : 'Presentasi tidak dapat dibaca. Gunakan PPTX valid dengan maksimal 200 slide.'); }
  } else if (extension === 'pdf') {
    // The legacy bundle includes the typed-array polyfills needed by older browsers.
    const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
    const worker = await import('pdfjs-dist/legacy/build/pdf.worker.min.mjs?url');
    pdfjs.GlobalWorkerOptions.workerSrc = worker.default;
    const task = pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) });
    let pdf: Awaited<ReturnType<typeof pdfjs.getDocument>['promise']> | undefined;
    try {
      pdf = await task.promise;
      if (pdf.numPages > 100) throw new Error('PDF maksimal 100 halaman. Pecah dokumen terlebih dahulu.');
      for (let n = 1; n <= pdf.numPages; n++) {
        const page = await pdf.getPage(n), content = await page.getTextContent();
        text += content.items.map(item => 'str' in item ? `${item.str}${item.hasEOL ? '\n' : ' '}` : '').join('') + '\n';
        if (text.length > 100000) throw new Error('Teks PDF terlalu panjang. Pecah dokumen terlebih dahulu.');
      }
    } catch (e) { throw new Error(e instanceof Error ? `PDF tidak dapat diproses: ${e.message}` : 'PDF tidak dapat dibaca.'); }
    finally { await task.destroy(); }
    if (!text.trim()) text = await readWithAi(file, 'application/pdf');
  } else {
    const mime = extension === 'png' ? 'image/png' : extension === 'webp' ? 'image/webp' : 'image/jpeg';
    text = await readWithAi(file, mime);
  }
  text = text.replaceAll('\u0000', '').trim();
  if (!text) throw new Error('Tidak ditemukan teks yang dapat dibaca pada dokumen ini.');
  if (text.length > 100000) throw new Error('Teks maksimal 100.000 karakter. Pecah dokumen menjadi beberapa bagian.');
  return { text, summary: text.slice(0, 300).replace(/\s+/g, ' ') + (text.length > 300 ? '…' : ''), wordCount: text.split(/\s+/).filter(Boolean).length };
}
async function readWithAi(file: File, mimeType: string): Promise<string> {
  const data = await new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result).split(',')[1]); reader.onerror = () => reject(new Error('Gagal membaca file.')); reader.readAsDataURL(file); });
  return (await requestApi<{ text: string }>('/api/gemini/extract-document', { data, mimeType })).text;
}
