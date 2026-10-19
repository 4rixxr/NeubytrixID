import React, { useEffect, useRef } from 'react';
import { ArrowRight, Sparkles, Shield, Cpu, Zap } from 'lucide-react';

interface HeroProps {
  onExploreClick: () => void;
  onGetStartedClick: () => void;
  onStartOnboarding?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreClick,
  onGetStartedClick,
  onStartOnboarding,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Subtle interactive particle mesh
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const particleCount = Math.min(Math.floor((width * height) / 22000), 55);
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      baseAlpha: number;
    }> = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 1.5 + 1,
        baseAlpha: Math.random() * 0.3 + 0.15,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      const isDark = document.documentElement.classList.contains('dark');
      const particleRgb = isDark ? '147, 197, 253' : '99, 102, 241';
      const lineRgb = isDark ? '99, 102, 241' : '147, 197, 253';

      const maxDistance = 140;
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * (isDark ? 0.15 : 0.1);
            ctx.strokeStyle = `rgba(${lineRgb}, ${alpha})`;
            ctx.lineWidth = 0.75;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }

        ctx.fillStyle = `rgba(${particleRgb}, ${p1.baseAlpha * (isDark ? 1 : 0.8)})`;
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
        ctx.fill();

        if (!prefersReducedMotion) {
          p1.x += p1.vx;
          p1.y += p1.vy;
          if (p1.x < 0) p1.x = width;
          else if (p1.x > width) p1.x = 0;
          if (p1.y < 0) p1.y = height;
          else if (p1.y > height) p1.y = 0;
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-[92vh] flex items-center justify-center pt-28 pb-16 overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Subtle radial glow orbs */}
        <div className="absolute -top-36 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-gradient-to-b from-indigo-500/15 via-purple-500/10 to-transparent blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 -left-32 w-[350px] h-[350px] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 -right-32 w-[350px] h-[350px] bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />

        {/* Soft grid */}
        <div className="absolute inset-0 bg-grid-pattern opacity-60 pointer-events-none" />

        {/* Particle Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full opacity-70 pointer-events-none"
        />

        {/* Bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#F8FAFC] dark:from-[#090A0F] to-transparent pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Futuristic Status Pill & Onboarding Trigger */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center gap-3 sm:gap-4 px-5 py-2 rounded-full border border-indigo-500/30 dark:border-indigo-400/30 bg-indigo-50/80 dark:bg-indigo-950/40 shadow-xs backdrop-blur-md max-w-full">
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 dark:bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-600 dark:bg-cyan-400" />
            </span>
            <span className="text-xs sm:text-xs font-semibold tracking-wider text-indigo-700 dark:text-indigo-300 uppercase">
              NEUBYTRIXID ECOSYSTEM
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500">•</span>
            <span className="text-xs text-slate-600 dark:text-slate-300 font-medium whitespace-nowrap">
              2026 Next-Gen Platform
            </span>
          </div>

          {onStartOnboarding && (
            <button
              id="hero-onboarding-pill"
              type="button"
              onClick={onStartOnboarding}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 text-purple-700 dark:text-purple-300 text-xs font-semibold shadow-xs transition-all cursor-pointer hover:scale-105"
            >
              <span>🎓 1. Onboarding: “Kenalan dulu dengan cara belajarmu.”</span>
              <ArrowRight className="w-3.5 h-3.5 text-purple-500" />
            </button>
          )}
        </div>

        {/* Main Headline */}
        <h1
          id="hero-title"
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1] mb-6 max-w-4xl mx-auto"
          style={{ fontFamily: "'Space Grotesk', 'Plus Jakarta Sans', sans-serif" }}
        >
          Technology Built for
          <span className="block mt-2 sm:mt-3 gradient-text-brand">
            Intelligence
          </span>
        </h1>

        {/* Supporting Paragraph */}
        <p
          id="hero-subtitle"
          className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal mb-10"
        >
          NeubytrixID creates modern digital experiences, intelligent technology,
          and innovative solutions designed for the future.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md sm:max-w-lg mx-auto mb-14 w-full">
          <button
            id="hero-explore-btn"
            type="button"
            onClick={onExploreClick}
            className="w-full sm:w-auto min-w-[200px] py-3.5 px-8 rounded-2xl font-semibold text-sm text-white bg-indigo-600 hover:bg-indigo-700 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-400 flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>Explore NeubytrixID</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </button>

          <button
            id="hero-get-started-btn"
            type="button"
            onClick={onGetStartedClick}
            className="w-full sm:w-auto min-w-[160px] py-3.5 px-8 rounded-2xl font-semibold text-sm text-slate-800 dark:text-slate-100 bg-white hover:bg-slate-100 dark:bg-white/[0.06] dark:hover:bg-white/[0.1] border border-slate-300 dark:border-white/15 transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-slate-400 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Get Started</span>
          </button>
        </div>

        {/* Minimalist Micro Badges / Tech Proof */}
        <div className="grid grid-cols-3 gap-3 sm:gap-6 max-w-xl mx-auto pt-6 border-t border-slate-200 dark:border-white/10">
          <div className="flex flex-col items-center justify-center p-2 text-center">
            <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
              <Zap className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Sub-ms Speed</span>
            </div>
            <span className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Edge execution
            </span>
          </div>

          <div className="flex flex-col items-center justify-center p-2 text-center border-x border-slate-200 dark:border-white/10">
            <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
              <Cpu className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              <span>Neural Primitives</span>
            </div>
            <span className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Autonomous agents
            </span>
          </div>

          <div className="flex flex-col items-center justify-center p-2 text-center">
            <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
              <Shield className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span>Zero-Trust</span>
            </div>
            <span className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Cryptographic safety
            </span>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="mt-14 flex flex-col items-center justify-center">
          <button
            type="button"
            onClick={onExploreClick}
            aria-label="Scroll to explore ecosystem"
            className="group flex flex-col items-center text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors duration-200 cursor-pointer"
          >
            <span className="text-[11px] uppercase tracking-widest font-mono mb-2">Scroll</span>
            <div className="w-5 h-8 rounded-full border border-slate-400 dark:border-slate-600 flex items-start justify-center p-1">
              <div className="w-1.5 h-2 rounded-full bg-indigo-500 dark:bg-indigo-400 animate-bounce" />
            </div>
          </button>
        </div>
      </div>
    </section>
  );
};
