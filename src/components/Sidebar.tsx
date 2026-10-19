import React from 'react';
import {
  Home,
  BookOpen,
  Bot,
  HelpCircle,
  TrendingUp,
  Layers,
  Calendar,
  Settings,
  LogOut,
  X,
  ExternalLink,
} from 'lucide-react';
import { UserProfile } from '../types';
import { NeubytrixLogoIcon } from './Logo';

export type ExtendedView =
  | 'home'
  | 'materi'
  | 'ai'
  | 'quiz'
  | 'progress'
  | 'flashcards'
  | 'timeline'
  | 'settings'
  | 'material-detail';

interface SidebarProps {
  currentView: ExtendedView;
  onChangeView: (view: ExtendedView) => void;
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onLogout: () => void;
  onViewHomePage: () => void;
  onReopenOnboarding?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onChangeView,
  isOpen,
  onClose,
  profile,
  onLogout,
  onViewHomePage,
  onReopenOnboarding,
}) => {
  const menuItems = [
    { id: 'home' as ExtendedView, label: 'Home Dashboard', icon: Home },
    { id: 'materi' as ExtendedView, label: 'Materi Saya', icon: BookOpen },
    { id: 'ai' as ExtendedView, label: 'AI Tutor Pribadi', icon: Bot },
    { id: 'quiz' as ExtendedView, label: 'Latihan Kuis & Soal', icon: HelpCircle },
    { id: 'flashcards' as ExtendedView, label: 'Flashcards', icon: Layers },
    { id: 'progress' as ExtendedView, label: 'Progress & Statistik', icon: TrendingUp },
    { id: 'timeline' as ExtendedView, label: 'Target 6 Bulan', icon: Calendar },
    { id: 'settings' as ExtendedView, label: 'Account Dashboard', icon: Settings },
  ];

  const handleSelect = (view: ExtendedView) => {
    onChangeView(view);
    onClose();
  };

  const initial = profile.name ? profile.name.charAt(0).toUpperCase() : 'B';

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Sidebar container */}
      <aside
        id="neubytrix-sidebar"
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white/95 dark:bg-slate-950/95 border-r border-slate-200 dark:border-slate-800/90 flex flex-col justify-between transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top brand header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <NeubytrixLogoIcon size={36} className="drop-shadow-md" />
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight flex items-baseline">
                <span>Neubytrix</span><span className="text-indigo-600 dark:text-indigo-400 font-extrabold">ID</span>
              </h2>
              <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                {profile.schoolLevel} • {profile.grade}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 md:hidden"
            aria-label="Tutup sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Menu navigation */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 [scrollbar-width:thin]">
          <div className="px-3 pb-2 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Menu Utama
          </div>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-link-${item.id}`}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
                  isActive
                    ? 'bg-indigo-50 dark:bg-indigo-600/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30 font-semibold'
                    : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="pt-4 px-3 pb-2 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Portal
          </div>

          <button
            onClick={onViewHomePage}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900/60 transition-colors"
          >
            <div className="flex items-center gap-3">
              <ExternalLink className="w-4 h-4 text-slate-400" />
              <span>Halaman Depan</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-400">
              Web
            </span>
          </button>

          {onReopenOnboarding && (
            <button
              id="sidebar-onboarding-btn"
              onClick={onReopenOnboarding}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900/60 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="text-base select-none">🎓</span>
                <span>1. Onboarding</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 font-semibold border border-indigo-200 dark:border-indigo-500/30">
                Target
              </span>
            </button>
          )}
        </div>

        {/* Bottom Profile card & logout */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800/80 space-y-3">
          <div
            onClick={() => handleSelect('settings')}
            className="flex items-center gap-3 p-2 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 cursor-pointer transition-colors"
          >
            <div className="w-9 h-9 rounded-full avatar-gradient-bg text-white font-bold text-sm flex items-center justify-center flex-shrink-0 shadow-sm">
              {initial}
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">{profile.name}</p>
              <p className="text-[11px] text-purple-600 dark:text-purple-400 font-medium truncate">
                ⚡ {profile.xp} XP • {profile.levelTitle}
              </p>
            </div>
          </div>

          <button
            id="sidebar-logout-btn"
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-medium text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/20 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar Akun</span>
          </button>
        </div>
      </aside>
    </>
  );
};
