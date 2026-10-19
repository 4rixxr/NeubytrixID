import React, { useState, useEffect } from 'react';
import {
  Flame,
  CheckCircle2,
  Sparkles,
  Zap,
  Gift,
  Clock,
  CalendarCheck2,
  Trophy,
  ArrowRight,
  Info,
} from 'lucide-react';
import { NeubytrixLogoIcon } from './Logo';
import {
  DailyCheckInStatus,
  CHECK_IN_REWARDS,
  claimDailyCheckIn,
  loadUserDataByCode,
  UserLearningData,
} from '../utils/userCodeStore';

interface DailyCheckInProps {
  userCode: string;
  onDataUpdated?: (updated: UserLearningData) => void;
  className?: string;
}

export const DailyCheckIn: React.FC<DailyCheckInProps> = ({
  userCode,
  onDataUpdated,
  className = '',
}) => {
  const [checkInData, setCheckInData] = useState<DailyCheckInStatus>(() => {
    const data = loadUserDataByCode(userCode);
    return data.dailyCheckIn;
  });

  const [claiming, setClaiming] = useState<boolean>(false);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);
  const [awardedInfo, setAwardedInfo] = useState<{ xp: number; streak: number; day: number } | null>(null);
  const [timeUntilReset, setTimeUntilReset] = useState<string>('');

  // Keep state refreshed when userCode changes
  useEffect(() => {
    const data = loadUserDataByCode(userCode);
    setCheckInData(data.dailyCheckIn);
  }, [userCode]);

  // Live countdown to midnight daily reset
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const diffMs = tomorrow.getTime() - now.getTime();
      if (diffMs > 0) {
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
        setTimeUntilReset(
          `${String(hours).padStart(2, '0')}j ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}d`
        );
      } else {
        setTimeUntilReset('00j 00m 00d');
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleClaim = () => {
    if (checkInData.claimedToday || claiming) return;

    setClaiming(true);

    try {
      const res = claimDailyCheckIn(userCode);
      setCheckInData(res.data.dailyCheckIn);
      setAwardedInfo({
        xp: res.xpAwarded,
        streak: res.newStreak,
        day: res.dayInCycle,
      });
      setShowCelebration(true);

      if (onDataUpdated) {
        onDataUpdated(res.data);
      }

      // Hide celebration modal/toast after 4.5 seconds
      setTimeout(() => {
        setShowCelebration(false);
      }, 4500);
    } catch (err) {
      console.error('Check-in error:', err);
    } finally {
      setClaiming(false);
    }
  };

  // Determine active day in 7-day reward cycle
  const currentStreak = checkInData.streakDays || 0;
  const isClaimedToday = checkInData.claimedToday;
  
  // When claimed today, current day is currentDayInCycle; if not claimed today yet,
  // next target day is either currentDayInCycle (or 1 if starting/broken)
  const targetDayInCycle = isClaimedToday
    ? checkInData.currentDayInCycle || 1
    : ((currentStreak) % 7) + 1;

  const currentReward = CHECK_IN_REWARDS.find((r) => r.day === targetDayInCycle) || CHECK_IN_REWARDS[0];
  const nextReward = CHECK_IN_REWARDS.find((r) => r.day === ((targetDayInCycle % 7) + 1)) || CHECK_IN_REWARDS[0];

  return (
    <section
      id="neubytrix-daily-checkin-card"
      aria-label="Daily Check-in NeubytrixID"
      className={`relative overflow-hidden rounded-3xl border border-indigo-200/80 dark:border-indigo-500/25 bg-gradient-to-br from-indigo-50/90 via-white to-purple-50/50 dark:from-slate-900/95 dark:via-[#0c1226] dark:to-indigo-950/40 p-5 sm:p-7 shadow-lg shadow-indigo-500/5 transition-all ${className}`}
    >
      {/* Background ambient lighting */}
      <div
        className="pointer-events-none absolute -right-16 -top-16 w-64 h-64 rounded-full bg-gradient-to-br from-amber-400/20 via-pink-500/15 to-indigo-600/20 blur-3xl opacity-70"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -left-12 -bottom-12 w-56 h-56 rounded-full bg-gradient-to-tr from-cyan-400/15 via-indigo-500/15 to-transparent blur-2xl opacity-60"
        aria-hidden="true"
      />

      {/* Header Row */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-indigo-100 dark:border-slate-800/90">
        <div className="flex items-center gap-3.5">
          {/* Official NeubytrixID Logo Container */}
          <div className="relative p-1.5 rounded-2xl bg-white dark:bg-slate-800/80 shadow-md shadow-indigo-500/10 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0">
            <NeubytrixLogoIcon size={44} className="hover:scale-105 transition-transform" />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center shadow-xs">
              <Sparkles className="w-2.5 h-2.5 text-white" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5">
                <span>Daily Check-in</span>
                <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-300/50 dark:border-indigo-800/60">
                  NeubytrixID
                </span>
              </h2>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Login setiap hari untuk akumulasi streak belajar & panen bonus XP spesial!
            </p>
          </div>
        </div>

        {/* Streak Stats Badges */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          {/* Persistent Streak Counter Pill */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-amber-500/10 dark:bg-amber-950/50 border border-amber-300/80 dark:border-amber-700/60 text-amber-700 dark:text-amber-300 shadow-xs">
            <Flame className="w-4 h-4 fill-amber-500 text-amber-500 animate-pulse" />
            <div className="text-left">
              <div className="text-xs font-black leading-none">
                {currentStreak} Hari
              </div>
              <div className="text-[9px] uppercase tracking-wider font-semibold opacity-80">
                Streak Aktif
              </div>
            </div>
          </div>

          {/* Total check-in history count */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
            <CalendarCheck2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <div className="text-left">
              <div className="text-xs font-black leading-none">
                {checkInData.totalCheckIns || 0}
              </div>
              <div className="text-[9px] uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">
                Total Check-in
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 7-Day Progressive Reward Map */}
      <div className="relative z-10 pt-5 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <Gift className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Rangkaian Hadiah 7 Hari</span>
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Clock className="w-3 h-3 text-indigo-500" />
            <span>Reset harian: {timeUntilReset || '00:00 WIB'}</span>
          </span>
        </div>

        {/* The 7 Days Scrollable / Responsive Grid */}
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 sm:gap-2.5 overflow-x-auto no-scrollbar pb-1">
          {CHECK_IN_REWARDS.map((item) => {
            const isTodayCard = targetDayInCycle === item.day;
            const isCompletedInCycle =
              isClaimedToday
                ? item.day <= (checkInData.currentDayInCycle || 0)
                : item.day < targetDayInCycle;
            const isGrandPrize = item.day === 7;

            return (
              <div
                key={item.day}
                className={`relative flex flex-col items-center justify-between p-2.5 sm:p-3 rounded-2xl border text-center transition-all duration-300 select-none ${
                  isTodayCard && !isClaimedToday
                    ? 'border-amber-400 dark:border-amber-500/80 bg-gradient-to-b from-amber-50 to-orange-50/80 dark:from-amber-950/40 dark:to-slate-900 shadow-md shadow-amber-500/10 ring-2 ring-amber-400/40 transform scale-[1.02]'
                    : isCompletedInCycle
                    ? 'border-emerald-300/80 dark:border-emerald-800/60 bg-emerald-50/70 dark:bg-emerald-950/30 text-slate-700 dark:text-slate-200'
                    : isGrandPrize
                    ? 'border-purple-300 dark:border-purple-800/60 bg-purple-50/60 dark:bg-purple-950/20 text-slate-700 dark:text-slate-300'
                    : 'border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400'
                }`}
              >
                {/* Badge top */}
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {item.label}
                  </span>
                  {isCompletedInCycle && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  )}
                </div>

                {/* Day Icon / Emoji */}
                <div className="my-1 text-xl sm:text-2xl drop-shadow-xs transition-transform hover:scale-110">
                  {isCompletedInCycle ? '✅' : item.icon}
                </div>

                {/* Reward XP */}
                <div className="mt-1">
                  <div
                    className={`text-xs font-black tracking-tight ${
                      isTodayCard && !isClaimedToday
                        ? 'text-amber-600 dark:text-amber-400'
                        : isCompletedInCycle
                        ? 'text-emerald-700 dark:text-emerald-400'
                        : isGrandPrize
                        ? 'text-purple-600 dark:text-purple-400'
                        : 'text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    +{item.xp} XP
                  </div>
                  <div className="text-[9px] text-slate-500 dark:text-slate-400 truncate max-w-[65px] font-medium">
                    {item.title}
                  </div>
                </div>

                {/* Highlight Tag for Today */}
                {isTodayCard && (
                  <div className="mt-1.5 w-full">
                    <span
                      className={`block text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                        isClaimedToday
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                          : 'bg-amber-400 text-slate-900 animate-bounce'
                      }`}
                    >
                      {isClaimedToday ? 'Hari Ini ✓' : 'Klaim!'}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Claim Section */}
      <div className="relative z-10 mt-5 pt-4 border-t border-indigo-100 dark:border-slate-800/90 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-left w-full sm:w-auto">
          {isClaimedToday ? (
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-700 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  Check-in Hari Ini Berhasil! Streak: {currentStreak} Hari 🔥
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Kembali besok untuk reward +{nextReward.xp} XP ({nextReward.label}: {nextReward.title}).
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-amber-100 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-700 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                <Zap className="w-4 h-4 fill-amber-500 text-amber-500" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  Bonus Hari Ini: +{currentReward.xp} XP ({currentReward.label})
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Klik tombol di samping untuk mengamankan streak & menambah XP kamu!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Claim Action Button */}
        <div className="w-full sm:w-auto shrink-0">
          {isClaimedToday ? (
            <div className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 text-xs sm:text-sm font-bold shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Sudah Diklaim (Reset {timeUntilReset})</span>
            </div>
          ) : (
            <button
              id="btn-claim-daily-checkin"
              onClick={handleClaim}
              disabled={claiming}
              className="w-full sm:w-auto relative group flex items-center justify-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-indigo-600 hover:from-amber-400 hover:via-orange-400 hover:to-indigo-500 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-orange-500/25 active:scale-95 transition-all cursor-pointer overflow-hidden disabled:opacity-70"
            >
              {/* Animated sheen effect */}
              <div
                className="absolute inset-0 w-1/2 h-full bg-white/25 -skew-x-12 transform -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 pointer-events-none"
                aria-hidden="true"
              />
              <Sparkles className="w-4 h-4 animate-spin text-amber-200" />
              <span>Klaim Check-in Hari Ini (+{currentReward.xp} XP)</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>
      </div>

      {/* Floating Celebration Overlay on Claim */}
      {showCelebration && awardedInfo && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 animate-in fade-in zoom-in-95 duration-300">
          <div className="max-w-sm w-full p-5 rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 border border-amber-400/60 shadow-2xl text-center space-y-3 relative overflow-hidden">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-3xl shadow-lg shadow-amber-400/20 animate-bounce">
              🎉
            </div>
            
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-extrabold tracking-wider px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 inline-block">
                NeubytrixID Check-in
              </span>
              <h3 className="text-xl font-black text-white">
                +{awardedInfo.xp} XP Berhasil Diklaim!
              </h3>
              <p className="text-xs text-amber-200/90 font-medium">
                Streak berturut-turut kamu sekarang: <span className="font-bold text-white underline">{awardedInfo.streak} Hari</span> 🔥
              </p>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-[11px] text-slate-300">
              Pertahankan streak belajarmu besok untuk membuka reward hari ke-{((awardedInfo.day % 7) + 1)}!
            </div>

            <button
              onClick={() => setShowCelebration(false)}
              className="w-full py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition-colors cursor-pointer"
            >
              Mantap, Lanjutkan Belajar! 🚀
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
