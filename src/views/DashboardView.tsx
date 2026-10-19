import React from 'react';
import { ArrowRight, ArrowUpRight, BookOpen, Layers, MessageCircle, CircleHelp, Clock, Flame, Zap, CheckCircle2, Plus } from 'lucide-react';
import { UserProfile, Material, Achievement } from '../types';
import { StudyStats, UserLearningData } from '../utils/userCodeStore';
import { PomodoroTimer } from '../components/PomodoroTimer';
import { DailyCheckIn } from '../components/DailyCheckIn';
interface Props { profile: UserProfile; materials: Material[]; achievements: Achievement[]; studyStats?: StudyStats; userCode?: string; onDataUpdated?: (data: UserLearningData) => void; onNavigate: (tab: 'materi' | 'ai' | 'quiz' | 'progress' | 'flashcards' | 'timeline' | 'material-detail') => void; onSelectMaterial: (mat: Material) => void; onAddXp: (amount: number) => void; onPomodoroComplete?: (minutes: number, xp: number) => void; }
export function DashboardView({ profile, materials, studyStats, userCode = '', onDataUpdated, onNavigate, onSelectMaterial, onPomodoroComplete }: Props) {
  const first = materials.find(m => !m.mastered) || materials[0];
  const due = materials.reduce((count, m) => count + m.flashcards.filter(c => !c.dueAt || new Date(c.dueAt).getTime() <= Date.now()).length, 0);
  const metrics = [
    { title: 'Waktu belajar', value: `${studyStats?.totalStudyMinutes || 0} mnt`, note: 'Waktu aktif di ruang belajar', icon: Clock },
    { title: 'Streak check-in', value: `${profile.streakDays} hari`, note: 'Hari belajar berturut-turut', icon: Flame },
    { title: 'Akurasi kuis', value: `${studyStats?.accuracy || 0}%`, note: `${studyStats?.questionsAnswered || 0} soal dijawab`, icon: CheckCircle2 },
    { title: 'Poin pengalaman', value: `${profile.xp}`, note: `Level ${profile.level} · ${profile.levelTitle}`, icon: Zap },
  ];
  return <div id="neubytrix-dashboard-view" className="space-y-6 pb-4">
    <div className="nb-dash-heading"><div><span className="nb-eyebrow">RUANG BELAJARMU</span><h1>Halo, {profile.name.split(' ')[0]}. Siap belajar?</h1><p>Pilih materi yang ingin kamu pelajari hari ini.</p></div><button className="nb-login" id="dash-upload-btn" onClick={() => onNavigate('materi')}><Plus size={16} />Tambah materi</button></div>
    <div className="nb-study-banner"><div><span className="nb-mini-label">{first ? 'MATERI BERIKUTNYA' : 'MULAI BELAJAR'}</span><h2>{first?.title || 'Tambahkan catatan pertamamu.'}</h2><p>{first ? `${first.subject} · ${first.flashcards.length} flashcard · ${first.quizQuestions.length} soal latihan` : 'Unggah materi dari perangkat untuk memulai.'}</p><button className="nb-primary" onClick={() => first ? onSelectMaterial(first) : onNavigate('materi')}>{first ? 'Lanjut belajar' : 'Tambah materi'}<ArrowRight size={17} /></button></div><div className="nb-study-art"><span>UNTUK DIULANG</span><div><strong>{String(due).padStart(2, '0')}</strong><small className="block">flashcard siap dipelajari</small></div><span>Gunakan waktu yang ada.</span></div></div>
    <div className="nb-metrics">{metrics.map(({ title, value, note, icon: Icon }) => <article key={title} className="nb-metric"><div>{title}<Icon size={14} /></div><strong>{value}</strong><small>{note}</small></article>)}</div>
    <div className="nb-quick-grid">{[{ icon: MessageCircle, title: 'Tanya Neuby AI', sub: 'Diskusikan konsep yang sulit', tab: 'ai' }, { icon: Layers, title: 'Ulangi flashcard', sub: `${due} kartu siap diulang`, tab: 'flashcards' }, { icon: CircleHelp, title: 'Latihan kuis', sub: 'Uji pemahaman materi', tab: 'quiz' }].map(({ icon: Icon, title, sub, tab }) => <button key={tab} onClick={() => onNavigate(tab as 'ai' | 'flashcards' | 'quiz')}><Icon size={22} strokeWidth={1.5} /><strong>{title}</strong><small>{sub}</small><ArrowUpRight size={17} /></button>)}</div>
    <div className="nb-dash-columns"><section className="nb-panel"><div className="nb-panel-heading"><h2>Materi belajarmu</h2><button onClick={() => onNavigate('materi')}>Lihat semua <ArrowUpRight size={14} /></button></div>{materials.slice(0, 4).map(material => <button key={material.id} className="nb-material-row" onClick={() => onSelectMaterial(material)}><span><BookOpen size={16} /></span><span><strong>{material.title}</strong><small>{material.flashcards.length} flashcard · {material.quizQuestions.length} soal</small></span><ArrowUpRight size={15} /></button>)}{!materials.length && <p className="text-sm text-slate-500">Belum ada materi. Tambahkan catatan pertamamu.</p>}</section><PomodoroTimer onSessionComplete={onPomodoroComplete} /></div>
    <DailyCheckIn userCode={userCode} onDataUpdated={onDataUpdated} />
  </div>;
}
