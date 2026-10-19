import React from 'react';
import { Calendar, CheckCircle2, Clock, Circle, ArrowRight } from 'lucide-react';
import { TimelineMilestone } from '../types';

interface TimelineViewProps {
  timeline: TimelineMilestone[];
  onToggleTarget?: (month: number, targetIndex: number) => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({ timeline, onToggleTarget }) => {
  return (
    <div id="neubytrix-timeline-view" className="space-y-6 pb-20 md:pb-8 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          Target Belajar 6 Bulan 🎯
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
          Peta jalan komprehensif untuk mencapai lompatan prestasi dan penguasaan materi sekolah semester ini.
        </p>
      </div>

      <div className="space-y-4">
        {timeline.map((m) => {
          let badge = (
            <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-full">
              Mendatang
            </span>
          );
          if (m.status === 'completed') {
            badge = (
              <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-200 dark:border-emerald-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Tuntas</span>
              </span>
            );
          } else if (m.status === 'in_progress') {
            badge = (
              <span className="text-[11px] font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-500/20 border border-indigo-200 dark:border-indigo-500/40 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Clock className="w-3 h-3 animate-spin" />
                <span>Sedang Berjalan</span>
              </span>
            );
          }

          return (
            <div
              key={m.month}
              className={`p-5 rounded-2xl border transition-all shadow-xs ${
                m.status === 'in_progress'
                  ? 'bg-white dark:bg-gradient-to-r dark:from-slate-900 dark:via-indigo-950/20 dark:to-slate-900 border-indigo-300 dark:border-indigo-500/40 shadow-sm'
                  : 'bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                    Bulan ke-{m.month}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">{m.title}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{m.description}</p>
                </div>
                {badge}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
                {m.targets.map((tgt, idx) => (
                  <div
                    key={idx}
                    onClick={() => onToggleTarget && onToggleTarget(m.month, idx)}
                    className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer hover:text-indigo-600 dark:hover:text-white transition-colors"
                  >
                    {tgt.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-400 dark:text-slate-600 flex-shrink-0" />
                    )}
                    <span className={tgt.completed ? 'line-through text-slate-400 dark:text-slate-500' : ''}>
                      {tgt.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
