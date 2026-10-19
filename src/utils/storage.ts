const volatile = new Map<string, string>();
export function readText(key: string): string | null {
  try { return volatile.get(key) ?? localStorage.getItem(key) ?? null; } catch { return volatile.get(key) ?? null; }
}
export function readJson<T>(key: string, fallback: T): T {
  try { const value = readText(key); return value ? JSON.parse(value) as T : fallback; } catch { return fallback; }
}
export function writeText(key: string, value: string): boolean {
  try { localStorage.setItem(key, value); volatile.delete(key); return true; }
  catch { volatile.set(key, value); if (typeof window !== 'undefined') window.dispatchEvent(new Event('neubytrix-storage-warning')); return false; }
}
export function writeJson(key: string, value: unknown): boolean { return writeText(key, JSON.stringify(value)); }
export function removeStored(key: string) { volatile.delete(key); try { localStorage.removeItem(key); } catch { /* Clear in-memory session even if browser storage is blocked. */ } }
