import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, X, Copy, Check, Globe } from 'lucide-react';
import { RegisteredUser } from '../types';
import { Brand } from './LearningLanding';
import { generateUserCode, saveUserCredentials, verifyUserCodePassword } from '../utils/localAuth';
import { createCleanZeroStats, saveUserDataByCode } from '../utils/userCodeStore';
import { signInWithGoogle, isFirebaseConfigured } from '../services/firebase';

export function AuthModal({ mode, onClose, onSuccess }: { mode: 'register' | 'enter-code'; onClose: () => void; onSuccess: (user: RegisteredUser) => void }) {
  const [register, setRegister] = useState(mode === 'register');
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [created, setCreated] = useState<RegisteredUser | null>(null);
  const [copied, setCopied] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const active = useRef(true);
  useEffect(() => {
    active.current = true;
    const oldFocus = document.activeElement as HTMLElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden'; dialogRef.current?.focus();
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'Tab') {
        const items = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>('button:not(:disabled), input, [href], [tabindex="0"]') ?? []);
        const first = items[0], last = items[items.length - 1];
        if (event.shiftKey && (document.activeElement === first || document.activeElement === dialogRef.current)) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && (document.activeElement === last || document.activeElement === dialogRef.current)) { event.preventDefault(); first?.focus(); }
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => { active.current = false; document.body.style.overflow = overflow; document.removeEventListener('keydown', handleKey); oldFocus?.focus(); };
  }, [onClose]);
  async function submit(event: React.FormEvent) {
    event.preventDefault(); if (busy) return;
    setBusy(true); setError('');
    try {
      if (register) {
        if (name.trim().length < 2) throw new Error('Isi nama setidaknya 2 karakter.');
        if (password.length < 8) throw new Error('Gunakan password minimal 8 karakter.');
        const user: RegisteredUser = { fullName: name.trim(), email: '', code: generateUserCode(), createdAt: new Date().toISOString(), authProvider: 'manual', role: 'Profil perangkat' };
        await saveUserCredentials(user.code, password, user);
        saveUserDataByCode(user.code, createCleanZeroStats(user.code, user));
        if (active.current) { setCreated(user); setPassword(''); }
      } else {
        const result = await verifyUserCodePassword(code, password);
        if (!result.valid || !result.user) throw new Error(result.message);
        if (active.current) onSuccess(result.user);
      }
    } catch (e) { if (active.current) setError(e instanceof Error ? e.message : 'Belum berhasil. Silakan coba kembali.'); }
    finally { if (active.current) setBusy(false); }
  }
  async function googleLogin() {
    if (busy) return; setBusy(true); setError('');
    try {
      const google = await signInWithGoogle();
      if (active.current) onSuccess({ fullName: google.displayName || 'Pelajar', email: google.email || '', uid: google.uid, code: `NBT-G-${google.uid}`, createdAt: google.metadata.creationTime || new Date().toISOString(), authProvider: 'google' });
    } catch { if (active.current) setError('Google belum dapat dihubungkan. Periksa konfigurasi Firebase, domain login, dan izin popup.'); }
    finally { if (active.current) setBusy(false); }
  }
  return <div className="nb-auth-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}><div ref={dialogRef} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="auth-title" className="nb-auth">
    <button className="nb-icon-button" style={{ position: 'absolute', right: 15, top: 15 }} aria-label="Tutup formulir masuk" onClick={onClose}><X size={19} /></button><Brand />
    {created ? <><h2 id="auth-title">Profilmu sudah siap.</h2><p>Simpan kode ini untuk masuk kembali di browser ini. Password tidak disimpan sebagai teks biasa.</p><div className="nb-auth-code">{created.code}</div><button className="nb-auth-google" onClick={async () => { try { await navigator.clipboard.writeText(created.code); setCopied(true); } catch { setError('Tidak dapat menyalin otomatis. Pilih dan salin kode di atas.'); } }}>{copied ? <Check size={16} /> : <Copy size={16} />}{copied ? 'Kode disalin' : 'Salin kode profil'}</button><button className="nb-primary" onClick={() => onSuccess(created)}>Atur tujuan belajar <ArrowRight size={17} /></button></> : <>
      <h2 id="auth-title">{register ? 'Mulai perjalananmu.' : 'Senang bertemu lagi.'}</h2><p>Gunakan profil perangkat untuk menyimpan progres di browser ini{isFirebaseConfigured ? ', atau masuk dengan Google.' : '.'}</p>
      {isFirebaseConfigured && <><button disabled={busy} className="nb-auth-google" onClick={googleLogin}><Globe size={17} />Lanjut dengan Google</button><div className="nb-auth-or">atau profil perangkat</div></>}
      <form onSubmit={submit}>{register ? <><label htmlFor="auth-name">Nama panggilan</label><input id="auth-name" value={name} maxLength={80} autoComplete="name" onChange={e => setName(e.target.value)} placeholder="Kamu ingin dipanggil apa?" required /></> : <><label htmlFor="auth-code">Kode profil perangkat</label><input id="auth-code" value={code} maxLength={100} onChange={e => setCode(e.target.value)} autoComplete="username" placeholder="NBT-…" required /></>}<label htmlFor="auth-password">Password</label><input id="auth-password" type="password" value={password} maxLength={128} autoComplete={register ? 'new-password' : 'current-password'} onChange={e => setPassword(e.target.value)} placeholder={register ? 'Minimal 8 karakter' : 'Password profilmu'} required minLength={register ? 8 : 1} /><button disabled={busy} className="nb-primary" type="submit">{busy ? 'Sebentar…' : register ? 'Buat profil perangkat' : 'Masuk ke ruang belajar'}<ArrowRight size={17} /></button></form>
      <button className="nb-auth-switch" onClick={() => { setRegister(!register); setError(''); setPassword(''); }}>{register ? 'Sudah punya kode? Masuk di sini' : 'Belum punya profil? Buat profil'}</button>
    </>}{error && <div role="alert" className="nb-error" style={{ marginTop: 15 }}>{error}</div>}
  </div></div>;
}
