import React from 'react';
import { Globe, Layout, Code2, Bot, Fingerprint, Compass, Check, ArrowRight } from 'lucide-react';
import { ServiceItem } from '../types';

interface ServiceCardProps {
  service: ServiceItem;
  onSelectService: (service: ServiceItem) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  onSelectService,
}) => {
  const renderIcon = () => {
    switch (service.iconName) {
      case 'Globe':
        return <Globe className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />;
      case 'Layout':
        return <Layout className="w-5 h-5 text-purple-500 dark:text-purple-400" />;
      case 'Code2':
        return <Code2 className="w-5 h-5 text-blue-500 dark:text-blue-400" />;
      case 'Bot':
        return <Bot className="w-5 h-5 text-cyan-500 dark:text-cyan-400" />;
      case 'Fingerprint':
        return <Fingerprint className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />;
      case 'Compass':
        return <Compass className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />;
      default:
        return <Code2 className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />;
    }
  };

  return (
    <div
      id={`service-card-${service.id}`}
      className="group relative rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.02] hover:bg-slate-50/80 dark:hover:bg-white/[0.05] hover:border-indigo-500/40 dark:hover:border-indigo-500/30 shadow-xs hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1"
    >
      <div>
        {/* Top bar with icon & category */}
        <div className="flex items-center justify-between gap-3 mb-5">
          <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-white/5 border border-indigo-100 dark:border-white/10 group-hover:border-indigo-500/40 transition-colors duration-200">
            {renderIcon()}
          </div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {service.category}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors duration-200">
          {service.title}
        </h3>

        {/* Short description */}
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-5">
          {service.description}
        </p>

        {/* Key deliverables */}
        <div className="space-y-1.5 mb-6 pt-3 border-t border-slate-100 dark:border-white/5">
          {service.deliverables.slice(0, 3).map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
              <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <span className="truncate">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Card Footer */}
      <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
        <span className="text-[11px] text-slate-500 font-mono">
          {service.scopeTimeline}
        </span>
        <button
          type="button"
          onClick={() => onSelectService(service)}
          className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors duration-150 focus:outline-none focus:underline cursor-pointer"
        >
          <span>Initiate</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
        </button>
      </div>
    </div>
  );
};
