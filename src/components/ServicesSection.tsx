import React from 'react';
import { ServiceCard } from './ServiceCard';
import { SERVICES_DATA } from '../data/siteData';
import { ServiceItem } from '../types';
import { Briefcase } from 'lucide-react';

interface ServicesSectionProps {
  onSelectService: (service: ServiceItem) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectService }) => {
  return (
    <section id="services" className="relative py-24 sm:py-32 border-t border-slate-200 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-mono uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-4">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Core Capabilities</span>
          </div>

          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-5"
            style={{ fontFamily: "'Space Grotesk', 'Plus Jakarta Sans', sans-serif" }}
          >
            Engineering & Strategic Services
          </h2>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            From frontier AI pipelines to cohesive design systems, we engineer solutions
            that scale reliably and look timeless.
          </p>
        </div>

        {/* 6 Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES_DATA.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onSelectService={onSelectService}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
