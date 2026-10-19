import React from 'react';
import {
  TrendingUp,
  Clock,
  CheckCircle2,
  Award,
  Flame,
  Brain,
  Sparkles,
  Trophy,
  Layers,
  Lock,
} from 'lucide-react';
import { UserProfile, Achievement, SubjectMastery } from '../types';
import { StudyStats } from '../utils/userCodeStore';

interface ProgressViewProps {
  profile: UserProfile;
  achievements: Achievement[];
  subjectMastery: SubjectMastery[];
  studyStats?: StudyStats;
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  profile,
  achievements,
  subjectMastery,
  studyStats,
}) => {
  const totalQuestions = studyStats?.questionsAnswered || 0;
  const accuracy = studyStats?.accuracy || 0;
  const totalStudyMins = profile.totalStudyMinutes || 0;
  const todayMins = Math.floor((studyStats?.activeSecondsToday || 0) / 60);
  const quizzesDone = studyStats?.quizzesCompleted || profile.quizzesCompleted || 0;
  const unlockedAchievements = achievements.filter((a) => a.unlocked).length;

  const totalMasteredTopics = subjectMastery.reduce((acc, s) => acc + s.masteredTopics, 0);
  const totalTopicsAvailable = subjectMastery.reduce((acc, s) => acc + s.totalTopics, 0);

  return (
    <div id="neubytrix-progress-view" className="space-y-6 pb-20 md:pb-8">
      {/* Title & Subtitle */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          Progress & Statistik Belajar 📊
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
          Pantau grafik penguasaan kurikulum sekolah, perolehan XP, dan koleksi prestasimu.
        </p>
      </div>

      {/* 4 Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Akurasi */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Akurasi Rata-rata</span>
            <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
            {accuracy}%
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            {totalQuestions > 0 ? `${totalQuestions} soal dijawab` : 'Belum ada kuis dikerjakan'}
          </p>
        </div>

        {/* Total Menit */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Total Menit Belajar</span>
            <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {totalStudyMins} Menit
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            {todayMins > 0 ? `${todayMins} mnt hari ini` : 'Belum ada sesi hari ini'}
          </p>
        </div>

        {/* Soal Terjawab */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Soal Terjawab</span>
            <CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {totalQuestions} Soal
          </div>
          <p className="text-[11px] text-purple-600 dark:text-purple-400 font-medium">
            {quizzesDone} kuis diselesaikan
          </p>
        </div>

        {/* Prestasi Terbuka */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Prestasi Terbuka</span>
            <Award className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400">
            {unlockedAchievements} / {achievements.length}
          </div>
          <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
            {unlockedAchievements === 0 ? 'Belum ada lencana' : 'Lencana istimewa diraih'}
          </p>
        </div>
      </div>

      {/* Penguasaan Mata Pelajaran */}
      <div className="rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 space-y-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
              📊 Penguasaan Mata Pelajaran ({profile.grade})
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Tingkat pemahaman materi berdasarkan hasil kuis & evaluasi flashcard
            </p>
          </div>
          <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-200 dark:border-indigo-500/20 w-fit">
            {totalMasteredTopics} dari {totalTopicsAvailable} Bab Tuntas
          </span>
        </div>

        <div className="space-y-4">
          {subjectMastery.map((sub, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-900 dark:text-white">
                  {sub.subject} ({sub.masteredTopics}/{sub.totalTopics} Bab)
                </span>
                <span className="font-bold text-slate-700 dark:text-slate-200">{sub.percentage}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                  style={{ width: `${sub.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lencana & Penghargaan */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>🎗️ Lencana & Penghargaan</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">({achievements.length})</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between shadow-xs ${
                ach.unlocked
                  ? 'bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-800'
                  : 'bg-slate-50/70 dark:bg-slate-950/50 border-slate-200/80 dark:border-slate-800/40 opacity-75'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{ach.title}</h3>
                  <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">+{ach.xpReward} XP</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{ach.description}</p>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-[11px]">
                {ach.unlocked ? (
                  <span className="text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>✓ Sudah Diraih</span>
                  </span>
                ) : (
                  <span className="text-slate-400 dark:text-slate-500 flex items-center gap-1 font-medium">
                    <Lock className="w-3 h-3" />
                    <span>Terkunci</span>
                  </span>
                )}
                {ach.unlockedDate && <span className="text-slate-500">{ach.unlockedDate}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
