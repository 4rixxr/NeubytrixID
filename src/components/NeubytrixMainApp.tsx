import React, { useCallback, useEffect, useState } from 'react';
import { UserProfile, ThemeMode, RegisteredUser, Material } from '../types';
import { UserLearningData, loadUserDataByCode, saveUserDataByCode, addStudySecondsToCode, addXpToCode, recordQuizAttemptToCode, recordFlashcardToCode, recordAiQuestionToCode, toggleTimelineTargetInCode, createCleanZeroStats } from '../utils/userCodeStore';
import { Header } from './Header';
import { Sidebar, ExtendedView } from './Sidebar';
import { BottomNav, MainTabType } from './BottomNav';
import { DashboardView } from '../views/DashboardView';
import { MaterialsView } from '../views/MaterialsView';
import { MaterialDetailView } from '../views/MaterialDetailView';
import { FlashcardsView } from '../views/FlashcardsView';
import { QuizView } from '../views/QuizView';
import { AiTutorView } from '../views/AiTutorView';
import { ProgressView } from '../views/ProgressView';
import { TimelineView } from '../views/TimelineView';
import { SettingsView } from '../views/SettingsView';
interface Props { user: RegisteredUser; profile: UserProfile; theme: ThemeMode; onToggleTheme: () => void; onLogout: () => void; onViewHomePage: () => void; onReopenOnboarding: () => void; }
export function NeubytrixMainApp({ user, theme, onToggleTheme, onLogout, onViewHomePage, onReopenOnboarding }: Props) {
  const code = user.code;
  const [data, setData] = useState(() => loadUserDataByCode(code, user));
  const [view, setView] = useState<ExtendedView>('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeId, setActiveId] = useState(data.materials[0]?.id);
  const [aiPrompt, setAiPrompt] = useState('');
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);
  const material = data.materials.find(m => m.id === activeId) || data.materials[0];
  const profile = data.profile;
  const update = (fn: (fresh: UserLearningData) => UserLearningData) => { const next = fn(loadUserDataByCode(code, user)); saveUserDataByCode(code, next); setData(next); };
  useEffect(() => {
    let lastActivity = Date.now(), lastTick = Date.now();
    const activity = () => { lastActivity = Date.now(); };
    const visibility = () => { lastTick = Date.now(); };
    ['pointerdown', 'keydown', 'wheel', 'touchstart'].forEach(type => window.addEventListener(type, activity, { passive: true }));
    document.addEventListener('visibilitychange', visibility);
    const timer = setInterval(() => { const now = Date.now(); const seconds = Math.min(15, Math.floor((now - lastTick) / 1000)); lastTick = now; if (!document.hidden && now - lastActivity < 300000 && seconds > 0) setData(addStudySecondsToCode(code, seconds)); }, 15000);
    const storage = (event: StorageEvent) => { if (event.key === `neubytrix-data-${code.toUpperCase()}`) setData(loadUserDataByCode(code, user)); };
    window.addEventListener('storage', storage);
    return () => { clearInterval(timer); ['pointerdown', 'keydown', 'wheel', 'touchstart'].forEach(type => window.removeEventListener(type, activity)); document.removeEventListener('visibilitychange', visibility); window.removeEventListener('storage', storage); };
  }, [code]);
  useEffect(() => { window.scrollTo(0, 0); }, [view]);
  function select(mat: Material) { setActiveId(mat.id); setView('material-detail'); }
  function addMaterial(mat: Material) { update(fresh => ({ ...fresh, materials: [mat, ...fresh.materials.filter(m => m.id !== mat.id)] })); setActiveId(mat.id); }
  function updateProfile(updated: UserProfile) { update(fresh => ({ ...fresh, profile: { ...fresh.profile, name: updated.name, email: updated.email, schoolLevel: updated.schoolLevel, grade: updated.grade, targets: updated.targets, learningStyles: updated.learningStyles, dailyStudyTime: updated.dailyStudyTime, tutorStyle: updated.tutorStyle, soundEffects: updated.soundEffects, isLiquidGlass: updated.isLiquidGlass } })); }
  function reset() { const fresh = createCleanZeroStats(code, user); fresh.materials = data.materials.map(m => ({ ...m, mastered: false, flashcards: m.flashcards.map(c => ({ ...c, status: 'unseen', dueAt: undefined, intervalDays: 0, reviewedAt: undefined })) })); fresh.profile = { ...profile, xp: 0, level: 1, levelTitle: fresh.profile.levelTitle, streakDays: 0, totalStudyMinutes: 0, quizzesCompleted: 0, materialsLearned: 0, target6MonthProgress: 0 }; saveUserDataByCode(code, fresh); setData(fresh); setActiveId(fresh.materials[0]?.id); setView('home'); }
  const addXp = (amount: number) => setData(addXpToCode(code, amount));
  const bottomTab = (view === 'material-detail' ? 'materi' : ['home', 'materi', 'ai', 'quiz', 'progress'].includes(view) ? view : 'home') as MainTabType;
  return <div id="neubytrix-main-app-container" className="min-h-screen" style={{ color: 'var(--nb-ink)' }}><Sidebar currentView={view} onChangeView={setView} isOpen={sidebarOpen} onClose={closeSidebar} profile={profile} onLogout={onLogout} onViewHomePage={onViewHomePage} onReopenOnboarding={onReopenOnboarding} /><div className="nb-workspace flex flex-col min-h-screen"><Header profile={profile} theme={theme} onToggleTheme={onToggleTheme} onOpenMobileMenu={() => setSidebarOpen(true)} onOpenProfile={() => setView('settings')} /><main className="flex-1 w-full mx-auto">
    {<div hidden={view !== 'home'}><DashboardView profile={profile} materials={data.materials} achievements={data.achievements} studyStats={data.studyStats} userCode={code} onDataUpdated={setData} onNavigate={setView} onSelectMaterial={select} onAddXp={addXp} onPomodoroComplete={(_minutes, xp) => addXp(xp)} /></div>}
    {view === 'materi' && <MaterialsView materials={data.materials} userCode={code} onSelectMaterial={select} onAddMaterial={addMaterial} schoolLevel={profile.schoolLevel} grade={profile.grade} />}
    {view === 'material-detail' && material && <MaterialDetailView material={material} onBack={() => setView('materi')} onOpenFlashcards={() => setView('flashcards')} onOpenQuiz={() => setView('quiz')} onAskAi={topic => { setAiPrompt(topic); setView('ai'); }} />}
    {(view === 'quiz' || view === 'flashcards') && <div className="mb-5 max-w-2xl mx-auto"><label htmlFor="active-material" className="block text-xs mb-2 text-slate-500">Materi yang dipelajari</label><select id="active-material" className="w-full p-3 rounded-xl border text-xs" style={{ background: 'var(--nb-surface)', borderColor: 'var(--nb-line)' }} value={material?.id || ''} onChange={e => setActiveId(e.target.value)}>{data.materials.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}</select></div>}
    {view === 'flashcards' && material && <FlashcardsView key={material.id} material={material} onBack={() => setView('material-detail')} onAddXp={addXp} onCardReviewed={(cardId, mastered) => setData(recordFlashcardToCode(code, mastered, material.id, cardId))} />}
    {view === 'quiz' && material && <QuizView key={material.id} material={material} onBack={() => setView('material-detail')} onAddXp={addXp} onQuizComplete={(correct, total, xp) => setData(recordQuizAttemptToCode(code, total, correct, xp, material.subject, material.id))} />}
    {['quiz', 'flashcards', 'material-detail'].includes(view) && !material && <section className="nb-panel"><h1>Belum ada materi.</h1><button className="nb-primary mt-4" onClick={() => setView('materi')}>Tambah materi</button></section>}
    {view === 'ai' && <AiTutorView profile={profile} materials={data.materials} activeMaterial={material} initialPrompt={aiPrompt} userCode={code} onAddXp={addXp} onAiQuestionAsked={() => setData(recordAiQuestionToCode(code))} />}
    {view === 'progress' && <ProgressView profile={profile} achievements={data.achievements} subjectMastery={data.subjectMastery} studyStats={data.studyStats} />}
    {view === 'timeline' && <TimelineView timeline={data.timeline} onToggleTarget={(month, target) => setData(toggleTimelineTargetInCode(code, month, target))} />}
    {view === 'settings' && <SettingsView profile={profile} theme={theme} userCode={code} onToggleTheme={onToggleTheme} onUpdateProfile={updateProfile} onResetData={reset} onReopenOnboarding={onReopenOnboarding} />}
  </main><BottomNav activeTab={bottomTab} onChangeTab={setView} /></div></div>;
}
