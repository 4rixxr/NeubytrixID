import React from 'react';
import { Info, Lightbulb, Award, Palette, Cpu, Clock, CheckCircle2 } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const coreValues = [
    {
      title: 'Innovation',
      desc: 'Pioneering new paradigms in AI, edge systems, and spatial interfaces rather than following trends.',
      icon: Lightbulb,
      color: 'text-indigo-500 dark:text-indigo-400',
    },
    {
      title: 'Quality',
      desc: 'Rigorous engineering standards, deterministic testing, and zero-compromise finish on every surface.',
      icon: Award,
      color: 'text-purple-500 dark:text-purple-400',
    },
    {
      title: 'Creativity',
      desc: 'Marrying deep mathematical precision with artistic elegance, fluid motion, and bespoke typography.',
      icon: Palette,
      color: 'text-cyan-500 dark:text-cyan-400',
    },
    {
      title: 'Technology',
      desc: 'Building on modern cloud-native primitives, memory-safe languages, and cryptographic protocols.',
      icon: Cpu,
      color: 'text-blue-500 dark:text-blue-400',
    },
    {
      title: 'Long-term Thinking',
      desc: 'Architecting modular systems and resilient foundations designed to thrive through 2026 and decades ahead.',
      icon: Clock,
      color: 'text-emerald-500 dark:text-emerald-400',
    },
  ];

  return (
    <section id="about" className="relative py-28 sm:py-36 border-t border-slate-200 dark:border-white/10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Mission & Core Values (7 cols) */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-mono uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-6">
              <Info className="w-3.5 h-3.5" />
              <span>Identity & Mission</span>
            </div>

            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-6"
              style={{ fontFamily: "'Space Grotesk', 'Plus Jakarta Sans', sans-serif" }}
            >
              About NeubytrixID
            </h2>

            <p className="text-base sm:text-lg text-slate-800 dark:text-slate-200 leading-relaxed font-medium mb-6">
              NeubytrixID is a technology-focused digital brand dedicated to creating modern software,
              digital experiences, and innovative solutions.
            </p>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-10">
              Founded with the belief that technology in 2026 should be both extraordinarily powerful
              and intuitively human, we fuse frontier systems engineering with world-class digital
              craftsmanship. We do not build throwaway templates; we engineer durable platforms that
              empower creators, enterprises, and builders worldwide.
            </p>

            {/* Core Values Pill Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {coreValues.map((val) => {
                const IconComponent = val.icon;
                return (
                  <div
                    key={val.title}
                    className="p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.02] flex items-start gap-3.5 transition-all duration-200 hover:border-indigo-500/30 shadow-xs"
                  >
                    <div className="p-2 rounded-lg bg-slate-100 dark:bg-white/5 shrink-0">
                      <IconComponent className={`w-4 h-4 ${val.color}`} />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                        {val.title}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                        {val.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Abstract Isometric Graphic / Layered Glass Prism (5 cols) */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl p-8 border border-slate-200 dark:border-white/10 bg-slate-50/80 dark:bg-gradient-to-b dark:from-white/[0.04] dark:to-transparent backdrop-blur-xl shadow-xl flex flex-col items-center justify-center min-h-[460px] overflow-hidden">
              {/* Background ambient circular glow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-purple-500/10 to-cyan-500/10 blur-2xl" />

              {/* Central Geometric Hologram Graphic */}
              <div className="relative w-64 h-64 flex items-center justify-center">
                {/* Outer spinning ring */}
                <div className="absolute inset-0 rounded-full border border-dashed border-indigo-500/30 animate-[spin_40s_linear_infinite]" />
                <div className="absolute inset-4 rounded-full border border-indigo-500/20" />
                <div className="absolute inset-8 rounded-full border border-dashed border-purple-500/30 animate-[spin_25s_linear_infinite_reverse]" />

                {/* Layered Floating Glass Cards */}
                <div className="relative z-10 w-48 p-4 rounded-2xl bg-white dark:bg-[#121624]/90 border border-slate-200 dark:border-white/20 shadow-2xl backdrop-blur-md transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    <span className="text-[10px] font-mono text-slate-400">LAYER 03 // UI</span>
                  </div>
                  <div className="text-xs font-semibold text-slate-900 dark:text-white">
                    Spatial Perception Engine
                  </div>
                  <div className="mt-2 w-full bg-slate-100 dark:bg-white/10 rounded-full h-1">
                    <div className="bg-cyan-400 h-1 rounded-full w-4/5" />
                  </div>
                </div>

                <div className="absolute z-20 top-20 right-4 w-40 p-3.5 rounded-xl bg-slate-900 dark:bg-indigo-950/90 border border-indigo-500/40 shadow-xl backdrop-blur-md transform rotate-6 hover:rotate-0 transition-transform duration-500 text-white">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-indigo-300 mb-1">
                    <CheckCircle2 className="w-3 h-3 text-indigo-400" />
                    <span>L1 // NEURAL MESH</span>
                  </div>
                  <div className="text-[11px] font-medium text-slate-200">
                    Deterministic Latency
                  </div>
                </div>
              </div>

              {/* Status summary tag */}
              <div className="relative z-10 mt-6 pt-4 border-t border-slate-200 dark:border-white/10 w-full text-center">
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                  ESTABLISHED 2026 • GLOBAL REACH
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
