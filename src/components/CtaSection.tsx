import React from 'react';
import { ArrowRight, Sparkles, MessageSquare } from 'lucide-react';

interface CtaSectionProps {
  onStartProject: () => void;
  onContactUs: () => void;
}

export const CtaSection: React.FC<CtaSectionProps> = ({
  onStartProject,
  onContactUs,
}) => {
  return (
    <section id="contact" className="relative py-28 sm:py-36 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-t from-indigo-600/15 via-purple-600/10 to-transparent blur-[140px] rounded-full" />
        <div className="absolute inset-0 bg-grid-pattern opacity-40" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl p-8 sm:p-14 md:p-16 border border-slate-200 dark:border-white/15 bg-white dark:bg-gradient-to-b dark:from-white/[0.04] dark:via-white/[0.02] dark:to-transparent shadow-2xl backdrop-blur-2xl text-center overflow-hidden">
          {/* Subtle top accent beam */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/80 to-transparent" />

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-mono uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Initiate Collaboration</span>
          </div>

          {/* Headline */}
          <h2
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-white mb-6 leading-tight"
            style={{ fontFamily: "'Space Grotesk', 'Plus Jakarta Sans', sans-serif" }}
          >
            Ready to Build What's Next?
          </h2>

          {/* Description */}
          <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed mb-10 font-normal">
            Let's turn ambitious ideas into meaningful digital experiences.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <button
              id="cta-start-project-btn"
              type="button"
              onClick={onStartProject}
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-semibold text-sm text-white bg-indigo-600 hover:bg-indigo-700 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-xl shadow-indigo-600/25 hover:shadow-indigo-600/40 hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Start a Project</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </button>

            <button
              id="cta-contact-us-btn"
              type="button"
              onClick={onContactUs}
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-medium text-sm text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-300 dark:border-white/10 transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-slate-400 flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Contact Us</span>
            </button>
          </div>

          {/* Direct channels prompt */}
          <div className="mt-12 pt-8 border-t border-slate-200 dark:border-white/10 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Direct inquiries: </span>
              <a
                href="mailto:contact@neubytrix.id"
                className="text-indigo-600 dark:text-indigo-400 hover:underline font-mono"
              >
                contact@neubytrix.id
              </a>
            </div>
            <span className="hidden sm:inline text-slate-400 dark:text-slate-500">•</span>
            <div>Guaranteed response within 24 business hours</div>
          </div>
        </div>
      </div>
    </section>
  );
};
