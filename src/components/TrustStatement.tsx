import React from 'react';
import { Compass, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

export const TrustStatement: React.FC = () => {
  return (
    <section className="relative py-16 sm:py-20 border-y border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.01]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Subtle line indicator */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200/80 dark:bg-white/5 text-slate-700 dark:text-slate-400 text-xs font-mono uppercase tracking-wider mb-6">
            <Sparkles className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
            <span>Foundational Philosophy</span>
          </div>

          {/* Primary Statement */}
          <blockquote className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-semibold tracking-tight text-slate-900 dark:text-white leading-snug sm:leading-tight">
            “Built with precision. Designed for people. Ready for the future.”
          </blockquote>

          {/* Three subtle pillars */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 pt-8 border-t border-slate-200 dark:border-white/10">
            <div className="flex flex-col items-center text-center p-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-500/15 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-3">
                <Compass className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                Architectural Rigor
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-xs leading-relaxed">
                Deterministic codebases, type-safety, and modular foundations that never compromise on speed.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-3">
              <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-500/15 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-3">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                Human-Centric Focus
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-xs leading-relaxed">
                Every micro-interaction is designed around human perception, ergonomics, and cognitive ease.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-50 dark:bg-cyan-500/15 flex items-center justify-center text-cyan-600 dark:text-cyan-400 mb-3">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                Enduring Stability
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-xs leading-relaxed">
                Engineered for long-term viability with zero-trust security and continuous automated compliance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
