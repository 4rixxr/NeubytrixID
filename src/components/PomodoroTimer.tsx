import React, { useState, useEffect } from 'react';
import { Clock, Play, Pause, RotateCcw, FastForward, Volume2, VolumeX, Sparkles } from 'lucide-react';

interface PomodoroTimerProps {
  onSessionComplete?: (durationMinutes: number, earnedXp: number) => void;
}

type DurationType = 'standard' | 'quick' | 'deep' | 'short_break' | 'long_break';

export const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ onSessionComplete }) => {
  const [mode, setMode] = useState<DurationType>('standard');
  const [totalSeconds, setTotalSeconds] = useState<number>(25 * 60);
  const [secondsLeft, setSecondsLeft] = useState<number>(25 * 60);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [completedSessions, setCompletedSessions] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  const durationOptions: { id: DurationType; label: string; minutes: number; xp: number; isBreak?: boolean }[] = [
    { id: 'standard', label: '🍅 Standar (25m)', minutes: 25, xp: 60 },
    { id: 'quick', label: '⚡ Kilat (15m)', minutes: 15, xp: 35 },
    { id: 'deep', label: '🎯 Mendalam (50m)', minutes: 50, xp: 120 },
    { id: 'short_break', label: '☕ Rehat Singkat (5m)', minutes: 5, xp: 10, isBreak: true },
    { id: 'long_break', label: '🛋️ Rehat Panjang (15m)', minutes: 15, xp: 20, isBreak: true },
  ];

  const currentOption = durationOptions.find((d) => d.id === mode) || durationOptions[0];

  const handleSelectDuration = (selected: DurationType) => {
    const opt = durationOptions.find((d) => d.id === selected) || durationOptions[0];
    setMode(selected);
    setIsActive(false);
    setTotalSeconds(opt.minutes * 60);
    setSecondsLeft(opt.minutes * 60);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (isActive && secondsLeft === 0) {
      setIsActive(false);
      setCompletedSessions((prev) => prev + 1);
      if (onSessionComplete) {
        onSessionComplete(currentOption.minutes, currentOption.xp);
      }
      if (soundEnabled) {
        try {
          const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
          osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.3); // A5
          gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.6);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start();
          osc.stop(audioCtx.currentTime + 0.6);
        } catch {
          // ignore
        }
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, secondsLeft, currentOption, onSessionComplete, soundEnabled]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setSecondsLeft(totalSeconds);
  };

  const skipTimer = () => {
    setIsActive(false);
    setSecondsLeft(0);
  };

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const progressPercent = totalSeconds > 0 ? Math.round(((totalSeconds - secondsLeft) / totalSeconds) * 100) : 0;

  return (
    <div
      id="pomodoro-focus-card"
      className="rounded-2xl bg-white dark:bg-gradient-to-b dark:from-slate-900/90 dark:to-slate-950 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs relative overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-200 dark:border-indigo-500/30">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">Pomodoro Focus Timer</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Fokus penuh tanpa distraksi. XP otomatis bertambah saat timer tuntas!
            </p>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded-full bg-purple-50 dark:bg-purple-500/15 border border-purple-200 dark:border-purple-500/30 text-purple-700 dark:text-purple-300 text-[11px] font-semibold tracking-wide whitespace-nowrap">
          MODE FOKUS
        </span>
      </div>

      {/* Pill row */}
      <div className="flex items-center justify-between gap-2 my-4 relative z-10">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-amber-600 dark:text-amber-400">
          <span>🔥 {completedSessions} Sesi Selesai</span>
        </div>

        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white transition-colors cursor-pointer"
          aria-label={soundEnabled ? 'Matikan suara' : 'Nyalakan suara'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-slate-700 dark:text-slate-300" /> : <VolumeX className="w-4 h-4 text-slate-400 dark:text-slate-500" />}
        </button>
      </div>

      {/* Timer Display */}
      <div className="text-center my-6 relative z-10">
        <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
          {progressPercent}% {currentOption.isBreak ? 'Rehat' : 'Fokus'}
        </div>

        <div className="text-5xl sm:text-6xl font-black font-mono text-slate-900 dark:text-white tracking-tight drop-shadow-xs">
          {timeFormatted}
        </div>

        <div className="text-xs font-semibold text-amber-600 dark:text-amber-400 mt-2 flex items-center justify-center gap-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Hadiah: +{currentOption.xp} XP</span>
        </div>
      </div>

      {/* Timer Controls */}
      <div className="flex items-center justify-center gap-2.5 sm:gap-3 mb-6 relative z-10">
        <button
          id="pomodoro-toggle-btn"
          onClick={toggleTimer}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm text-white shadow-lg transition-all cursor-pointer ${
            isActive
              ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/30'
              : 'bg-indigo-600 hover:bg-indigo-700 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-indigo-600/30'
          }`}
        >
          {isActive ? (
            <>
              <Pause className="w-4 h-4 fill-white" />
              <span>Jeda</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-white" />
              <span>Mulai Fokus</span>
            </>
          )}
        </button>

        <button
          id="pomodoro-reset-btn"
          onClick={resetTimer}
          className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/80 text-sm font-medium transition-colors cursor-pointer shadow-xs"
          title="Reset timer"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="hidden sm:inline">Reset</span>
        </button>

        <button
          id="pomodoro-skip-btn"
          onClick={skipTimer}
          className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors cursor-pointer shadow-xs"
          title="Selesaikan segera"
        >
          <FastForward className="w-4 h-4" />
        </button>
      </div>

      {/* Duration Options */}
      <div className="relative z-10">
        <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
          Pilihan Durasi:
        </div>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {durationOptions.map((opt) => {
            const isSelected = mode === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => handleSelectDuration(opt.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 border border-indigo-400/40 font-semibold'
                    : 'bg-white dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-950 dark:hover:text-white shadow-xs'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
