import React, { useState } from 'react';
import { ProductCard } from './ProductCard';
import { PRODUCTS_DATA } from '../data/siteData';
import { ProductItem } from '../types';
import { Layers } from 'lucide-react';

interface ProductsSectionProps {
  onLearnMore: (product: ProductItem) => void;
}

export const ProductsSection: React.FC<ProductsSectionProps> = ({ onLearnMore }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'AI Intelligence', 'Cloud Infrastructure', 'Creative Studio', 'Next-Gen Labs'];

  const filteredProducts =
    selectedCategory === 'All'
      ? PRODUCTS_DATA
      : PRODUCTS_DATA.filter((p) => p.category === selectedCategory);

  return (
    <section id="products" className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background soft lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-mono uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-4">
            <Layers className="w-3.5 h-3.5" />
            <span>Platform Infrastructure</span>
          </div>

          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-5"
            style={{ fontFamily: "'Space Grotesk', 'Plus Jakarta Sans', sans-serif" }}
          >
            Explore Our Ecosystem
          </h2>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            Modular software engines, intelligent models, and high-velocity cloud systems
            built to work together harmoniously.
          </p>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-xs shadow-indigo-600/30'
                    : 'bg-white dark:bg-white/5 text-slate-700 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white border border-slate-200 dark:border-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onLearnMore={onLearnMore}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
