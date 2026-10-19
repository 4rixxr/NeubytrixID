import React, { useCallback, useEffect, useState } from 'react';
import { LearningLanding, LearningGoal } from './components/LearningLanding';
import { AuthModal } from './components/AuthModal';
const OnboardingFlow = React.lazy(() => import('./components/OnboardingFlow').then(m => ({ default: m.OnboardingFlow })));
const NeubytrixMainApp = React.lazy(() => import('./components/NeubytrixMainApp').then(m => ({ default: m.NeubytrixMainApp })));
import { ThemeMode, RegisteredUser, UserProfile } from './types';
import { createCleanZeroStats, loadUserDataByCode, saveUserDataByCode } from './utils/userCodeStore';
import { generateUserCode, withoutPassword } from './utils/localAuth';
import { readJson, readText, removeStored, writeJson, writeText } from './utils/storage';
import { logOutFromFirebase, onAuthUserChanged } from './services/firebase';

function readSession(): RegisteredUser | null {
  const user = readJson<RegisteredUser | null>('neubytrix-current-user', null);
  return user && typeof user.code === 'string' && typeof user.fullName === 'string' ? withoutPassword(user) : null;
}
export default function App() {
  const [theme, setTheme] = useState<ThemeMode>(() => readText('neubytrix-theme') === 'dark' ? 'dark' : 'light');
  const [user, setUser] = useState<RegisteredUser | null>(readSession);
  const [view, setView] = useState<'landing' | 'dashboard'>(() => readSession() ? 'dashboard' : 'landing');
  const [onboarding, setOnboarding] = useState<UserProfile | null>(null);
  const [draftUser, setDraftUser] = useState<RegisteredUser | null>(null);
  const [authMode, setAuthMode] = useState<'register' | 'enter-code' | null>(null);
  const [storageWarning, setStorageWarning] = useState(false);
  const closeAuth = useCallback(() => setAuthMode(null), []);
  useEffect(() => { document.documentElement.classList.toggle('dark', theme === 'dark'); document.documentElement.classList.toggle('light', theme === 'light'); writeText('neubytrix-theme', theme); }, [theme]);
  useEffect(() => { document.title = view === 'dashboard' ? 'Ruang belajar — NeubytrixID' : 'NeubytrixID — Belajar dengan caramu'; window.scrollTo(0, 0); }, [view, onboarding]);
  useEffect(() => { const listener = () => setStorageWarning(true); window.addEventListener('neubytrix-storage-warning', listener); return () => window.removeEventListener('neubytrix-storage-warning', listener); }, []);
  useEffect(() => onAuthUserChanged(firebaseUser => {
    const active = readSession();
    if (active?.authProvider === 'google' && (!firebaseUser || active.uid !== firebaseUser.uid)) { removeStored('neubytrix-current-user'); setUser(null); setView('landing'); }
  }), []);
  function login(next: RegisteredUser) {
    const safe = withoutPassword(next);
    setUser(safe); writeJson('neubytrix-current-user', safe); setAuthMode(null);
    const saved = loadUserDataByCode(safe.code, safe);
    if (!saved.profile.onboardingCompleted) { setDraftUser(safe); setOnboarding(saved.profile); }
    setView('dashboard');
  }
  function start(goal: LearningGoal) {
    const guest = readJson<RegisteredUser | null>('neubytrix-guest-user', null);
    const nextUser = user || (guest?.code?.startsWith('TAMU-') ? guest : null) || { fullName: 'Pelajar', email: '', code: generateUserCode('TAMU'), createdAt: new Date().toISOString(), role: 'Profil tamu' };
    const data = loadUserDataByCode(nextUser.code, nextUser);
    const schoolLevel = goal === 'Kuliah' ? 'Kuliah' : goal === 'Sekolah' ? data.profile.schoolLevel : 'SMA';
    const grade = goal === 'Kuliah' ? 'Semester 1' : goal === 'Sekolah' ? data.profile.grade : 'Kelas 12';
    setDraftUser(nextUser); setOnboarding({ ...data.profile, schoolLevel, grade, targets: [goal === 'Sekolah' ? 'Meningkatkan nilai' : `Persiapan ${goal}`] });
  }
  function finish(profile: UserProfile) {
    const nextUser = draftUser || user; if (!nextUser) return;
    const data = loadUserDataByCode(nextUser.code, nextUser);
    saveUserDataByCode(nextUser.code, { ...data, profile: { ...data.profile, ...profile, id: data.profile.id, onboardingCompleted: true } });
    if (nextUser.code.startsWith('TAMU-')) writeJson('neubytrix-guest-user', nextUser);
    setUser(nextUser); writeJson('neubytrix-current-user', nextUser); setOnboarding(null); setView('dashboard');
  }
  async function logout() { await logOutFromFirebase(); removeStored('neubytrix-current-user'); setUser(null); setOnboarding(null); setView('landing'); }
  const toggleTheme = () => setTheme(current => current === 'light' ? 'dark' : 'light');
  return <React.Suspense fallback={<div className="min-h-screen grid place-items-center text-sm" role="status">Menyiapkan ruang belajarmu…</div>}>
    {storageWarning && <div role="alert" className="nb-error" style={{ position: 'fixed', bottom: 80, left: 18, right: 18, zIndex: 150 }}>Penyimpanan browser penuh atau diblokir. Perubahan sementara bisa hilang setelah halaman ditutup. Ekspor cadangan progres melalui Pengaturan.</div>}
    {onboarding ? <OnboardingFlow initialUser={draftUser || user} initialProfile={onboarding} theme={theme} onToggleTheme={toggleTheme} onComplete={finish} onExit={() => setOnboarding(null)} /> : view === 'dashboard' && user ? <NeubytrixMainApp key={user.code} user={user} profile={loadUserDataByCode(user.code, user).profile} theme={theme} onToggleTheme={toggleTheme} onLogout={logout} onViewHomePage={() => setView('landing')} onReopenOnboarding={() => { setDraftUser(user); setOnboarding(loadUserDataByCode(user.code, user).profile); }} /> : <LearningLanding theme={theme} onToggleTheme={toggleTheme} onStart={start} onLogin={() => setAuthMode('enter-code')} signedIn={!!user} onDashboard={() => setView('dashboard')} />}
    {authMode && <AuthModal mode={authMode} onClose={closeAuth} onSuccess={login} />}
  </React.Suspense>;
}
