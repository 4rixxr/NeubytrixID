import React, { useEffect, useState } from 'react';
import { Check, Flame, ArrowRight, Sprout, Zap, Star, Sparkles, Award, Trophy } from 'lucide-react';
const rewardIcons = [Sprout, Zap, Star, Sparkles, Flame, Award, Trophy];
import { CHECK_IN_REWARDS, claimDailyCheckIn, loadUserDataByCode, UserLearningData, getTodayDateString } from '../utils/userCodeStore';
export function DailyCheckIn({ userCode, onDataUpdated, className = '' }: { userCode: string; onDataUpdated?: (data: UserLearningData) => void; className?: string }) {
  const [status, setStatus] = useState(() => loadUserDataByCode(userCode).dailyCheckIn), [notice, setNotice] = useState('');
  useEffect(() => {
    setStatus(loadUserDataByCode(userCode).dailyCheckIn);
    let day = getTodayDateString();
    const timer = setInterval(() => { if (day !== getTodayDateString()) { day = getTodayDateString(); setStatus(loadUserDataByCode(userCode).dailyCheckIn); setNotice(''); } }, 1000);
    return () => clearInterval(timer);
  }, [userCode]);
  const target = status.claimedToday ? status.currentDayInCycle : status.streakDays % 7 + 1;
  const claim = () => { const result = claimDailyCheckIn(userCode); setStatus(result.data.dailyCheckIn); onDataUpdated?.(result.data); setNotice(result.alreadyClaimed ? 'Kamu sudah check-in hari ini.' : `Check-in berhasil. +${result.xpAwarded} XP!`); };
  return <section id="daily-check-in" className={`nb-panel ${className}`}><div className="nb-panel-heading"><div><h2 className="flex items-center gap-2"><Flame size={18} style={{ color: 'var(--nb-green)' }} />Sedikit setiap hari.</h2><p className="text-[10px] mt-2 text-slate-500">Check-in untuk membangun kebiasaan. Streak kembali ke awal jika melewatkan satu hari.</p></div><span className="text-xs font-semibold">{status.streakDays} hari</span></div><div className="grid grid-cols-7 gap-1.5 sm:gap-3">{CHECK_IN_REWARDS.map(reward => <div key={reward.day} className="rounded-xl text-center py-3 border" style={{ borderColor: reward.day === target ? 'var(--nb-green)' : 'var(--nb-line)', background: reward.day <= target && status.claimedToday ? 'var(--nb-mint)' : 'var(--nb-bg)' }}><p className="text-[8px] sm:text-[10px] text-slate-500">Hari {reward.day}</p><div className="py-2 h-9 flex items-center justify-center">{status.claimedToday && reward.day <= target ? <Check size={16} style={{ color: 'var(--nb-green)' }} /> : React.createElement(rewardIcons[reward.day - 1], { size: 16, style: { color: 'var(--nb-green)' }, 'aria-hidden': true })}</div><p className="text-[9px] sm:text-xs font-semibold">+{reward.xp}</p></div>)}</div><div className="flex flex-wrap items-center justify-between gap-3 mt-5"><p role="status" className="text-[10px] text-slate-500">{notice || (status.claimedToday ? 'Check-in hari ini selesai. Sampai besok!' : 'Langkah kecilmu hari ini layak dirayakan.')}</p><button id="claim-checkin-btn" className="nb-primary" onClick={claim} disabled={status.claimedToday}>{status.claimedToday ? 'Sudah check-in' : 'Check-in hari ini'}{status.claimedToday ? <Check size={14} /> : <ArrowRight size={14} />}</button></div></section>;
}
