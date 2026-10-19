import React, { useState } from 'react';
import {
  Check,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  BookOpen,
  GraduationCap,
  Clock,
  Target,
  Brain,
  Award,
  Compass,
  CheckCircle2,
  ChevronRight,
  Sun,
  Moon,
  Home
} from 'lucide-react';
import { SchoolLevel, UserProfile, RegisteredUser } from '../types';
import { NeubytrixLogoIcon } from './Logo';

interface OnboardingFlowProps {
  initialUser?: RegisteredUser | null;
  initialProfile?: UserProfile;
  onComplete: (profile: UserProfile) => void;
  onExit?: () => void;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({
  initialUser,
  initialProfile,
  onComplete,
  onExit,
  theme = 'dark',
  onToggleTheme,
}) => {
  // Step state: 1 to 5
  // Step 1: Jenjang Sekolah & Kelas
  // Step 2: Target utama 6 bulan ke depan
  // Step 3: Cara belajar yang paling kamu suka
  // Step 4: Waktu belajar per hari
  // Step 5: ✨ Rencana belajar kamu sudah siap!
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State
  const [schoolLevel, setSchoolLevel] = useState<SchoolLevel | null>(
    (initialProfile?.schoolLevel as SchoolLevel) || 'SMP'
  );
  const [grade, setGrade] = useState<string>(
    initialProfile?.grade || 'Kelas 8'
  );
  const [selectedTargets, setSelectedTargets] = useState<string[]>(
    initialProfile?.targets && initialProfile.targets.length > 0
      ? initialProfile.targets
      : ['🎯 Meningkatkan nilai', '🏆 Persiapan ujian']
  );
  const [customTarget, setCustomTarget] = useState<string>('');

  const [learningStyles, setLearningStyles] = useState<string[]>(
    initialProfile?.learningStyles && initialProfile.learningStyles.length > 0
      ? initialProfile.learningStyles
      : ['💬 Tanya jawab dengan AI', '🃏 Flashcard']
  );

  const [dailyStudyTime, setDailyStudyTime] = useState<string>(
    initialProfile?.dailyStudyTime || '30 menit'
  );

  // Grade lists for each school level
  const getGradeList = (level: SchoolLevel | null): string[] => {
    switch (level) {
      case 'SD':
        return ['Kelas 1', 'Kelas 2', 'Kelas 3', 'Kelas 4', 'Kelas 5', 'Kelas 6'];
      case 'SMP':
        return ['Kelas 7', 'Kelas 8', 'Kelas 9'];
      case 'SMA/SMK':
      case 'SMA':
      case 'SMK':
        return ['Kelas 10', 'Kelas 11', 'Kelas 12'];
      default:
        return [];
    }
  };

  // Handle choosing school level
  const handleSelectSchoolLevel = (lvl: SchoolLevel) => {
    setSchoolLevel(lvl);
    // Auto-select appropriate first grade for that level if current grade doesn't belong
    const grades = getGradeList(lvl);
    if (!grades.includes(grade)) {
      setGrade(grades[0] || 'Kelas 1');
    }
  };

  // Toggle Target item
  const toggleTarget = (targetName: string) => {
    if (selectedTargets.includes(targetName)) {
      if (selectedTargets.length > 1) {
        setSelectedTargets(selectedTargets.filter((t) => t !== targetName));
      }
    } else {
      setSelectedTargets([...selectedTargets, targetName]);
    }
  };

  // Toggle Learning Style
  const toggleLearningStyle = (styleName: string) => {
    if (styleName === '🔀 Campuran semuanya') {
      // Toggle all styles or select this special option
      if (learningStyles.includes('🔀 Campuran semuanya')) {
        setLearningStyles(['💬 Tanya jawab dengan AI']);
      } else {
        setLearningStyles([
          '📖 Membaca materi',
          '📝 Latihan soal',
          '🃏 Flashcard',
          '🎧 Mendengarkan penjelasan',
          '💬 Tanya jawab dengan AI',
          '🔀 Campuran semuanya',
        ]);
      }
      return;
    }

    // Normal toggle
    let updated = [...learningStyles];
    if (updated.includes(styleName)) {
      if (updated.length > 1) {
        updated = updated.filter((s) => s !== styleName && s !== '🔀 Campuran semuanya');
      }
    } else {
      updated.push(styleName);
    }
    setLearningStyles(updated);
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Complete Onboarding: Save & Go to Main App
  const handleFinishOnboarding = () => {
    // Process targets (append custom target if entered)
    let finalTargets = [...selectedTargets];
    if (selectedTargets.includes('⭐ Target lainnya') && customTarget.trim()) {
      finalTargets = finalTargets.filter((t) => t !== '⭐ Target lainnya');
      finalTargets.push(`⭐ Target lainnya: ${customTarget.trim()}`);
    }

    const updatedProfile: UserProfile = {
      id: initialProfile?.id || (initialUser?.code ? `user_${initialUser.code}` : `user_${Date.now()}`),
      name: initialProfile?.name || initialUser?.fullName || 'Pelajar Neubytrix',
      email: initialUser?.email || initialProfile?.email || 'siswa@neubytrix.id',
      schoolLevel: schoolLevel || 'SMP',
      grade: grade || 'Kelas 8',
      targets: finalTargets,
      learningStyles: learningStyles,
      dailyStudyTime: dailyStudyTime,
      xp: initialProfile?.xp || 250,
      level: initialProfile?.level || 1,
      levelTitle: initialProfile?.levelTitle || 'Pemula (Siswa Baru)',
      streakDays: initialProfile?.streakDays || 1,
      target6MonthProgress: initialProfile?.target6MonthProgress || 15,
      isDarkMode: theme === 'dark',
      onboardingCompleted: true,
      totalStudyMinutes: initialProfile?.totalStudyMinutes || 15,
      quizzesCompleted: initialProfile?.quizzesCompleted || 1,
      materialsLearned: initialProfile?.materialsLearned || 2,
      tutorStyle: initialProfile?.tutorStyle || 'friendly',
      soundEffects: true,
    };

    try {
      localStorage.setItem('neubytrix-user-profile', JSON.stringify(updatedProfile));
    } catch (e) {
      console.error(e);
    }

    onComplete(updatedProfile);
  };

  const progressPercentage = (currentStep / 5) * 100;

  // Exact target options per prompt:
  const targetOptions = [
    { id: 'nilai', title: '🎯 Meningkatkan nilai', desc: 'Menaikkan perolehan nilai tugas, ulangan harian, dan rapor sekolah.' },
    { id: 'ujian', title: '🏆 Persiapan ujian', desc: 'Pemantapan materi menghadapi PTS, PAS, dan asesmen akhir.' },
    { id: 'tertinggal', title: '📚 Mengejar materi yang tertinggal', desc: 'Mengejar bab-bab pelajaran yang belum sempat dipahami secara mendalam.' },
    { id: 'menguasai', title: '🧠 Menguasai materi pelajaran', desc: 'Pemahaman konsep fundamental sampai ke tingkat mahir dan logika penalaran.' },
    { id: 'lainnya', title: '⭐ Target lainnya', desc: 'Tuliskan sasaran belajarmu sendiri yang ingin dicapai.' },
  ];

  // Exact learning styles per prompt:
  const learningStyleOptions = [
    { id: 'baca', title: '📖 Membaca materi', desc: 'Rangkuman terstruktur, poin-poin inti, dan penjelas komprehensif.' },
    { id: 'soal', title: '📝 Latihan soal', desc: 'Simulasi latihan soal interaktif langsung dengan kunci pembahasan.' },
    { id: 'flashcard', title: '🃏 Flashcard', desc: 'Kartu memori cerdas untuk hafalan konsep, istilah penting, dan rumus cepat.' },
    { id: 'dengar', title: '🎧 Mendengarkan penjelasan', desc: 'Penuturan materi audio yang runtut, artikulatif, dan mudah diserap.' },
    { id: 'ai', title: '💬 Tanya jawab dengan AI', desc: 'Diskusi bebas dan bertanya apapun tanpa ragu ke Tutor AI pribadi.' },
    { id: 'campuran', title: '🔀 Campuran semuanya', desc: 'Kombinasi komprehensif seluruh metode belajar untuk hasil paling optimal.' },
  ];

  // Exact daily study times per prompt:
  const dailyStudyTimeOptions = [
    { time: '15 menit', badge: 'Ringan & Konsisten', desc: 'Cocok untuk pembiasaan belajar harian tanpa rasa terbebani.' },
    { time: '30 menit', badge: 'Rekomendasi Ideal', desc: 'Waktu terbaik untuk 1 ringkasan materi + 1 sesi latihan soal.' },
    { time: '1 jam', badge: 'Fokus Mendalam', desc: 'Mendalami topik kompleks dan latihan penalaran tingkat lanjut.' },
    { time: '2+ jam', badge: 'Intensif & Juara', desc: 'Persiapan maksimal menuju ujian besar, seleksi, atau olimpiade.' },
  ];

  const isDark = theme === 'dark';

  const getCardClass = (isSelected: boolean) => {
    if (isSelected) {
      return isDark
        ? 'border-2 border-indigo-500 bg-[#0E152E] shadow-[0_0_20px_rgba(99,102,241,0.3)] ring-1 ring-indigo-400/50 text-white'
        : 'border-2 border-indigo-600 bg-indigo-50/90 shadow-md ring-1 ring-indigo-500/25 text-slate-900';
    }
    return isDark
      ? 'border border-white/10 bg-[#0B1020] hover:border-white/20 hover:bg-[#0E152B] text-slate-200'
      : 'border border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/80 shadow-xs text-slate-800';
  };

  const getGradeBtnClass = (isSelected: boolean) => {
    if (isSelected) {
      return isDark
        ? 'border-2 border-indigo-500 bg-[#0E152E] text-white font-bold shadow-[0_0_15px_rgba(99,102,241,0.25)]'
        : 'border-2 border-indigo-600 bg-indigo-50 text-indigo-950 font-bold shadow-xs';
    }
    return isDark
      ? 'border border-white/10 bg-[#0B1020] text-slate-300 hover:text-white hover:border-white/20 hover:bg-[#0E152B]'
      : 'border border-slate-200 bg-white text-slate-700 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-50 shadow-xs';
  };

  return (
    <div
      id="neubytrix-onboarding-container"
      className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
        isDark
          ? 'bg-[#070A13] text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200'
          : 'bg-[#F8FAFC] text-slate-900 selection:bg-indigo-100 selection:text-indigo-800'
      }`}
    >
      {/* Top Header */}
      <header
        className={`sticky top-0 z-30 backdrop-blur-md border-b transition-colors ${
          isDark ? 'bg-[#070A13]/90 border-white/10' : 'bg-white/90 border-slate-200 shadow-xs'
        }`}
      >
        <div className="max-w-2xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Brand & Badge */}
          <div className="flex items-center gap-3">
            <NeubytrixLogoIcon size={32} className="drop-shadow-sm" />
            <div className="flex items-center gap-2">
              <span className={`font-bold text-base tracking-tight flex items-baseline ${isDark ? 'text-white' : 'text-slate-900'}`}>
                <span>Neubytrix</span><span className="text-indigo-600 dark:text-indigo-400 font-extrabold">ID</span>
              </span>
              <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 font-semibold border border-indigo-500/30">
                🎓 1. Onboarding
              </span>
            </div>
          </div>

          {/* Right Header info & Theme & Exit */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className={`text-xs font-medium hidden sm:block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Langkah <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{currentStep}</span> dari 5
            </div>

            {onToggleTheme && (
              <button
                type="button"
                onClick={onToggleTheme}
                className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                  isDark
                    ? 'border-white/10 text-slate-300 hover:text-white hover:bg-white/5'
                    : 'border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
                aria-label="Ganti tema tampilan"
                title="Ganti tema (Light / Dark)"
              >
                {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
              </button>
            )}

            {onExit && (
              <button
                type="button"
                onClick={onExit}
                className={`text-xs px-2.5 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                  isDark
                    ? 'text-slate-400 hover:text-white border-white/10 hover:bg-white/5'
                    : 'text-slate-600 hover:text-slate-900 border-slate-200 hover:bg-slate-100'
                }`}
              >
                Lewati
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Progress Bar */}
        <div className={`w-full h-1.5 overflow-hidden ${isDark ? 'bg-white/5' : 'bg-slate-200'}`}>
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 transition-all duration-300 ease-out shadow-[0_0_12px_rgba(99,102,241,0.6)]"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </header>

      {/* Main Form Body */}
      <main className="flex-1 max-w-xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-10 flex flex-col justify-between">
        <div className="space-y-6">

          {/* ================= STEP 1: JENJANG SEKOLAH & KELAS ================= */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fade-in">
              {/* Header Title & Tagline as per prompt */}
              <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-600 dark:text-indigo-300 text-xs font-semibold mb-1">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Orientasi Belajar</span>
                </div>
                <h1
                  className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}
                  style={{ fontFamily: "'Space Grotesk', 'Plus Jakarta Sans', sans-serif" }}
                >
                  “Kenalan dulu dengan cara belajarmu.”
                </h1>
                <p className={`text-xs sm:text-sm max-w-md mx-auto leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Pilih jenjang sekolah dan kelasmu agar Neubytrix AI dapat menyusun kurikulum dan materi yang tepat untukmu.
                </p>
              </div>

              {/* Jenjang sekolah Section */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                    <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Jenjang Sekolah</span>
                  </label>
                  <span className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Pilih salah satu</span>
                </div>

                {/* 3 Jenjang Sekolah Options: SD, SMP, SMA/SMK */}
                <div className="grid grid-cols-3 gap-3">
                  {/* SD */}
                  <button
                    type="button"
                    onClick={() => handleSelectSchoolLevel('SD')}
                    className={`relative p-4 rounded-2xl flex flex-col items-center text-center transition-all duration-200 cursor-pointer ${getCardClass(
                      schoolLevel === 'SD'
                    )}`}
                  >
                    {schoolLevel === 'SD' && (
                      <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-bold absolute top-2 right-2 shadow-sm">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                    <div className="text-3xl mb-2 select-none">🎒</div>
                    <div
                      className={`text-lg font-bold tracking-wide ${isDark ? 'text-white' : 'text-slate-900'}`}
                      style={{ fontFamily: "'Space Grotesk', 'Plus Jakarta Sans', sans-serif" }}
                    >
                      SD
                    </div>
                    <div className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Sekolah Dasar</div>
                  </button>

                  {/* SMP */}
                  <button
                    type="button"
                    onClick={() => handleSelectSchoolLevel('SMP')}
                    className={`relative p-4 rounded-2xl flex flex-col items-center text-center transition-all duration-200 cursor-pointer ${getCardClass(
                      schoolLevel === 'SMP'
                    )}`}
                  >
                    {schoolLevel === 'SMP' && (
                      <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-bold absolute top-2 right-2 shadow-sm">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                    <div className="text-3xl mb-2 select-none">📘</div>
                    <div
                      className={`text-lg font-bold tracking-wide ${isDark ? 'text-white' : 'text-slate-900'}`}
                      style={{ fontFamily: "'Space Grotesk', 'Plus Jakarta Sans', sans-serif" }}
                    >
                      SMP
                    </div>
                    <div className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Menengah Pertama</div>
                  </button>

                  {/* SMA/SMK */}
                  <button
                    type="button"
                    onClick={() => handleSelectSchoolLevel('SMA/SMK')}
                    className={`relative p-4 rounded-2xl flex flex-col items-center text-center transition-all duration-200 cursor-pointer ${getCardClass(
                      schoolLevel === 'SMA/SMK' || schoolLevel === 'SMA' || schoolLevel === 'SMK'
                    )}`}
                  >
                    {(schoolLevel === 'SMA/SMK' || schoolLevel === 'SMA' || schoolLevel === 'SMK') && (
                      <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-bold absolute top-2 right-2 shadow-sm">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                    <div className="text-3xl mb-2 select-none">🔬</div>
                    <div
                      className={`text-lg font-bold tracking-wide ${isDark ? 'text-white' : 'text-slate-900'}`}
                      style={{ fontFamily: "'Space Grotesk', 'Plus Jakarta Sans', sans-serif" }}
                    >
                      SMA/SMK
                    </div>
                    <div className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Menengah Atas/Kejuruan</div>
                  </button>
                </div>
              </div>

              {/* Kelas Section: Muncul setelah Pengguna memilih jenjang sekolah */}
              {schoolLevel && (
                <div className={`space-y-3 pt-3 border-t animate-fade-in ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <label className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                        <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                        <span>Kelas</span>
                      </label>
                      <p className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        Jenjang <span className="text-indigo-600 dark:text-indigo-300 font-semibold">{schoolLevel}</span> dipilih. Tentukan tingkat kelasmu:
                      </p>
                    </div>
                  </div>

                  {/* Dynamic Grade Options Grid */}
                  <div className="grid grid-cols-3 gap-2.5">
                    {getGradeList(schoolLevel).map((gradeItem) => {
                      const isSelected = grade === gradeItem;
                      return (
                        <button
                          key={gradeItem}
                          type="button"
                          onClick={() => setGrade(gradeItem)}
                          className={`p-3.5 rounded-xl text-center font-medium text-xs transition-all cursor-pointer flex items-center justify-center gap-2 ${getGradeBtnClass(
                            isSelected
                          )}`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 text-indigo-500 stroke-[3]" />}
                          <span>{gradeItem}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= STEP 2: TARGET UTAMA 6 BULAN KE DEPAN ================= */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-600 dark:text-indigo-300 text-xs font-semibold mb-1">
                  <Target className="w-3.5 h-3.5" />
                  <span>Sasaran Belajar</span>
                </div>
                <h2
                  className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}
                  style={{ fontFamily: "'Space Grotesk', 'Plus Jakarta Sans', sans-serif" }}
                >
                  Target utama 6 bulan ke depan
                </h2>
                <p className={`text-xs sm:text-sm max-w-md mx-auto leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Pilih sasaran yang ingin kamu wujudkan bersama pendampingan Neubytrix AI (bisa pilih lebih dari satu).
                </p>
              </div>

              {/* 5 Target Options */}
              <div className="space-y-2.5 pt-1">
                {targetOptions.map((item) => {
                  const isSelected = selectedTargets.includes(item.title);
                  return (
                    <div key={item.id} className="space-y-2">
                      <button
                        type="button"
                        onClick={() => toggleTarget(item.title)}
                        className={`w-full p-4 rounded-2xl flex items-center justify-between text-left transition-all cursor-pointer ${getCardClass(
                          isSelected
                        )}`}
                      >
                        <div className="flex items-center gap-3">
                          <div>
                            <div className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.title}</div>
                            <div className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{item.desc}</div>
                          </div>
                        </div>
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ml-3 ${
                            isSelected
                              ? 'bg-indigo-500 text-white shadow-sm'
                              : isDark
                              ? 'border border-slate-700 bg-slate-800/50'
                              : 'border border-slate-300 bg-slate-100'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </button>

                      {/* Optional custom input if "Target lainnya" is checked */}
                      {item.id === 'lainnya' && isSelected && (
                        <div className="pl-3 pr-1 pt-1 animate-fade-in">
                          <input
                            type="text"
                            value={customTarget}
                            onChange={(e) => setCustomTarget(e.target.value)}
                            placeholder="Contoh: Lolos seleksi olimpiade matematika kabupaten..."
                            className={`w-full px-4 py-2.5 rounded-xl border text-xs focus:outline-none focus:border-indigo-500 transition-colors ${
                              isDark
                                ? 'bg-[#0D1222] border-indigo-500/50 text-white placeholder:text-slate-500'
                                : 'bg-white border-indigo-300 text-slate-900 placeholder:text-slate-400 shadow-xs'
                            }`}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ================= STEP 3: CARA BELAJAR YANG PALING KAMU SUKA ================= */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-600 dark:text-indigo-300 text-xs font-semibold mb-1">
                  <Brain className="w-3.5 h-3.5" />
                  <span>Preferensi Gaya Belajar</span>
                </div>
                <h2
                  className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}
                  style={{ fontFamily: "'Space Grotesk', 'Plus Jakarta Sans', sans-serif" }}
                >
                  Cara belajar yang paling kamu suka
                </h2>
                <p className={`text-xs sm:text-sm max-w-md mx-auto leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Tentukan cara belajar yang paling membuatmu nyaman dan cepat memahami konsep pelajaran.
                </p>
              </div>

              {/* 6 Learning Style Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {learningStyleOptions.map((item) => {
                  const isSelected = learningStyles.includes(item.title);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleLearningStyle(item.title)}
                      className={`p-4 rounded-2xl flex flex-col justify-between text-left transition-all cursor-pointer ${getCardClass(
                        isSelected
                      )}`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.title}</span>
                          {isSelected && (
                            <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </div>
                          )}
                        </div>
                        <div className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{item.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ================= STEP 4: WAKTU BELAJAR PER HARI ================= */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-600 dark:text-indigo-300 text-xs font-semibold mb-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Komitmen Waktu Harian</span>
                </div>
                <h2
                  className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}
                  style={{ fontFamily: "'Space Grotesk', 'Plus Jakarta Sans', sans-serif" }}
                >
                  Waktu belajar per hari
                </h2>
                <p className={`text-xs sm:text-sm max-w-md mx-auto leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Konsistensi setiap hari jauh lebih berdampak nyata daripada belajar mendadak sebelum ujian.
                </p>
              </div>

              {/* 4 Study Time Options */}
              <div className="space-y-2.5 pt-1">
                {dailyStudyTimeOptions.map((item) => {
                  const isSelected = dailyStudyTime === item.time;
                  return (
                    <button
                      key={item.time}
                      type="button"
                      onClick={() => setDailyStudyTime(item.time)}
                      className={`w-full p-4 rounded-2xl flex items-center justify-between text-left transition-all cursor-pointer ${getCardClass(
                        isSelected
                      )}`}
                    >
                      <div className="flex items-center gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`font-bold text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.time}</span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 border border-indigo-500/30">
                              {item.badge}
                            </span>
                          </div>
                          <div className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{item.desc}</div>
                        </div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ml-3 ${
                          isSelected
                            ? 'bg-indigo-500 text-white shadow-sm'
                            : isDark
                            ? 'border border-slate-700 bg-slate-800/50'
                            : 'border border-slate-300 bg-slate-100'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ================= STEP 5: RENCANA BELAJAR KAMU SUDAH SIAP! ================= */}
          {currentStep === 5 && (
            <div className="space-y-6 animate-fade-in">
              {/* Grand Banner per Prompt */}
              <div className="text-center space-y-3">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 border border-indigo-500/40 text-indigo-600 dark:text-indigo-300 text-xs font-bold shadow-lg shadow-indigo-500/10">
                  <Sparkles className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                  <span>Strategi Belajar Personal Siap Digunakan</span>
                </div>

                <h2
                  className={`text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}
                  style={{ fontFamily: "'Space Grotesk', 'Plus Jakarta Sans', sans-serif" }}
                >
                  ✨ Rencana belajar kamu sudah siap!
                </h2>

                <p className={`text-sm max-w-md mx-auto leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  Kami membuat strategi belajar berdasarkan target dan gaya belajarmu.
                </p>
              </div>

              {/* Strategy Details Card */}
              <div
                className={`p-5 sm:p-6 rounded-3xl border space-y-5 shadow-2xl relative overflow-hidden ${
                  isDark ? 'bg-[#0B1020] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
                }`}
              >
                <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-600/10 blur-[60px] pointer-events-none rounded-full" />

                <div className={`flex items-center justify-between border-b pb-4 ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
                  <div>
                    <span className={`text-[11px] uppercase tracking-wider font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Tingkat Kurikulum
                    </span>
                    <div className={`text-base font-bold flex items-center gap-2 mt-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      <span>{schoolLevel}</span>
                      <span className="text-indigo-500">•</span>
                      <span>{grade}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-[11px] uppercase tracking-wider font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Komitmen Harian
                    </span>
                    <div className="text-base font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                      ⏱️ {dailyStudyTime} / hari
                    </div>
                  </div>
                </div>

                {/* Selected Targets & Styles Summary */}
                <div className="space-y-3 text-xs">
                  <div>
                    <span className={`font-semibold block mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Target Utama Terpilih:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedTargets.map((t, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-indigo-700 dark:text-indigo-200 font-medium"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className={`font-semibold block mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Cara Belajar Favorit:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {learningStyles.map((s, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-700 dark:text-purple-200 font-medium"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actionable Strategy Points */}
                <div className={`pt-2 border-t space-y-2.5 text-xs ${isDark ? 'border-white/10 text-slate-300' : 'border-slate-200 text-slate-600'}`}>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      <strong className={isDark ? 'text-white' : 'text-slate-900'}>Materi Disesuaikan Otomatis:</strong> Silabus {schoolLevel} ({grade}) telah siap dengan ringkasan poin inti dan rumus praktis.
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-indigo-500 dark:text-indigo-400 shrink-0 mt-0.5" />
                    <span>
                      <strong className={isDark ? 'text-white' : 'text-slate-900'}>Pendampingan AI 24/7:</strong> Tutor AI siap menjawab pertanyaan dan menjelaskan konsep sesuai preferensimu.
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-500 dark:text-amber-400 shrink-0 mt-0.5" />
                    <span>
                      <strong className={isDark ? 'text-white' : 'text-slate-900'}>Sistem Streak & Evaluasi:</strong> Pantau kenaikan nilaimu menuju target 6 bulan ke depan secara berkala.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Bottom Actions Bar */}
        <div className={`pt-8 flex items-center justify-between gap-4 border-t ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
          {currentStep > 1 && currentStep < 5 ? (
            <button
              id="onboarding-back-btn"
              type="button"
              onClick={handleBack}
              className={`px-5 py-3 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
                isDark
                  ? 'border-white/10 bg-white/5 hover:bg-white/10 text-slate-300'
                  : 'border-slate-200 bg-white hover:bg-slate-100 text-slate-700 shadow-xs'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali</span>
            </button>
          ) : currentStep === 5 ? (
            <button
              id="onboarding-back-to-step4"
              type="button"
              onClick={handleBack}
              className={`px-4 py-3 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                isDark
                  ? 'border-white/10 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white'
                  : 'border-slate-200 bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 shadow-xs'
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Ubah Pilihan</span>
            </button>
          ) : (
            <div />
          )}

          {currentStep < 5 ? (
            <button
              id="onboarding-next-btn"
              type="button"
              onClick={handleNext}
              disabled={currentStep === 1 && !schoolLevel}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer ml-auto disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Lanjutkan</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              id="onboarding-finish-btn"
              type="button"
              onClick={handleFinishOnboarding}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-extrabold flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer ml-auto"
            >
              <span>Masuk ke Halaman Utama & Mulai Belajar! 🚀</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </main>
    </div>
  );
};
