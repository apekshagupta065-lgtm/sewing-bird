import React, { useState, useMemo } from 'react';
import { useCatalogue } from '../../context/CatalogueContext';
import { ProductCard } from '../common/ProductCard';
import { 
  Filter, 
  X, 
  Search, 
  ArrowUpDown, 
  Grid2X2, 
  Grid3X3, 
  LayoutGrid, 
  RotateCcw,
  SlidersHorizontal,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { CATEGORIES_LIST, SIZES_LIST, COLOUR_PALETTE_LIST } from '../../data/initialData';

export const CataloguePage: React.FC = () => {
  const { products, filters, setFilters, resetFilters, brandSettings } = useCatalogue();

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [columns, setColumns] = useState<2 | 3 | 4>(3);
  const [page, setPage] = useState(1);
  const itemsPerPage = 12;

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // 1. Search Query
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase().trim();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesSku = product.sku.toLowerCase().includes(query);
        const matchesDesc = product.description.toLowerCase().includes(query);
        const matchesCategory = product.category.toLowerCase().includes(query);
        const matchesTags = product.tags.some(t => t.toLowerCase().includes(query));
        if (!matchesName && !matchesSku && !matchesDesc && !matchesCategory && !matchesTags) {
          return false;
        }
      }

      // 2. Category
      if (filters.category && filters.category !== 'All Outfits') {
        if (product.category !== filters.category) return false;
      }

      // 3. Sizes
      if (filters.sizes.length > 0) {
        const hasSize = filters.sizes.some(size => product.availableSizes.includes(size));
        if (!hasSize) return false;
      }

      // 4. Colours
      if (filters.colours.length > 0) {
        const hasColour = filters.colours.some(cName => 
          product.availableColours.some(pc => pc.name.toLowerCase() === cName.toLowerCase())
        );
        if (!hasColour) return false;
      }

      // 5. Availability
      if (filters.availability === 'in_stock') {
        if (product.availabilityStatus !== 'in_stock') return false;
      }

      // 6. Price range (only apply if product has price)
      if (product.price !== undefined) {
        if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (filters.sortBy === 'price-low') {
        return (a.price || 0) - (b.price || 0);
      }
      if (filters.sortBy === 'price-high') {
        return (b.price || 0) - (a.price || 0);
      }
      if (filters.sortBy === 'name-asc') {
        return a.name.localeCompare(b.name);
      }
      // 'featured'
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      return 0;
    });
  }, [products, filters]);

  // Paginated subset
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = filteredProducts.slice(0, page * itemsPerPage);

  const activeFilterCount = 
    (filters.category !== 'All Outfits' ? 1 : 0) +
    filters.sizes.length +
    filters.colours.length +
    (filters.availability !== 'all' ? 1 : 0) +
    (filters.searchQuery ? 1 : 0);

  const toggleSize = (size: string) => {
    setPage(1);
    setFilters(prev => {
      const exists = prev.sizes.includes(size);
      return {
        ...prev,
        sizes: exists ? prev.sizes.filter(s => s !== size) : [...prev.sizes, size]
      };
    });
  };

  const toggleColour = (cName: string) => {
    setPage(1);
    setFilters(prev => {
      const exists = prev.colours.includes(cName);
      return {
        ...prev,
        colours: exists ? prev.colours.filter(c => c !== cName) : [...prev.colours, cName]
      };
    });
  };

  const filterSidebarContent = (
    <div className="space-y-6 text-xs">
      
      {/* Category List */}
      <div>
        <h4 className="font-semibold text-[#20242B] uppercase tracking-wider mb-3 text-[11px]">
          Outfit Category
        </h4>
        <div className="space-y-1.5">
          {CATEGORIES_LIST.map((cat) => {
            const isSelected = filters.category === cat;
            const count = cat === 'All Outfits' 
              ? products.length 
              : products.filter(p => p.category === cat).length;

            return (
              <button
                key={cat}
                onClick={() => {
                  setPage(1);
                  setFilters(prev => ({ ...prev, category: cat }));
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-colors text-left ${
                  isSelected 
                    ? 'bg-[#2D3139] text-white font-semibold' 
                    : 'text-[#4A525F] hover:bg-[#F2EAE0]'
                }`}
              >
                <span>{cat}</span>
                <span className={`text-[10px] ${isSelected ? 'text-white/70' : 'text-[#8C95A2]'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Size Filter */}
      <div className="pt-4 border-t border-[#EAE1D3]">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-[#20242B] uppercase tracking-wider text-[11px]">
            Size
          </h4>
          {filters.sizes.length > 0 && (
            <button
              onClick={() => setFilters(prev => ({ ...prev, sizes: [] }))}
              className="text-[10px] text-[#D96B43] hover:underline"
            >
              Clear
            </button>
          )}
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {SIZES_LIST.map((size) => {
            const isSelected = filters.sizes.includes(size);
            return (
              <button
                key={size}
                onClick={() => toggleSize(size)}
                className={`py-1.5 px-2 text-center rounded-lg border font-medium transition-all ${
                  isSelected
                    ? 'bg-[#2D3139] text-white border-[#2D3139] shadow-2xs'
                    : 'bg-white text-[#4A525F] border-[#DFD6C8] hover:border-[#2D3139]'
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* Colour Filter */}
      <div className="pt-4 border-t border-[#EAE1D3]">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-[#20242B] uppercase tracking-wider text-[11px]">
            Colour Palette
          </h4>
          {filters.colours.length > 0 && (
            <button
              onClick={() => setFilters(prev => ({ ...prev, colours: [] }))}
              className="text-[10px] text-[#D96B43] hover:underline"
            >
              Clear
            </button>
          )}
        </div>
        <div className="space-y-1.5">
          {COLOUR_PALETTE_LIST.map((col) => {
            const isSelected = filters.colours.includes(col.name);
            return (
              <button
                key={col.name}
                onClick={() => toggleColour(col.name)}
                className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg border text-left transition-all ${
                  isSelected
                    ? 'bg-[#F2ECE0] border-[#2D3139] font-semibold text-[#2D3139]'
                    : 'bg-white border-transparent hover:bg-[#F2ECE0]/60 text-[#555D6A]'
                }`}
              >
                <span 
                  className="w-3.5 h-3.5 rounded-full border border-black/20 shadow-2xs" 
                  style={{ backgroundColor: col.hex }} 
                />
                <span className="flex-1">{col.name}</span>
                {isSelected && <span className="text-[10px] text-[#D96B43]">✓</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Availability Toggle */}
      <div className="pt-4 border-t border-[#EAE1D3]">
        <h4 className="font-semibold text-[#20242B] uppercase tracking-wider mb-2.5 text-[11px]">
          Availability
        </h4>
        <label className="flex items-center gap-2 cursor-pointer text-[#4A525F] hover:text-[#2D3139]">
          <input
            type="checkbox"
            checked={filters.availability === 'in_stock'}
            onChange={(e) => {
              setPage(1);
              setFilters(prev => ({
                ...prev,
                availability: e.target.checked ? 'in_stock' : 'all'
              }));
            }}
            className="rounded text-[#2D3139] focus:ring-[#D96B43] w-4 h-4"
          />
          <span>In Stock Only</span>
        </label>
      </div>

      {/* Reset All Filters button */}
      {activeFilterCount > 0 && (
        <div className="pt-4 border-t border-[#EAE1D3]">
          <button
            onClick={() => {
              resetFilters();
              setPage(1);
            }}
            className="w-full py-2 px-3 bg-[#FAF7F2] hover:bg-[#F0E6D8] text-[#2D3139] rounded-xl border border-[#DCD2C3] font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <RotateCcw size={13} />
            <span>Reset All Filters ({activeFilterCount})</span>
          </button>
        </div>
      )}

    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb & Title */}
        <div className="mb-8">
          <div className="text-xs text-[#7A8390] mb-1">
            <span>Home</span> / <span className="text-[#2D3139] font-medium">Catalogue</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#20242B]">
                {filters.category === 'All Outfits' ? "All Children's Outfits" : filters.category}
              </h1>
              <p className="text-xs text-[#636C79] mt-1">
                Showing {filteredProducts.length} handcrafted outfits in our collection
              </p>
            </div>

            {/* Live Search input in catalogue bar */}
            <div className="relative max-w-xs w-full">
              <Search size={15} className="absolute left-3 top-3 text-[#8A93A0]" />
              <input
                type="text"
                value={filters.searchQuery}
                onChange={(e) => {
                  setPage(1);
                  setFilters(prev => ({ ...prev, searchQuery: e.target.value }));
                }}
                placeholder="Search outfits, SKU, tag..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#DDD3C2] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#D96B43]"
              />
              {filters.searchQuery && (
                <button
                  onClick={() => setFilters(prev => ({ ...prev, searchQuery: '' }))}
                  className="absolute right-2.5 top-2.5 text-[#8A93A0] hover:text-[#2D3139]"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Top Control Bar: Mobile Filter Trigger, Sort, View Density */}
        <div className="p-4 bg-white rounded-2xl border border-[#EAE1D3] shadow-xs mb-8 flex flex-wrap items-center justify-between gap-4">
          
          {/* Mobile Filter Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden px-3.5 py-2 bg-[#FAF7F2] hover:bg-[#F2ECE0] border border-[#DDD3C2] text-[#2D3139] text-xs font-semibold rounded-xl flex items-center gap-2 transition-colors"
            >
              <Filter size={14} />
              <span>Filters {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}</span>
            </button>

            {/* Active filter summary chips on desktop */}
            <div className="hidden lg:flex items-center gap-1.5 flex-wrap text-xs">
              <span className="text-[#848E9D] text-[11px]">Filters:</span>
              {filters.category !== 'All Outfits' && (
                <span className="px-2.5 py-1 bg-[#F2ECE0] text-[#2D3139] rounded-lg text-[11px] font-medium flex items-center gap-1">
                  {filters.category}
                  <button onClick={() => setFilters(p => ({ ...p, category: 'All Outfits' }))}><X size={11} /></button>
                </span>
              )}
              {filters.sizes.map(s => (
                <span key={s} className="px-2 py-0.5 bg-[#F2ECE0] text-[#2D3139] rounded-lg text-[11px] font-medium flex items-center gap-1">
                  {s}
                  <button onClick={() => toggleSize(s)}><X size={11} /></button>
                </span>
              ))}
              {filters.colours.map(c => (
                <span key={c} className="px-2 py-0.5 bg-[#F2ECE0] text-[#2D3139] rounded-lg text-[11px] font-medium flex items-center gap-1">
                  {c}
                  <button onClick={() => toggleColour(c)}><X size={11} /></button>
                </span>
              ))}
              {activeFilterCount > 0 && (
                <button
                  onClick={resetFilters}
                  className="text-[11px] text-[#D96B43] hover:underline ml-1 font-semibold"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>

          {/* Right: Sort and Density Toggles */}
          <div className="flex items-center gap-3 ml-auto">
            
            {/* Sort selector */}
            <div className="flex items-center gap-1.5 text-xs text-[#525964]">
              <span className="hidden sm:inline text-[#848E9D]">Sort by:</span>
              <div className="relative">
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
                  className="appearance-none pl-3 pr-7 py-1.5 bg-[#FAF7F2] border border-[#DDD3C2] rounded-xl text-xs font-semibold text-[#2D3139] focus:outline-hidden cursor-pointer"
                >
                  <option value="featured">Featured Outfits</option>
                  <option value="newest">Newest Arrivals</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name-asc">Name: A to Z</option>
                </select>
                <ChevronDown size={13} className="absolute right-2.5 top-2.5 text-[#7F8895] pointer-events-none" />
              </div>
            </div>

            {/* Column density buttons (desktop) */}
            <div className="hidden sm:flex items-center p-1 bg-[#FAF7F2] border border-[#DDD3C2] rounded-xl gap-1">
              <button
                onClick={() => setColumns(2)}
                className={`p-1.5 rounded-lg transition-colors ${columns === 2 ? 'bg-white shadow-2xs text-[#2D3139]' : 'text-[#848E9D] hover:text-[#2D3139]'}`}
                title="2 Columns"
              >
                <Grid2X2 size={15} />
              </button>
              <button
                onClick={() => setColumns(3)}
                className={`p-1.5 rounded-lg transition-colors ${columns === 3 ? 'bg-white shadow-2xs text-[#2D3139]' : 'text-[#848E9D] hover:text-[#2D3139]'}`}
                title="3 Columns"
              >
                <Grid3X3 size={15} />
              </button>
              <button
                onClick={() => setColumns(4)}
                className={`p-1.5 rounded-lg transition-colors ${columns === 4 ? 'bg-white shadow-2xs text-[#2D3139]' : 'text-[#848E9D] hover:text-[#2D3139]'}`}
                title="4 Columns"
              >
                <LayoutGrid size={15} />
              </button>
            </div>

          </div>

        </div>

        {/* Main Content Layout: Sidebar + Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="p-6 bg-white rounded-2xl border border-[#EAE1D3] shadow-xs sticky top-28">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#EAE1D3]">
                <h3 className="font-serif font-bold text-base text-[#20242B] flex items-center gap-2">
                  <SlidersHorizontal size={16} className="text-[#D96B43]" />
                  <span>Refine Collection</span>
                </h3>
                {activeFilterCount > 0 && (
                  <span className="text-[10px] bg-[#D96B43] text-white px-2 py-0.5 rounded-full font-bold">
                    {activeFilterCount}
                  </span>
                )}
              </div>
              {filterSidebarContent}
            </div>
          </div>

          {/* Product Grid Area */}
          <div className="lg:col-span-3">
            {filteredProducts.length === 0 ? (
              <div className="p-16 text-center bg-white rounded-3xl border border-[#EAE1D3] shadow-xs">
                <Sparkles size={36} className="mx-auto text-[#D96B43]/50 mb-3" />
                <h3 className="font-serif text-2xl font-bold text-[#20242B]">
                  No outfits match your filters
                </h3>
                <p className="text-xs text-[#636C79] mt-2 max-w-sm mx-auto">
                  Try clearing some filters or searching for another keyword to explore our children's collection.
                </p>
                <button
                  onClick={resetFilters}
                  className="mt-6 px-6 py-2.5 bg-[#2D3139] hover:bg-[#D96B43] text-white text-xs font-semibold rounded-xl transition-colors shadow-xs"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <>
                <div 
                  className={`grid gap-6 ${
                    columns === 2 
                      ? 'grid-cols-1 sm:grid-cols-2' 
                      : columns === 3 
                      ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' 
                      : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4'
                  }`}
                >
                  {paginatedProducts.map((product, idx) => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      priority={idx < 6}
                    />
                  ))}
                </div>

                {/* Load More Button if more pages exist */}
                {paginatedProducts.length < filteredProducts.length && (
                  <div className="mt-12 text-center">
                    <p className="text-xs text-[#7F8895] mb-3">
                      Showing {paginatedProducts.length} of {filteredProducts.length} outfits
                    </p>
                    <button
                      onClick={() => setPage(prev => prev + 1)}
                      className="px-8 py-3 bg-white hover:bg-[#FAF7F2] border border-[#DDD3C2] text-[#2D3139] hover:border-[#2D3139] text-xs font-semibold rounded-xl shadow-xs transition-colors"
                    >
                      Load More Outfits
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

        </div>

      </div>

      {/* Mobile Filter Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            onClick={() => setMobileFilterOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs" 
          />
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-[#FAF7F2] shadow-2xl p-6 flex flex-col justify-between z-10 overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#EAE1D3] mb-6">
                <h3 className="font-serif font-bold text-lg text-[#20242B]">
                  Filter Outfits
                </h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 text-[#6A7280] hover:text-[#20242B]"
                >
                  <X size={20} />
                </button>
              </div>
              {filterSidebarContent}
            </div>

            <div className="pt-6 border-t border-[#EAE1D3] mt-6">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-3 bg-[#2D3139] text-white text-xs font-semibold rounded-xl shadow-xs"
              >
                Apply Filters ({filteredProducts.length} Results)
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
