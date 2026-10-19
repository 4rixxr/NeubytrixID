import React from 'react';
import { Terminal, Activity, Cpu, HeartHandshake, Sparkles } from 'lucide-react';
import { STATISTICS_DATA } from '../data/siteData';

export const StatisticsSection: React.FC = () => {
  const renderIcon = (name: string) => {
    switch (name) {
      case 'Terminal':
        return <Terminal className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />;
      case 'Activity':
        return <Activity className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />;
      case 'Cpu':
        return <Cpu className="w-5 h-5 text-cyan-500 dark:text-cyan-400" />;
      case 'HeartHandshake':
        return <HeartHandshake className="w-5 h-5 text-purple-500 dark:text-purple-400" />;
      default:
        return <Terminal className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />;
    }
  };

  return (
    <section className="relative py-24 sm:py-32 border-t border-slate-200 dark:border-white/10 bg-slate-50/40 dark:bg-white/[0.01]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-mono uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Guiding Principles</span>
          </div>

          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-4"
            style={{ fontFamily: "'Space Grotesk', 'Plus Jakarta Sans', sans-serif" }}
          >
            Built with ambition.
          </h2>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            Grounded in rigorous technical values and dedicated to elevating what digital
            systems are capable of.
          </p>
        </div>

        {/* 4 Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STATISTICS_DATA.map((stat) => (
            <div
              key={stat.id}
              className="relative p-6 sm:p-7 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.02] hover:bg-slate-50/80 dark:hover:bg-white/[0.05] transition-all duration-300 shadow-xs hover:shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-6">
                  <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-white/5 border border-indigo-100 dark:border-white/10">
                    {renderIcon(stat.icon)}
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 dark:text-slate-500">
                    Metric
                  </span>
                </div>

                <div
                  className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-1"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {stat.label}
                </div>

                <div className="text-xs font-medium text-indigo-600 dark:text-indigo-400 mb-3">
                  {stat.tagline}
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {stat.subtext}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-[11px] font-mono text-slate-500">Standard Verified</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
