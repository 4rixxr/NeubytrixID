import React, { useEffect, useRef, useState } from 'react';
import { Clock, Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';
const options = [{ id: 'focus', label: 'Fokus', minutes: 25, xp: 60 }, { id: 'quick', label: 'Singkat', minutes: 15, xp: 35 }, { id: 'deep', label: 'Mendalam', minutes: 50, xp: 120 }, { id: 'break', label: 'Rehat', minutes: 5, xp: 0 }];
export function PomodoroTimer({ onSessionComplete }: { onSessionComplete?: (minutes: number, xp: number) => void }) {
  const [mode, setMode] = useState(options[0]), [seconds, setSeconds] = useState(1500), [running, setRunning] = useState(false), [completed, setCompleted] = useState(0), [sound, setSound] = useState(true);
  const remaining = useRef(1500), deadline = useRef(0), finished = useRef(false), callback = useRef(onSessionComplete), soundRef = useRef(sound);
  callback.current = onSessionComplete; soundRef.current = sound;
  useEffect(() => {
    if (!running) return;
    deadline.current = Date.now() + remaining.current * 1000; finished.current = false;
    const tick = () => {
      const left = Math.max(0, Math.ceil((deadline.current - Date.now()) / 1000)); remaining.current = left; setSeconds(left);
      if (left === 0 && !finished.current) {
        finished.current = true; setRunning(false);
        if (mode.xp) { setCompleted(v => v + 1); callback.current?.(mode.minutes, mode.xp); }
        if (soundRef.current) try { const context = new AudioContext(); const oscillator = context.createOscillator(), gain = context.createGain(); oscillator.connect(gain); gain.connect(context.destination); gain.gain.setValueAtTime(.12, context.currentTime); gain.gain.exponentialRampToValueAtTime(.001, context.currentTime + .4); oscillator.start(); oscillator.stop(context.currentTime + .4); oscillator.onended = () => { void context.close(); }; } catch { /* Audio may require a user gesture. */ }
      }
    };
    const timer = setInterval(tick, 250); tick(); return () => clearInterval(timer);
  }, [running, mode]);
  const reset = (next = mode) => { setRunning(false); finished.current = true; setMode(next); remaining.current = next.minutes * 60; setSeconds(remaining.current); };
  const toggle = () => { if (running) { remaining.current = Math.max(0, Math.ceil((deadline.current - Date.now()) / 1000)); setSeconds(remaining.current); setRunning(false); } else { if (remaining.current === 0) { remaining.current = mode.minutes * 60; setSeconds(remaining.current); } setRunning(true); } };
  return <section id="pomodoro-focus-card" className="nb-panel"><div className="nb-panel-heading"><h2 className="flex items-center gap-2"><Clock size={17} />Waktunya fokus</h2><button aria-label={sound ? 'Matikan suara' : 'Nyalakan suara'} onClick={() => setSound(!sound)}>{sound ? <Volume2 size={16} /> : <VolumeX size={16} />}</button></div><div className="flex flex-wrap gap-2">{options.map(option => <button key={option.id} onClick={() => reset(option)} className="text-[10px] py-1.5 px-2.5 rounded-full border" style={{ background: mode.id === option.id ? 'var(--nb-mint)' : 'transparent', borderColor: mode.id === option.id ? 'var(--nb-green)' : 'var(--nb-line)' }}>{option.label} · {option.minutes}m</button>)}</div><div className="text-center py-6"><p className="text-[10px] text-slate-500 mb-2">{mode.id === 'break' ? 'Tarik napas. Istirahat sebentar.' : 'Satu tugas, satu sesi.'}</p><div role="timer" className="text-5xl font-semibold tracking-tight tabular-nums" data-testid="focus-time">{String(Math.floor(seconds / 60)).padStart(2, '0')}:{String(seconds % 60).padStart(2, '0')}</div><p className="text-[10px] mt-2 text-slate-500">{mode.xp ? `+${mode.xp} XP saat sesi selesai` : 'Sesi istirahat · tanpa XP'}</p></div><div className="flex justify-center gap-2"><button id="pomodoro-toggle-btn" className="nb-primary" onClick={toggle}>{running ? <Pause size={15} /> : <Play size={15} />}{running ? 'Jeda' : 'Mulai sesi'}</button><button id="pomodoro-reset-btn" aria-label="Reset timer" className="nb-login" onClick={() => reset()}><RotateCcw size={16} /></button></div><p className="text-[9px] text-center text-slate-500 mt-4">{completed} sesi fokus selesai · Timer tetap berjalan saat pindah menu</p></section>;
}
