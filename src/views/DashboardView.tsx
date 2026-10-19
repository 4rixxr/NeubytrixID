import React from 'react';
import {
  Flame,
  Zap,
  Award,
  BookOpen,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Brain,
  HelpCircle,
  Layers,
  RotateCcw,
  Clock,
  Timer,
} from 'lucide-react';
import { UserProfile, Material, Achievement } from '../types';
import { StudyStats, calculateLevel, STREAK_REQUIRED_SECONDS, UserLearningData } from '../utils/userCodeStore';
import { PomodoroTimer } from '../components/PomodoroTimer';
import { DailyCheckIn } from '../components/DailyCheckIn';

interface DashboardViewProps {
  profile: UserProfile;
  materials: Material[];
  achievements: Achievement[];
  studyStats?: StudyStats;
  userCode?: string;
  onDataUpdated?: (updated: UserLearningData) => void;
  onNavigate: (tab: 'materi' | 'ai' | 'quiz' | 'progress' | 'flashcards' | 'timeline' | 'material-detail') => void;
  onSelectMaterial: (mat: Material) => void;
  onAddXp: (amount: number) => void;
  onPomodoroComplete?: (durationMinutes: number, earnedXp: number) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  profile,
  materials,
  achievements,
  studyStats,
  userCode = 'NBT-2026-0001',
  onDataUpdated,
  onNavigate,
  onSelectMaterial,
  onAddXp,
  onPomodoroComplete,
}) => {
  const activeMaterial = materials[0] || null;

  // Level & XP math
  const levelInfo = calculateLevel(profile.xp);
  
  // Streak calculations
  const activeSecs = studyStats?.activeSecondsToday || 0;
  const targetSecs = studyStats?.streakThresholdSeconds || STREAK_REQUIRED_SECONDS;
  const streakPercent = Math.min(100, Math.round((activeSecs / targetSecs) * 100));
  const remainingSecs = Math.max(0, targetSecs - activeSecs);
  const remainingMins = Math.ceil(remainingSecs / 60);
  const isStreakUnlocked = profile.streakDays > 0 || studyStats?.dailyStreakClaimedToday || activeSecs >= targetSecs;

  return (
    <div id="neubytrix-dashboard-view" className="space-y-6 pb-20 md:pb-8">
      {/* 1. Greeting Banner */}
      <div className="space-y-3">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Selamat datang kembali, {profile.name}! 👋
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Siap belajar hari ini? Pertahankan streak belajarmu dan raih target 6 bulanmu.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            id="dash-upload-btn"
            onClick={() => onNavigate('materi')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-800 dark:text-slate-200 text-sm font-semibold transition-all shadow-xs cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>+ Upload Materi</span>
          </button>

          <button
            id="dash-ai-btn"
            onClick={() => onNavigate('ai')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Tanya AI Tutor</span>
          </button>
        </div>
      </div>

      {/* 2. NeubytrixID Daily Check-in Component */}
      <DailyCheckIn
        userCode={userCode}
        onDataUpdated={onDataUpdated}
      />

      {/* 3. Top 4 Metric Cards (2x2 Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Streak Harian & Syarat Waktu Belajar */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex flex-col justify-between relative overflow-hidden shadow-xs">
          <div>
            <div className="flex items-start justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Streak Harian</span>
              <div className={`p-2 rounded-xl border ${
                isStreakUnlocked
                  ? 'bg-amber-100 dark:bg-amber-950/60 border-amber-300 dark:border-amber-800/80 text-amber-600 dark:text-amber-400'
                  : 'bg-slate-100 dark:bg-slate-950 border-slate-200 dark:border-slate-800/80 text-slate-500'
              }`}>
                <Flame className={`w-4 h-4 ${isStreakUnlocked ? 'fill-amber-500 text-amber-500 dark:fill-amber-400 dark:text-amber-400' : 'text-slate-400 dark:text-slate-500'}`} />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {profile.streakDays} Hari 🔥
              </div>
              
              {isStreakUnlocked ? (
                <div className="mt-2 space-y-1">
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/50 px-2 py-0.5 rounded-md">
                    <CheckCircle2 className="w-3 h-3" />
                    Streak Hari Ini Aktif!
                  </span>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    Kamu sudah belajar {Math.floor(activeSecs / 60)} mnt hari ini.
                  </p>
                </div>
              ) : (
                <div className="mt-2 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-amber-600 dark:text-amber-400 font-medium">Syarat: Belajar 5 mnt</span>
                    <span className="text-slate-500 dark:text-slate-400 text-[10px]">
                      {Math.floor(activeSecs / 60)}m {activeSecs % 60}s / 5m
                    </span>
                  </div>
                  {/* Streak Progress Bar */}
                  <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
                      style={{ width: `${streakPercent}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                    ⏳ Belajar {remainingMins} mnt lagi di sini untuk klaim streak!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Card 2: Total XP */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-xs">
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total XP</span>
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-slate-950 border border-purple-200 dark:border-slate-800/80 text-purple-600 dark:text-purple-400">
              <Zap className="w-4 h-4 fill-purple-600 text-purple-600 dark:fill-purple-400 dark:text-purple-400" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">{profile.xp} ⚡</div>
            <p className="text-[11px] text-purple-600 dark:text-purple-400 mt-1 font-medium">
              +{levelInfo.nextLevelXp} XP lagi menuju Level {levelInfo.level + 1}
            </p>
          </div>
        </div>

        {/* Card 3: Level Pembelajar */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-xs">
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Level Pembelajar</span>
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/50 text-purple-600 dark:text-purple-400">
              <Award className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">Level {profile.level}</div>
            <p className="text-[11px] text-indigo-600 dark:text-indigo-400 mt-1 font-medium">{profile.levelTitle}</p>
          </div>
        </div>

        {/* Card 4: Target 6 Bulan */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-xs">
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Target 6 Bulan</span>
            <div className="relative w-8 h-8 flex items-center justify-center">
              <svg className="w-8 h-8 -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-200 dark:text-slate-800"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-emerald-500 dark:text-emerald-400"
                  strokeDasharray={`${profile.target6MonthProgress}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute text-[8px] font-bold text-emerald-600 dark:text-emerald-400">
                {profile.target6MonthProgress}%
              </span>
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {profile.target6MonthProgress}% Selesai
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium">
              {profile.target6MonthProgress === 0
                ? 'Mulai target bulan ke-1 di tab Target'
                : `Progress komprehensif semester`}
            </p>
          </div>
        </div>
      </div>

      {/* 3. Pomodoro Focus Timer */}
      <PomodoroTimer
        onSessionComplete={(mins, xp) => {
          if (onPomodoroComplete) {
            onPomodoroComplete(mins, xp);
          } else {
            onAddXp(xp);
          }
        }}
      />

      {/* 4. Rekomendasi Untukmu / Learning Path */}
      <div className="rounded-2xl bg-gradient-to-br from-indigo-50/90 via-purple-50/40 to-white dark:from-indigo-950/30 dark:via-slate-900/90 dark:to-slate-950 border border-indigo-200 dark:border-indigo-500/20 p-5 sm:p-6 space-y-4 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-500/20 border border-indigo-200 dark:border-indigo-500/40 text-indigo-700 dark:text-indigo-300 text-xs font-semibold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Rekomendasi untukmu</span>
          </span>
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
            Fokus hari ini: Sistem Pencernaan
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
            Materi ini masih menjadi salah satu topik yang paling sering kamu salah jawab pada kuis terakhir. Mari tuntaskan konsep enzim lambung dan vili usus halus!
          </p>
        </div>

        {/* Learning Path Steps */}
        <div className="pt-2">
          <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            Jalur Belajar Terstruktur (Learning Path):
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-2.5">
            <button
              onClick={() => {
                if (activeMaterial) onSelectMaterial(activeMaterial);
                onNavigate('material-detail');
              }}
              className="p-3 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 text-left transition-all group shadow-xs cursor-pointer"
            >
              <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 flex items-center gap-1">
                <span>📖 01</span>
              </div>
              <div className="text-xs font-semibold text-slate-900 dark:text-white mt-1">Review Materi</div>
            </button>

            <button
              onClick={() => {
                if (activeMaterial) onSelectMaterial(activeMaterial);
                onNavigate('flashcards');
              }}
              className="p-3 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 text-left transition-all group shadow-xs cursor-pointer"
            >
              <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 flex items-center gap-1">
                <span>🗂️ 02</span>
              </div>
              <div className="text-xs font-semibold text-slate-900 dark:text-white mt-1">Flashcard</div>
            </button>

            <button
              onClick={() => {
                if (activeMaterial) onSelectMaterial(activeMaterial);
                onNavigate('quiz');
              }}
              className="p-3 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 text-left transition-all group shadow-xs cursor-pointer"
            >
              <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 flex items-center gap-1">
                <span>❓ 03</span>
              </div>
              <div className="text-xs font-semibold text-slate-900 dark:text-white mt-1">Latihan Soal</div>
            </button>

            <button
              onClick={() => onNavigate('ai')}
              className="p-3 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 text-left transition-all group shadow-xs cursor-pointer"
            >
              <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 flex items-center gap-1">
                <span>🧠 04</span>
              </div>
              <div className="text-xs font-semibold text-slate-900 dark:text-white mt-1">Review Kesalahan</div>
            </button>

            <button
              onClick={() => onNavigate('quiz')}
              className="p-3 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 text-left transition-all group col-span-2 sm:col-span-1 shadow-xs cursor-pointer"
            >
              <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 flex items-center gap-1">
                <span>⚡ 05</span>
              </div>
              <div className="text-xs font-semibold text-slate-900 dark:text-white mt-1">Tes Ulang</div>
            </button>
          </div>
        </div>
      </div>

      {/* 5. Koleksi Materi Cepat */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
            Materi Pelajaran Aktif
          </h2>
          <button
            onClick={() => onNavigate('materi')}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
          >
            <span>Lihat Semua ({materials.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {materials.slice(0, 2).map((mat) => (
            <div
              key={mat.id}
              onClick={() => {
                onSelectMaterial(mat);
                onNavigate('material-detail');
              }}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 cursor-pointer transition-all flex flex-col justify-between group shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5">
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400">{mat.subject}</span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] uppercase font-bold text-slate-700 dark:text-slate-300">
                    {mat.fileType}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors line-clamp-1">
                  {mat.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {mat.summary.simpleOverview}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-500 dark:text-slate-400">
                <span>🗂️ {mat.flashcards.length} Flashcard • ❓ {mat.quizQuestions.length} Soal</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                  Buka <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
