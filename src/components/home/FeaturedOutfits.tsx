import React, { useState } from 'react';
import { useCatalogue } from '../../context/CatalogueContext';
import { ProductCard } from '../common/ProductCard';
import { Sparkles, ArrowRight } from 'lucide-react';

export const FeaturedOutfits: React.FC = () => {
  const { products, navigateTo, setFilters } = useCatalogue();
  const [activeTab, setActiveTab] = useState<'featured' | 'new' | 'bestsellers' | 'dresses'>('featured');

  let displayed = products;
  if (activeTab === 'featured') {
    displayed = products.filter(p => p.isFeatured);
  } else if (activeTab === 'new') {
    displayed = products.filter(p => p.isNewArrival);
  } else if (activeTab === 'bestsellers') {
    displayed = products.filter(p => p.isBestSeller);
  } else if (activeTab === 'dresses') {
    displayed = products.filter(p => p.category === 'Dresses');
  }

  // Fallback if filter is empty
  if (displayed.length === 0) displayed = products.slice(0, 8);

  return (
    <section className="py-16 sm:py-24 bg-[#FAF7F2] border-t border-[#EFE9DE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#D96B43] tracking-widest uppercase mb-1">
              <Sparkles size={13} />
              <span>Curated Selection</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#20242B]">
              Featured Outfits
            </h2>
          </div>

          {/* Tab Selector Buttons */}
          <div className="mt-6 md:mt-0 flex items-center gap-1.5 p-1 bg-[#F1E9DC] rounded-2xl border border-[#E4DAC9] overflow-x-auto">
            <button
              onClick={() => setActiveTab('featured')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                activeTab === 'featured'
                  ? 'bg-white text-[#2D3139] shadow-xs'
                  : 'text-[#646D7B] hover:text-[#2D3139]'
              }`}
            >
              Curated Picks
            </button>
            <button
              onClick={() => setActiveTab('new')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                activeTab === 'new'
                  ? 'bg-white text-[#2D3139] shadow-xs'
                  : 'text-[#646D7B] hover:text-[#2D3139]'
              }`}
            >
              New Arrivals
            </button>
            <button
              onClick={() => setActiveTab('bestsellers')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                activeTab === 'bestsellers'
                  ? 'bg-white text-[#2D3139] shadow-xs'
                  : 'text-[#646D7B] hover:text-[#2D3139]'
              }`}
            >
              Best Sellers
            </button>
            <button
              onClick={() => setActiveTab('dresses')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                activeTab === 'dresses'
                  ? 'bg-white text-[#2D3139] shadow-xs'
                  : 'text-[#646D7B] hover:text-[#2D3139]'
              }`}
            >
              Dresses
            </button>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {displayed.slice(0, 8).map((product, idx) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              priority={idx < 4}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-14 text-center">
          <button
            onClick={() => {
              setFilters(prev => ({ ...prev, category: 'All Outfits' }));
              navigateTo('catalogue');
            }}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#2D3139] hover:bg-[#D96B43] text-white text-xs font-semibold rounded-2xl shadow-md hover:shadow-lg transition-all"
          >
            <span>Explore Complete Catalogue</span>
            <ArrowRight size={15} />
          </button>
        </div>

      </div>
    </section>
  );
};
