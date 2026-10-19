import React, { useEffect } from 'react';
import { X, BookOpen, HelpCircle, LifeBuoy, CheckCircle2, ArrowUpRight } from 'lucide-react';

interface ResourceModalProps {
  type: 'docs' | 'support' | 'faq' | null;
  onClose: () => void;
  onContactUs: () => void;
}

export const ResourceModal: React.FC<ResourceModalProps> = ({
  type,
  onClose,
  onContactUs,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (type) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [type, onClose]);

  if (!type) return null;

  const content = {
    docs: {
      title: 'NeubytrixID Documentation',
      subtitle: 'Technical developer guides, SDK reference, and architecture papers.',
      icon: BookOpen,
      sections: [
        {
          title: 'Quickstart SDK (TypeScript / React)',
          desc: 'Install the unified client library: npm install @neubytrix/sdk. Configure your edge endpoint and initialize telemetry in two lines of code.',
        },
        {
          title: 'Distributed State Synchronization',
          desc: 'Read the spec on conflict-free replicated data types (CRDTs) and sub-millisecond state convergence over global edge nodes.',
        },
        {
          title: 'Zero-Trust Enclave Authentication',
          desc: 'End-to-end cryptographic payload signing, ephemeral rotating session tokens, and hardware enclave isolation rules.',
        },
      ],
    },
    support: {
      title: 'NeubytrixID Support & SLAs',
      subtitle: '24/7 technical assistance and enterprise incident response.',
      icon: LifeBuoy,
      sections: [
        {
          title: 'Mission-Critical SLA (99.999%)',
          desc: 'Enterprise partners receive dedicated Slack/Discord war rooms, priority ticket routing, and guaranteed 15-minute response times.',
        },
        {
          title: 'Direct Engineering Desk',
          desc: 'Reach our core systems team directly via support@neubytrix.id for code reviews, architecture consultations, or incident escalation.',
        },
        {
          title: 'System Status & Incident Logs',
          desc: 'Track uptime, latency heatmaps, and scheduled maintenance windows across all 380+ global edge locations in real-time.',
        },
      ],
    },
    faq: {
      title: 'Frequently Asked Questions',
      subtitle: 'Answers regarding our technology stack, ecosystem, and partnership models.',
      icon: HelpCircle,
      sections: [
        {
          title: 'What differentiates NeubytrixID from conventional cloud providers?',
          desc: 'NeubytrixID merges autonomous neural pipelines, zero-overhead edge runtimes, and cohesive design systems into a unified platform built specifically for modern 2026 standards.',
        },
        {
          title: 'Can we integrate NeubytrixID services into existing infrastructure?',
          desc: 'Yes. Every component from Neubytrix AI to our Cloud mesh operates with open REST/gRPC endpoints and drop-in TypeScript bindings that sit smoothly atop your existing stack.',
        },
        {
          title: 'How do project engagements work?',
          desc: 'We offer flexible sprints ranging from targeted advisory audits to turnkey full-stack product deliveries with dedicated technical leads and post-launch maintenance.',
        },
      ],
    },
  }[type];

  const IconComponent = content.icon;

  return (
    <div
      id="resource-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="resource-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-2xl rounded-3xl bg-white dark:bg-[#0E111C] border border-slate-200 dark:border-white/10 shadow-2xl p-6 sm:p-8 my-8 text-slate-900 dark:text-slate-100 transition-all duration-300">
        {/* Close button */}
        <button
          id="close-resource-modal-btn"
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5 mb-4">
          <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400">
            <IconComponent className="w-6 h-6" />
          </div>
          <div>
            <h2
              id="resource-modal-title"
              className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white"
            >
              {content.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
              {content.subtitle}
            </p>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-4 my-6">
          {content.sections.map((sec, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5"
            >
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span>{sec.title}</span>
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pl-6">
                {sec.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
          >
            Dismiss
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onContactUs();
            }}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <span>Talk to Team</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
