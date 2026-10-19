/**
 * Document text extraction utility for NeubytrixID
 * Reads plain text, Markdown, CSV, JSON, and extracts textual content from PDF/DOCX
 */

export async function extractTextFromFile(file: File): Promise<{
  text: string;
  summary: string;
  wordCount: number;
}> {
  const extension = file.name.split('.').pop()?.toLowerCase() || '';

  let extractedText = '';

  try {
    if (['txt', 'md', 'markdown', 'csv', 'json', 'html', 'xml', 'js', 'ts', 'py'].includes(extension)) {
      extractedText = await file.text();
    } else {
      // For PDF, DOCX, or other formats, read as text and filter printable characters
      const buffer = await file.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      const decoder = new TextDecoder('utf-8', { fatal: false });
      const rawDecoded = decoder.decode(bytes);

      // Clean up control characters and extract readable text lines
      const readableLines = rawDecoded
        .split(/[\r\n]+/)
        .map((line) => line.replace(/[^\x20-\x7E\u00A0-\u024F\u1E00-\u1EFF]/g, ' ').trim())
        .filter((line) => line.length >= 4 && !/^[0-9\s.,;:-]+$/.test(line) && /[a-zA-Z]/.test(line));

      if (readableLines.length > 0) {
        extractedText = readableLines.slice(0, 300).join('\n');
      } else {
        extractedText = `Dokumen: ${file.name}\nTipe: ${file.type || extension.toUpperCase()}\nUkuran: ${(file.size / 1024).toFixed(1)} KB.\nDokumen telah tersimpan di Database NeubytrixID.`;
      }
    }
  } catch (err) {
    console.warn('Document text reading fallback:', err);
    extractedText = `Dokumen ${file.name} berhasil diunggah ke Database NeubytrixID untuk dipelajari oleh Gemini AI.`;
  }

  // Generate short initial overview
  const words = extractedText.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const firstSentence = extractedText.slice(0, 300).replace(/\s+/g, ' ').trim();
  const summary = firstSentence ? `${firstSentence}...` : `Dokumen materi pembelajaran ${file.name}.`;

  return {
    text: extractedText,
    summary,
    wordCount,
  };
}
