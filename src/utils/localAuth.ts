import { RegisteredUser } from '../types';
import { readJson, readText, removeStored, writeJson, writeText } from './storage';
interface Credential { user: RegisteredUser; salt: string; hash: string; iterations: number }
const prefix = 'neubytrix-credential-';
const iterations = 210000;
const hex = (bytes: Uint8Array) => Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
function fromHex(value: string) { return Uint8Array.from(value.match(/.{2}/g) ?? [], b => parseInt(b, 16)); }
async function digest(password: string, salt: string, rounds: number) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: fromHex(salt), iterations: rounds, hash: 'SHA-256' }, key, 256);
  return hex(new Uint8Array(bits));
}
export function withoutPassword(user: RegisteredUser): RegisteredUser { const { password: _legacy, ...safe } = user; return safe; }
export function generateUserCode(prefix = 'NBT'): string { return `${prefix}-${crypto.randomUUID().replaceAll('-', '').slice(0, 16).toUpperCase()}`; }
export async function saveUserCredentials(code: string, password: string, user: RegisteredUser) {
  if (!crypto.subtle) throw new Error('Gunakan HTTPS atau localhost untuk melindungi password profil.');
  const cleanCode = code.trim().toUpperCase();
  const salt = hex(crypto.getRandomValues(new Uint8Array(16)));
  const hash = await digest(password, salt, iterations);
  if (!writeJson(prefix + cleanCode, { user: withoutPassword(user), salt, hash, iterations })) throw new Error('Penyimpanan browser penuh atau tidak tersedia. Profil belum dapat disimpan permanen.');
  removeStored(`neubytrix-pwd-${cleanCode}`);
  const legacy = readJson<RegisteredUser[]>('neubytrix-registered-users', []);
  if (Array.isArray(legacy)) writeJson('neubytrix-registered-users', legacy.map(u => u.code === cleanCode ? withoutPassword(u) : u));
  writeText('neubytrix-last-code', cleanCode);
}
export async function verifyUserCodePassword(code: string, password: string): Promise<{ valid: boolean; user?: RegisteredUser; message?: string }> {
  const cleanCode = code.trim().toUpperCase();
  const invalid = { valid: false, message: 'Kode atau password tidak cocok. Profil perangkat hanya dapat dibuka di browser tempat profil dibuat.' };
  if (!cleanCode || !password) return invalid;
  const credential = readJson<Credential | null>(prefix + cleanCode, null);
  if (credential) {
    if (!/^[a-f0-9]{32}$/.test(credential.salt) || !Number.isInteger(credential.iterations) || credential.iterations < 100000 || credential.iterations > 1000000) return invalid;
    return await digest(password, credential.salt, credential.iterations) === credential.hash ? { valid: true, user: withoutPassword(credential.user) } : invalid;
  }
  // Migrate a known local account after verifying its old password. Never enroll an unknown login.
  const legacy = readJson<RegisteredUser[]>('neubytrix-registered-users', []);
  const user = Array.isArray(legacy) ? legacy.find(u => u.code?.toUpperCase() === cleanCode) : undefined;
  const oldPassword = user?.password || readText(`neubytrix-pwd-${cleanCode}`);
  if (!user || user.authProvider === 'google' || !oldPassword || password !== oldPassword) return invalid;
  await saveUserCredentials(cleanCode, password, user);
  return { valid: true, user: withoutPassword(user) };
}
