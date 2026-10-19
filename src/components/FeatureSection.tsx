import React, { useState, useEffect } from 'react';
import {
  Zap,
  Minimize2,
  Atom,
  ShieldCheck,
  Maximize,
  Sparkles,
  Activity,
  Lock,
  Cpu,
  CheckCircle2,
} from 'lucide-react';
import { FEATURE_PILLARS } from '../data/siteData';

export const FeatureSection: React.FC = () => {
  const [activePillarId, setActivePillarId] = useState<string>('performance');
  const [activeTab, setActiveTab] = useState<'latency' | 'security' | 'pipeline'>('latency');
  const [livePing, setLivePing] = useState<number>(1.2);

  // Subtle simulated live ping fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setLivePing(Number((1.1 + Math.random() * 0.3).toFixed(2)));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const activePillar =
    FEATURE_PILLARS.find((p) => p.id === activePillarId) || FEATURE_PILLARS[0];

  const renderPillarIcon = (name: string) => {
    switch (name) {
      case 'Zap':
        return <Zap className="w-4 h-4" />;
      case 'Minimize2':
        return <Minimize2 className="w-4 h-4" />;
      case 'Atom':
        return <Atom className="w-4 h-4" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-4 h-4" />;
      case 'Maximize':
        return <Maximize className="w-4 h-4" />;
      case 'Sparkle':
        return <Sparkles className="w-4 h-4" />;
      default:
        return <Zap className="w-4 h-4" />;
    }
  };

  return (
    <section className="relative py-28 sm:py-36 border-t border-slate-200 dark:border-white/10 overflow-hidden">
      {/* Subtle ambient lighting */}
      <div className="absolute -right-40 top-1/4 w-[500px] h-[500px] bg-indigo-500/10 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute -left-40 bottom-1/4 w-[400px] h-[400px] bg-cyan-500/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header */}
        <div className="max-w-3xl mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-mono uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Architecture Specification</span>
          </div>

          <h2
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.1] mb-6"
            style={{ fontFamily: "'Space Grotesk', 'Plus Jakarta Sans', sans-serif" }}
          >
            Designed Beyond Expectations.
          </h2>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl font-normal">
            We hold our engineering, infrastructure, and design systems to uncompromising standards.
            Explore the core technical pillars that power the NeubytrixID standard.
          </p>
        </div>

        {/* Asymmetric 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Interactive Pillars List (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            {FEATURE_PILLARS.map((pillar) => {
              const isSelected = pillar.id === activePillarId;
              return (
                <button
                  key={pillar.id}
                  type="button"
                  onClick={() => setActivePillarId(pillar.id)}
                  className={`w-full text-left p-4 sm:p-5 rounded-2xl transition-all duration-300 border flex items-start gap-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer ${
                    isSelected
                      ? 'bg-white dark:bg-white/[0.07] border-indigo-600 dark:border-indigo-400/40 shadow-lg shadow-indigo-500/5'
                      : 'bg-slate-50/70 dark:bg-white/[0.02] border-slate-200 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-white/[0.04]'
                  }`}
                >
                  <div
                    className={`p-2.5 rounded-xl shrink-0 transition-colors duration-200 ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-200/70 dark:bg-white/5 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {renderPillarIcon(pillar.iconName)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3
                        className={`text-base font-semibold tracking-tight ${
                          isSelected
                            ? 'text-slate-900 dark:text-white'
                            : 'text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {pillar.title}
                      </h3>
                      <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-md bg-slate-200 dark:bg-white/5 text-slate-600 dark:text-slate-400">
                        {pillar.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {pillar.summary}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Column: Futuristic Interactive Visual Panel (7 cols) */}
          <div className="lg:col-span-7">
            <div className="relative rounded-3xl p-6 sm:p-8 border border-slate-700/80 dark:border-white/15 bg-gradient-to-br from-[#0D101B]/95 via-[#0B0D17]/98 to-[#080910] text-white shadow-2xl overflow-hidden backdrop-blur-2xl">
              {/* Corner accent glow */}
              <div className="absolute -top-24 -right-24 w-60 h-60 bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 blur-3xl pointer-events-none" />

              {/* Panel Top Bar / Terminal Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10 mb-6">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="text-xs font-mono text-slate-400 pl-2 border-l border-white/10">
                    Neubytrix.SystemInspector // {activePillar.title.toUpperCase()}
                  </span>
                </div>

                {/* Sub-tabs inside visual panel */}
                <div className="flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/10 text-xs">
                  <button
                    type="button"
                    onClick={() => setActiveTab('latency')}
                    className={`px-3 py-1 rounded-lg font-mono transition-colors cursor-pointer ${
                      activeTab === 'latency'
                        ? 'bg-indigo-500/80 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Mesh
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('security')}
                    className={`px-3 py-1 rounded-lg font-mono transition-colors cursor-pointer ${
                      activeTab === 'security'
                        ? 'bg-indigo-500/80 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Security
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('pipeline')}
                    className={`px-3 py-1 rounded-lg font-mono transition-colors cursor-pointer ${
                      activeTab === 'pipeline'
                        ? 'bg-indigo-500/80 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Pipeline
                  </button>
                </div>
              </div>

              {/* Dynamic Content based on active Tab */}
              {activeTab === 'latency' && (
                <div className="space-y-6">
                  {/* Live Telemetry Banner */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                    <div>
                      <div className="text-[11px] font-mono text-slate-400">EDGE DISPATCH</div>
                      <div className="text-lg font-bold font-mono text-emerald-400 mt-0.5 flex items-center gap-1.5">
                        <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
                        <span>{livePing} ms</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] font-mono text-slate-400">POPS ACTIVE</div>
                      <div className="text-lg font-bold font-mono text-white mt-0.5">380+</div>
                    </div>
                    <div>
                      <div className="text-[11px] font-mono text-slate-400">BURST BURDEN</div>
                      <div className="text-lg font-bold font-mono text-cyan-400 mt-0.5">0.02%</div>
                    </div>
                    <div>
                      <div className="text-[11px] font-mono text-slate-400">HEALTH</div>
                      <div className="text-lg font-bold font-mono text-indigo-400 mt-0.5">100%</div>
                    </div>
                  </div>

                  {/* Simulated Node Routing Visualization */}
                  <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-3 font-mono text-xs">
                    <div className="text-[11px] text-slate-400 flex items-center justify-between">
                      <span>GLOBAL TOPOLOGY ROUTING</span>
                      <span className="text-emerald-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                        SYNCHRONIZED
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02]">
                        <span className="text-slate-300">NRT-1 (Tokyo Hub)</span>
                        <span className="text-slate-400">1.2ms • Isolate Warm</span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02]">
                        <span className="text-slate-300">FRA-2 (Frankfurt Core)</span>
                        <span className="text-slate-400">0.9ms • Zero Jitter</span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02]">
                        <span className="text-slate-300">SFO-4 (Silicon Valley)</span>
                        <span className="text-slate-400">1.4ms • P99.9 Sub-2ms</span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02]">
                        <span className="text-slate-300">SIN-1 (Singapore Gateway)</span>
                        <span className="text-slate-400">1.1ms • Optimal Route</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
                      <Lock className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">Quantum-Resistant Enclave</div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        Post-quantum Kyber-1024 cryptographic handshakes activated.
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                    <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                      <div className="text-slate-400">MEMORY SAFETY</div>
                      <div className="text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> 100% Rust / Strict TS
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                      <div className="text-slate-400">ZERO-TRUST VERIFY</div>
                      <div className="text-cyan-400 font-bold flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" /> Every Packet Signed
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                      <div className="text-slate-400">KEY ROTATION</div>
                      <div className="text-white font-bold">Ephemeral (60s)</div>
                    </div>
                    <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                      <div className="text-slate-400">ISOLATION TIER</div>
                      <div className="text-indigo-400 font-bold">Hardware Enclave</div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'pipeline' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                      <Cpu className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">Neural Synthesizer v2.6</div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        Adaptive inference streaming with real-time token backpressure.
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-black/40 border border-white/5 font-mono text-xs space-y-2">
                    <div className="flex justify-between text-slate-400">
                      <span>TOKEN VELOCITY</span>
                      <span className="text-cyan-400">184 tokens/sec</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full w-[82%]" />
                    </div>
                    <div className="flex justify-between text-slate-400 pt-2 border-t border-white/5">
                      <span>CACHE HIT RATE</span>
                      <span className="text-emerald-400">99.4% Sub-cached</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Active Pillar Deep Dive Box */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-mono text-indigo-300 uppercase tracking-wide">
                    Focus: {activePillar.title}
                  </span>
                  <span className="text-xs font-semibold text-emerald-400">
                    {activePillar.metric} {activePillar.metricLabel}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {activePillar.details}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
