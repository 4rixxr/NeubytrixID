import React, { useState } from 'react';
import {
  User,
  Moon,
  Sun,
  Droplets,
  Shield,
  Save,
  RotateCcw,
  Trash2,
  CheckCircle2,
  BookOpen,
  Clock,
  Award,
  Flame,
  Volume2,
  VolumeX,
  Copy,
  Check,
  KeyRound,
} from 'lucide-react';
import { UserProfile, SchoolLevel, ThemeMode } from '../types';
import { calculateLevel } from '../utils/userCodeStore';

interface SettingsViewProps {
  profile: UserProfile;
  theme: ThemeMode;
  userCode?: string;
  onToggleTheme: () => void;
  onUpdateProfile: (updated: UserProfile) => void;
  onResetData: () => void;
  onReopenOnboarding?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  profile,
  theme,
  userCode,
  onToggleTheme,
  onUpdateProfile,
  onResetData,
  onReopenOnboarding,
}) => {
  const [formData, setFormData] = useState({
    name: profile.name,
    email: profile.email || 'arrixrix@gmail.com',
    schoolLevel: profile.schoolLevel,
    grade: profile.grade,
    dailyStudyTime: profile.dailyStudyTime || '30 menit/hari (Rekomendasi Standar)',
    tutorStyle: profile.tutorStyle || 'Santai, Riang & Penuh Analogi Nyata',
    soundEffects: profile.soundEffects !== false,
    isLiquidGlass: !!profile.isLiquidGlass,
  });

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const levelInfo = calculateLevel(profile.xp);
  const xpInCurrentLevel = profile.xp % 500;
  const xpPercent = profile.xp === 0 ? 0 : Math.min(100, Math.round((xpInCurrentLevel / 500) * 100));

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleSave = () => {
    const updated: UserProfile = {
      ...profile,
      name: formData.name,
      email: formData.email,
      schoolLevel: formData.schoolLevel,
      grade: formData.grade,
      dailyStudyTime: formData.dailyStudyTime,
      tutorStyle: formData.tutorStyle,
      soundEffects: formData.soundEffects,
      isLiquidGlass: formData.isLiquidGlass,
    };
    onUpdateProfile(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const initial = formData.name ? formData.name.charAt(0).toUpperCase() : 'B';

  return (
    <div id="neubytrix-settings-view" className="space-y-6 pb-20 md:pb-8 max-w-4xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Account Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Kelola profil pelajar, tema tampilan (Dark & Light), preferensi kurikulum, dan statistik belajarmu.
          </p>
        </div>

        {/* Quick theme & glass pills */}
        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              setFormData((prev) => ({ ...prev, isLiquidGlass: !prev.isLiquidGlass }))
            }
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
              formData.isLiquidGlass
                ? 'bg-cyan-50 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border-cyan-300 dark:border-cyan-500/40 shadow-xs'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white shadow-xs'
            }`}
          >
            💧 Glass {formData.isLiquidGlass ? 'ON' : 'OFF'}
          </button>

          <div className="flex items-center p-1 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <button
              onClick={onToggleTheme}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                theme === 'light'
                  ? 'bg-amber-500 text-slate-950 shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              ☀️ Terang
            </button>
            <button
              onClick={onToggleTheme}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                theme === 'dark'
                  ? 'bg-purple-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              🌙 Gelap
            </button>
          </div>
        </div>
      </div>

      {/* Main Profile Card */}
      <div className="rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-6 sm:p-7 space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-black text-2xl sm:text-3xl flex items-center justify-center shadow-lg shadow-purple-600/30 flex-shrink-0">
            {initial}
            <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-emerald-500 dark:text-emerald-400 shadow-xs">
              <Shield className="w-4 h-4 fill-emerald-500 dark:fill-emerald-400" />
            </div>
          </div>

          <div className="space-y-1.5 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {formData.name}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 text-[11px] font-bold border border-purple-200 dark:border-purple-500/30">
                Neubytrix Scholar
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
              <span>✉️</span>
              <span>{formData.email}</span>
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold">
                🎓 {formData.schoolLevel} • {formData.grade}
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/40 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
                {profile.levelTitle || 'Pemula (Siswa Baru)'}
              </span>
              {userCode && (
                <button
                  type="button"
                  onClick={() => handleCopyCode(userCode)}
                  className="px-2.5 py-0.5 rounded-md bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-semibold flex items-center gap-1.5 hover:bg-amber-100 dark:hover:bg-amber-500/20 transition-all cursor-pointer"
                  title="Klik untuk menyalin kode akses akun Anda"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Kode: {userCode}</span>
                  {copiedCode ? (
                    <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <Copy className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-900 dark:text-white">
              Total Progres Belajar: ⚡ {profile.xp} XP
            </span>
            <span className="text-slate-600 dark:text-slate-400">
              Level {profile.level} • {levelInfo.nextLevelXp} XP lagi menuju Level {profile.level + 1}
            </span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${xpPercent}%` }}
            />
          </div>
        </div>

        {/* 4 Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 text-center shadow-xs">
            <span className="text-[11px] text-slate-500 dark:text-slate-400">Streak Belajar</span>
            <div className="text-base font-bold text-amber-600 dark:text-amber-400 mt-0.5">
              {profile.streakDays} Hari Berturut
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 text-center shadow-xs">
            <span className="text-[11px] text-slate-500 dark:text-slate-400">Waktu Belajar</span>
            <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
              {profile.totalStudyMinutes ?? 0} Menit
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 text-center shadow-xs">
            <span className="text-[11px] text-slate-500 dark:text-slate-400">Kuis Diselesaikan</span>
            <div className="text-base font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
              {profile.quizzesCompleted ?? 0} Sesi
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 text-center shadow-xs">
            <span className="text-[11px] text-slate-500 dark:text-slate-400">Materi Dipelajari</span>
            <div className="text-base font-bold text-purple-600 dark:text-purple-400 mt-0.5">
              {profile.materialsLearned ?? 0} Modul
            </div>
          </div>
        </div>
      </div>

      {/* Theme Section */}
      <div className="rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">Tema</h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Pilih mode tampilan yang paling nyaman untuk mata dan kenyamanan belajarmu di Neubytrix.id.
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-purple-50 dark:bg-purple-500/15 border border-purple-200 dark:border-purple-500/30 text-purple-700 dark:text-purple-300 text-xs font-semibold">
            {theme === 'dark' ? '🌙 Mode Gelap Aktif' : '☀️ Mode Terang Aktif'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* Dark Mode Card */}
          <div
            onClick={() => {
              if (theme !== 'dark') onToggleTheme();
            }}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
              theme === 'dark'
                ? 'bg-slate-900 border-purple-500 shadow-md ring-2 ring-purple-500/20'
                : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 opacity-75 hover:opacity-100'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Moon className="w-4 h-4 text-purple-500 dark:text-purple-400" />
                <span>Tema Gelap (Dark Mode)</span>
              </h3>
              {theme === 'dark' && (
                <span className="text-[10px] font-bold text-purple-700 dark:text-purple-400 bg-purple-100 dark:bg-purple-500/20 px-2 py-0.5 rounded-md">
                  Aktif ✓
                </span>
              )}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
              Palet Slate-950 kontras tinggi ramah mata.
            </p>
            <div className="h-16 rounded-xl bg-slate-900 border border-slate-800 p-2 space-y-1.5">
              <div className="w-1/3 h-2 rounded-full bg-slate-700" />
              <div className="w-3/4 h-2 rounded-full bg-slate-800" />
              <div className="w-1/2 h-2 rounded-full bg-indigo-500/60" />
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              Direkomendasikan untuk sesi belajar malam hari tanpa silau.
            </p>
          </div>

          {/* Light Mode Card */}
          <div
            onClick={() => {
              if (theme !== 'light') onToggleTheme();
            }}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
              theme === 'light'
                ? 'bg-amber-50/70 border-amber-500 shadow-md ring-2 ring-amber-500/20'
                : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 opacity-75 hover:opacity-100'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Sun className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                <span>Tema Terang (Light Mode)</span>
              </h3>
              {theme === 'light' && (
                <span className="text-[10px] font-bold text-amber-700 dark:text-amber-600 bg-amber-100 dark:bg-amber-500/20 px-2 py-0.5 rounded-md">
                  Aktif ✓
                </span>
              )}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
              Palet putih bersih, segar, dan kontras tajam.
            </p>
            <div className="h-16 rounded-xl bg-slate-100 border border-slate-200 p-2 space-y-1.5">
              <div className="w-1/3 h-2 rounded-full bg-slate-400" />
              <div className="w-3/4 h-2 rounded-full bg-slate-300" />
              <div className="w-1/2 h-2 rounded-full bg-indigo-600" />
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              Sangat ideal untuk membaca teks materi panjang di siang hari.
            </p>
          </div>
        </div>
      </div>

      {/* Liquid Glass Section */}
      <div className="rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-6 space-y-3 shadow-xs">
        <div className="text-xs text-cyan-600 dark:text-cyan-400 font-semibold flex items-center gap-1.5">
          <Droplets className="w-3.5 h-3.5" />
          <span>💧 Efek Estetika UI • Ramah GPU Android & iOS</span>
        </div>
        <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
          Menu Aktivasi Liquid Glass
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          Liquid Glass memberikan sensasi kaca transparan refraktif dengan specular highlight halus. Dapat diaktifkan atau dimatikan bebas tanpa menciptakan lag di Android maupun iOS.
        </p>
        <button
          onClick={() =>
            setFormData((prev) => ({ ...prev, isLiquidGlass: !prev.isLiquidGlass }))
          }
          className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
            formData.isLiquidGlass
              ? 'bg-cyan-50 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border-cyan-300 dark:border-cyan-500/40 shadow-xs'
              : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          {formData.isLiquidGlass ? '💧 Liquid Glass: AKTIF' : '💧 Liquid Glass: NONAKTIF'}
        </button>
      </div>

      {/* Profile Form */}
      <div className="rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-6 space-y-5 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <span>👤 Data Profil Siswa & Kurikulum Sekolah</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-400">Nama Lengkap Siswa</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 shadow-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-400">Alamat Email Akun</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 shadow-xs"
            />
          </div>

          {/* Jenjang */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-400">Jenjang Pendidikan</label>
            <div className="grid grid-cols-4 gap-2">
              {(['SD', 'SMP', 'SMA', 'SMK'] as SchoolLevel[]).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setFormData({ ...formData, schoolLevel: lvl })}
                  className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    formData.schoolLevel === lvl
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Kelas */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-400">Kelas / Fase Kurikulum</label>
            <select
              value={formData.grade}
              onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 shadow-xs cursor-pointer"
            >
              <option value="Kelas 7">Kelas 7</option>
              <option value="Kelas 8">Kelas 8</option>
              <option value="Kelas 9">Kelas 9</option>
              <option value="Kelas 10">Kelas 10</option>
              <option value="Kelas 11">Kelas 11</option>
              <option value="Kelas 12">Kelas 12</option>
            </select>
          </div>

          {/* Target Harian */}
          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-400">
              Target Waktu Belajar Harian
            </label>
            <select
              value={formData.dailyStudyTime}
              onChange={(e) => setFormData({ ...formData, dailyStudyTime: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 shadow-xs cursor-pointer"
            >
              <option value="15 menit/hari (Kilat & Fokus)">15 menit/hari (Kilat & Fokus)</option>
              <option value="30 menit/hari (Rekomendasi Standar)">
                30 menit/hari (Rekomendasi Standar)
              </option>
              <option value="45 menit/hari (Intensif)">45 menit/hari (Intensif)</option>
              <option value="60 menit/hari (Ambisius Juara)">60 menit/hari (Ambisius Juara)</option>
            </select>
          </div>
        </div>

        {/* Preferensi AI */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Preferensi Personalisasi Belajar
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-400">
                Gaya Penjelasan Neubytrix AI Tutor
              </label>
              <select
                value={formData.tutorStyle}
                onChange={(e) => setFormData({ ...formData, tutorStyle: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 shadow-xs cursor-pointer"
              >
                <option value="Santai, Riang & Penuh Analogi Nyata">
                  Santai, Riang & Penuh Analogi Nyata
                </option>
                <option value="Formal, Akademis & Terstruktur Ketat">
                  Formal, Akademis & Terstruktur Ketat
                </option>
                <option value="Sederhana, Point-by-Point & Ringkas">
                  Sederhana, Point-by-Point & Ringkas
                </option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-400">
                Efek Audio Belajar (Pomodoro & Kuis)
              </label>
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, soundEffects: !prev.soundEffects }))
                }
                className="w-full py-2.5 px-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-900 dark:text-white flex items-center justify-between shadow-xs cursor-pointer"
              >
                <span>
                  {formData.soundEffects
                    ? 'Efek Suara Aktif (Bel Berbunyi) 🔊'
                    : 'Suara Dinonaktifkan (Hening) 🔇'}
                </span>
                {formData.soundEffects ? <Volume2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-400 dark:text-slate-500" />}
              </button>
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="pt-2 flex items-center justify-between">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Perubahan Akun</span>
          </button>

          {savedSuccess && (
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4" />
              <span>Perubahan berhasil disimpan!</span>
            </span>
          )}
        </div>
      </div>

      {/* Tindakan Aplikasi */}
      <div className="rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
          Tindakan Aplikasi & Pemeliharaan Akun
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white">Mulai Ulang Orientasi (Onboarding)</h3>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">
              Pelajari kembali alur onboarding 6 langkah dan penyetelan kurikulum awal.
            </p>
            <button
              onClick={onReopenOnboarding}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors shadow-xs cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Mulai Ulang Onboarding</span>
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs">
            <h3 className="text-xs font-bold text-rose-600 dark:text-rose-400">Reset Data Demo Neubytrix.id</h3>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">
              Kembalikan seluruh materi dan profil ke kondisi default bawaan sistem.
            </p>
            <button
              onClick={onResetData}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-600/20 border border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-300 hover:bg-rose-600 hover:text-white text-xs font-semibold transition-colors shadow-xs cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Reset Semua Data</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-4 text-xs text-slate-500">
        Neubytrix.id • Platform Belajar Pribadi Berbasis AI untuk Pelajar Indonesia v2.4
      </div>
    </div>
  );
};
