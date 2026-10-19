import React, { useEffect } from 'react';
import { X, Check, ArrowUpRight, Cpu, Cloud, Layers, Sparkles, Terminal } from 'lucide-react';
import { ProductItem } from '../types';

interface ProductModalProps {
  product: ProductItem | null;
  onClose: () => void;
  onGetStarted: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onGetStarted,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (product) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [product, onClose]);

  if (!product) return null;

  const renderIcon = () => {
    switch (product.iconName) {
      case 'Cpu':
        return <Cpu className="w-8 h-8 text-indigo-400" />;
      case 'Cloud':
        return <Cloud className="w-8 h-8 text-blue-400" />;
      case 'Layers':
        return <Layers className="w-8 h-8 text-purple-400" />;
      case 'Sparkles':
        return <Sparkles className="w-8 h-8 text-cyan-400" />;
      default:
        return <Cpu className="w-8 h-8 text-indigo-400" />;
    }
  };

  return (
    <div
      id="product-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/75 backdrop-blur-md animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-2xl rounded-3xl bg-white dark:bg-[#0F121C] border border-slate-200 dark:border-white/10 shadow-2xl p-6 sm:p-8 my-8 text-slate-900 dark:text-slate-100 transition-all duration-300">
        {/* Close Button */}
        <button
          id="close-product-modal-btn"
          type="button"
          onClick={onClose}
          aria-label="Close product details"
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Product Header */}
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20">
            {renderIcon()}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300">
                {product.category}
              </span>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                {product.version}
              </span>
            </div>
            <h2
              id="product-modal-title"
              className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white"
            >
              {product.name}
            </h2>
          </div>
        </div>

        {/* Tagline & Overview */}
        <p className="text-base text-indigo-600 dark:text-indigo-300 font-medium mb-4">
          “{product.description}”
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
          {product.overview}
        </p>

        {/* Specs Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 mb-6">
          {product.specs.map((spec, i) => (
            <div key={i} className="text-left">
              <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase">
                {spec.label}
              </div>
              <div className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white mt-0.5">
                {spec.value}
              </div>
            </div>
          ))}
        </div>

        {/* Core Capabilities */}
        <div className="mb-6">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Architecture & Capabilities</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {product.capabilities.map((cap, i) => (
              <div
                key={i}
                className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 text-xs text-slate-700 dark:text-slate-300"
              >
                <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>{cap}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-5 border-t border-slate-200 dark:border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors duration-150 cursor-pointer"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onGetStarted();
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/20 transition-all duration-150 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Request Integration</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
