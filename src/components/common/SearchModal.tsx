import React, { useState, useEffect, useRef } from 'react';
import { useCatalogue } from '../../context/CatalogueContext';
import { Search, X, ArrowRight, Tag, Sparkles } from 'lucide-react';
import { CATEGORIES_LIST } from '../../data/initialData';

export const SearchModal: React.FC = () => {
  const { activeModal, closeModal, products, navigateTo, brandSettings } = useCatalogue();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (activeModal?.type === 'search') {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [activeModal]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeModal]);

  if (!activeModal || activeModal.type !== 'search') return null;

  const filtered = products.filter(p => {
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch = !term || 
      p.name.toLowerCase().includes(term) ||
      p.sku.toLowerCase().includes(term) ||
      p.category.toLowerCase().includes(term) ||
      p.description.toLowerCase().includes(term) ||
      p.tags.some(t => t.toLowerCase().includes(term));

    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleSelectProduct = (slugOrId: string) => {
    closeModal();
    navigateTo('product-detail', slugOrId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 overflow-y-auto">
      {/* Backdrop */}
      <div 
        onClick={closeModal}
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity" 
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 border border-[#E8DFC9] animate-in fade-in slide-in-from-top-4 duration-200">
        
        {/* Search Header */}
        <div className="p-4 sm:p-5 border-b border-[#EAE2D4] bg-[#FAF7F2] flex items-center gap-3">
          <Search size={22} className="text-[#D96B43] flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by outfit name, fabric, category (e.g. smocked dress, romper, waffle)..."
            className="w-full bg-transparent text-sm sm:text-base text-[#2D3139] placeholder-[#9098A5] focus:outline-hidden"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="p-1 text-[#868E9B] hover:text-[#2D3139]"
              aria-label="Clear search"
            >
              <X size={18} />
            </button>
          )}
          <button
            onClick={closeModal}
            className="p-1 text-[#868E9B] hover:text-[#2D3139] rounded-lg ml-1"
            aria-label="Close modal"
          >
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white border border-[#D5CDC0] rounded-sm text-[#78818E]">ESC</kbd>
          </button>
        </div>

        {/* Category Shortcuts */}
        <div className="px-5 py-2.5 bg-white border-b border-[#F0E8DC] flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-[#8992A0] text-[11px] font-medium flex-shrink-0">Filter:</span>
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors flex-shrink-0 ${
              selectedCategory === 'All'
                ? 'bg-[#2D3139] text-white'
                : 'bg-[#FAF7F2] text-[#555C66] hover:bg-[#F0E9DC]'
            }`}
          >
            All Categories
          </button>
          {CATEGORIES_LIST.filter(c => c !== 'All Outfits').map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors flex-shrink-0 ${
                selectedCategory === cat
                  ? 'bg-[#2D3139] text-white'
                  : 'bg-[#FAF7F2] text-[#555C66] hover:bg-[#F0E9DC]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#7F8895] px-2 mb-2">
            <span>{filtered.length} {filtered.length === 1 ? 'outfit found' : 'outfits found'}</span>
            {searchTerm && <span className="italic">Results for "{searchTerm}"</span>}
          </div>

          {filtered.length === 0 ? (
            <div className="py-12 text-center text-[#7F8895]">
              <Sparkles size={32} className="mx-auto mb-2 text-[#D96B43]/50" />
              <p className="text-sm font-medium text-[#2D3139]">No matching outfits found</p>
              <p className="text-xs text-[#8B93A0] mt-1 max-w-sm mx-auto">
                Try searching for general keywords like "dress", "linen", "romper", or click "All Categories".
              </p>
            </div>
          ) : (
            filtered.map(prod => (
              <div
                key={prod.id}
                onClick={() => handleSelectProduct(prod.slug || prod.id)}
                className="group flex items-center justify-between p-3 rounded-2xl hover:bg-[#FAF7F2] border border-transparent hover:border-[#E8DFC9] transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <img
                    src={prod.images[0]}
                    alt={prod.name}
                    className="w-14 h-16 rounded-xl object-cover border border-[#E8DFC9] flex-shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2 text-[11px] text-[#7E8794]">
                      <span>{prod.category}</span>
                      <span className="font-mono text-[10px] text-[#A5ADB9]">· {prod.sku}</span>
                    </div>
                    <h4 className="font-serif font-semibold text-sm text-[#20242B] group-hover:text-[#D96B43] transition-colors">
                      {prod.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      {prod.price !== undefined && (
                        <span className="text-xs font-bold text-[#2D3139]">
                          {brandSettings.currencySymbol}{prod.price}
                        </span>
                      )}
                      <span className="text-[11px] text-[#868E9B]">
                        {prod.availableSizes.slice(0, 3).join(', ')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-2 text-[#9FA8B4] group-hover:text-[#D96B43] group-hover:translate-x-1 transition-all">
                  <ArrowRight size={18} />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="px-5 py-3 bg-[#FAF7F2] border-t border-[#EAE2D4] flex items-center justify-between text-[11px] text-[#7F8895]">
          <span>Search catalogue collection</span>
          <button
            onClick={() => {
              closeModal();
              navigateTo('catalogue');
            }}
            className="text-[#D96B43] font-semibold hover:underline"
          >
            Explore All Outfits →
          </button>
        </div>

      </div>
    </div>
  );
};
