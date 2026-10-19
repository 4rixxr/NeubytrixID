import React from 'react';
import { Home, BookOpen, Bot, HelpCircle, TrendingUp } from 'lucide-react';

export type MainTabType = 'home' | 'materi' | 'ai' | 'quiz' | 'progress';

interface BottomNavProps {
  activeTab: MainTabType;
  onChangeTab: (tab: MainTabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onChangeTab }) => {
  const navItems = [
    { id: 'home' as MainTabType, label: 'Beranda', icon: Home },
    { id: 'materi' as MainTabType, label: 'Materi', icon: BookOpen },
    { id: 'ai' as MainTabType, label: 'AI', icon: Bot },
    { id: 'quiz' as MainTabType, label: 'Kuis', icon: HelpCircle },
    { id: 'progress' as MainTabType, label: 'Progres', icon: TrendingUp },
  ];

  return (
    <nav
      id="neubytrix-bottom-nav"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800/80 px-2 sm:px-6 py-1.5 transition-all md:hidden"
    >
      <div className="max-w-md mx-auto grid grid-cols-5 gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`bottom-nav-${item.id}`}
              onClick={() => onChangeTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all ${
                isActive
                  ? 'text-indigo-700 dark:text-indigo-300 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 font-normal'
              }`}
            >
              <div
                className={`p-1 rounded-lg transition-transform ${
                  isActive ? 'bg-indigo-500/15 scale-110' : ''
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-400'}`} />
              </div>
              <span className="text-[11px] tracking-tight mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
