import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { ThemeMode } from '../types';

interface ThemeToggleProps {
  theme: ThemeMode;
  onToggle: () => void;
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  theme,
  onToggle,
  className = '',
}) => {
  return (
    <button
      id="theme-toggle-btn"
      type="button"
      onClick={onToggle}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      className={`relative inline-flex items-center justify-center p-2.5 rounded-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 border cursor-pointer ${
        theme === 'dark'
          ? 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border-white/10 shadow-sm'
          : 'bg-white/80 hover:bg-slate-100 text-slate-700 hover:text-slate-950 border-slate-200/90 shadow-sm'
      } ${className}`}
    >
      <span className="sr-only">Toggle theme</span>
      {theme === 'dark' ? (
        <Sun className="w-4 h-4 transition-transform duration-300 rotate-0 hover:rotate-45 text-amber-400" />
      ) : (
        <Moon className="w-4 h-4 transition-transform duration-300 rotate-0 hover:-rotate-12 text-indigo-900" />
      )}
    </button>
  );
};
