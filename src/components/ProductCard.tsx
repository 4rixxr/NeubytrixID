import React from 'react';
import { Cpu, Cloud, Layers, Sparkles, ArrowRight } from 'lucide-react';
import { ProductItem } from '../types';

interface ProductCardProps {
  product: ProductItem;
  onLearnMore: (product: ProductItem) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onLearnMore,
}) => {
  const renderIcon = () => {
    switch (product.iconName) {
      case 'Cpu':
        return <Cpu className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />;
      case 'Cloud':
        return <Cloud className="w-6 h-6 text-blue-500 dark:text-blue-400" />;
      case 'Layers':
        return <Layers className="w-6 h-6 text-purple-500 dark:text-purple-400" />;
      case 'Sparkles':
        return <Sparkles className="w-6 h-6 text-cyan-500 dark:text-cyan-400" />;
      default:
        return <Cpu className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />;
    }
  };

  return (
    <div
      id={`product-card-${product.id}`}
      className="group relative rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.03] hover:bg-slate-50/80 dark:hover:bg-white/[0.06] shadow-xs hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1 overflow-hidden"
    >
      {/* Soft hover glow top corner */}
      <div className="absolute -top-16 -right-16 w-36 h-36 rounded-full bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div>
        {/* Header: Category and Version */}
        <div className="flex items-center justify-between gap-2 mb-6">
          <span className="text-[11px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-md bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-400 border border-slate-200 dark:border-white/5">
            {product.category}
          </span>
          <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
            {product.version}
          </span>
        </div>

        {/* Icon & Title */}
        <div className="flex items-center gap-3.5 mb-4">
          <div className="p-3 rounded-xl bg-indigo-50 dark:bg-white/5 border border-indigo-100 dark:border-white/10 transition-colors duration-200 group-hover:border-indigo-500/30">
            {renderIcon()}
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              {product.name}
            </h3>
            <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
              {product.badge}
            </span>
          </div>
        </div>

        {/* Short Description */}
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
          {product.description}
        </p>

        {/* Spec highlights */}
        <div className="space-y-2 mb-8 pt-4 border-t border-slate-100 dark:border-white/5">
          {product.highlights.slice(0, 3).map((item, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500/70 mt-1.5 shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action footer */}
      <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
        <span className="text-xs font-mono text-slate-500">
          {product.specs[0]?.label}: {product.specs[0]?.value}
        </span>
        <button
          id={`learn-more-${product.id}`}
          type="button"
          onClick={() => onLearnMore(product)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors duration-200 focus:outline-none focus:underline cursor-pointer"
        >
          <span>Learn More</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
};
