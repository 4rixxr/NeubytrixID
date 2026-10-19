import React, { useEffect } from 'react';
import { Home, BookOpen, MessageCircle, CircleHelp, TrendingUp, Layers, CalendarDays, Settings, LogOut, X, ArrowUpRight, SlidersHorizontal } from 'lucide-react';
import { UserProfile } from '../types';
import { Brand } from './LearningLanding';
export type ExtendedView = 'home' | 'materi' | 'ai' | 'quiz' | 'progress' | 'flashcards' | 'timeline' | 'settings' | 'material-detail';
interface SidebarProps { currentView: ExtendedView; onChangeView: (view: ExtendedView) => void; isOpen: boolean; onClose: () => void; profile: UserProfile; onLogout: () => void; onViewHomePage: () => void; onReopenOnboarding?: () => void; }
export function Sidebar({ currentView, onChangeView, isOpen, onClose, profile, onLogout, onViewHomePage, onReopenOnboarding }: SidebarProps) {
  const items = [ { id: 'home', label: 'Beranda belajar', icon: Home }, { id: 'materi', label: 'Materi saya', icon: BookOpen }, { id: 'ai', label: 'Tanya Neuby AI', icon: MessageCircle }, { id: 'flashcards', label: 'Flashcards', icon: Layers }, { id: 'quiz', label: 'Latihan kuis', icon: CircleHelp }, { id: 'progress', label: 'Progres belajar', icon: TrendingUp }, { id: 'timeline', label: 'Target 6 bulan', icon: CalendarDays } ];
  useEffect(() => {
    if (!isOpen) return;
    const old = document.body.style.overflow; document.body.style.overflow = 'hidden';
    const close = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', close);
    return () => { document.body.style.overflow = old; document.removeEventListener('keydown', close); };
  }, [isOpen, onClose]);
  function select(view: ExtendedView) { onChangeView(view); onClose(); }
  return <>{isOpen && <button className="nb-sidebar-overlay" onClick={onClose} aria-label="Tutup menu" />}<aside id="neubytrix-sidebar" className={`nb-sidebar ${isOpen ? 'open' : ''}`}><div className="nb-sidebar-brand"><Brand onClick={onViewHomePage} /><button className="nb-icon-button nb-sidebar-close" onClick={onClose} aria-label="Tutup sidebar"><X size={18} /></button></div><nav aria-label="Menu ruang belajar"><div className="nb-side-label">RUANG BELAJAR</div>{items.map(({ id, label, icon: Icon }) => <button key={id} id={`sidebar-link-${id}`} className={`nb-side-link ${currentView === id || (id === 'materi' && currentView === 'material-detail') ? 'active' : ''}`} aria-current={currentView === id ? 'page' : undefined} onClick={() => select(id as ExtendedView)}><Icon size={17} strokeWidth={1.7} />{label}</button>)}<div className="nb-side-label" style={{ marginTop: 23 }}>PERSONALISASI</div><button className={`nb-side-link ${currentView === 'settings' ? 'active' : ''}`} id="sidebar-link-settings" onClick={() => select('settings')}><Settings size={17} />Pengaturan</button><button className="nb-side-link" onClick={() => { onClose(); onReopenOnboarding?.(); }}><SlidersHorizontal size={17} />Atur tujuan belajar</button><button className="nb-side-link" onClick={onViewHomePage}><ArrowUpRight size={17} />Halaman depan</button></nav><div className="nb-sidebar-foot"><button className="nb-side-profile" onClick={() => select('settings')}><span className="nb-avatar">{profile.name.slice(0, 1).toUpperCase()}</span><span><strong>{profile.name}</strong><small>{profile.schoolLevel} · {profile.grade}</small></span></button><button id="sidebar-logout-btn" className="nb-side-logout" onClick={onLogout}><LogOut size={13} />Keluar profil</button></div></aside></>;
}
