import React from 'react';
import { useCatalogue } from '../../context/CatalogueContext';
import { ArrowRight, Sparkles } from 'lucide-react';

export const CategoryGrid: React.FC = () => {
  const { products, setFilters, navigateTo } = useCatalogue();

  const categories = [
    {
      title: 'Dresses',
      subtitle: 'Heirloom smocked frocks & prairie twirls',
      image: 'https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?auto=format&fit=crop&w=800&q=80',
      category: 'Dresses'
    },
    {
      title: 'Co-ord Sets',
      subtitle: 'Matching bloomers, blouses & ruffle duos',
      image: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=800&q=80',
      category: 'Co-ord Sets'
    },
    {
      title: 'Rompers & Onesies',
      subtitle: 'Kimono wraps, bubble rompers & waffle knits',
      image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=80',
      category: 'Rompers & Onesies'
    },
    {
      title: 'Everyday Wear',
      subtitle: 'Soft corduroy overalls, henleys & dungarees',
      image: 'https://images.unsplash.com/photo-1543332164-6e82f355badc?auto=format&fit=crop&w=800&q=80',
      category: 'Everyday Wear'
    },
    {
      title: 'Tops & Bottoms',
      subtitle: 'Peter Pan lace blouses & culottes',
      image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=800&q=80',
      category: 'Tops & Bottoms'
    },
    {
      title: 'Sleepwear & Sets',
      subtitle: 'Starlight organic snuggle pyjamas',
      image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80',
      category: 'Sleepwear'
    }
  ];

  const handleCategorySelect = (categoryName: string) => {
    setFilters(prev => ({ ...prev, category: categoryName }));
    navigateTo('catalogue');
  };

  return (
    <section className="py-16 sm:py-20 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#D96B43] tracking-widest uppercase mb-1">
              <Sparkles size={13} />
              <span>Thoughtful Wardrobe Essentials</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#20242B]">
              Shop by Category
            </h2>
          </div>
          <button
            onClick={() => {
              setFilters(prev => ({ ...prev, category: 'All Outfits' }));
              navigateTo('catalogue');
            }}
            className="mt-4 md:mt-0 text-xs font-semibold text-[#2D3139] hover:text-[#D96B43] flex items-center gap-1.5 transition-colors group"
          >
            <span>View all pieces</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {categories.map((cat) => {
            const count = products.filter(p => p.category === cat.category).length;
            return (
              <div
                key={cat.title}
                onClick={() => handleCategorySelect(cat.category)}
                className="group relative h-96 rounded-3xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500 border border-[#EBE3D7]"
              >
                {/* Background Image */}
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
                />

                {/* Subtle vignette overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent transition-opacity group-hover:from-black/85" />

                {/* Card Content */}
                <div className="absolute inset-0 p-6 flex flex-col justify-between text-white">
                  {/* Top Badge: Item count */}
                  <div className="flex justify-end">
                    <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-semibold tracking-wide border border-white/20">
                      {count} {count === 1 ? 'Outfit' : 'Outfits'}
                    </span>
                  </div>

                  {/* Bottom Information */}
                  <div className="space-y-1 transform group-hover:-translate-y-1 transition-transform duration-300">
                    <h3 className="font-serif text-2xl font-bold tracking-tight">
                      {cat.title}
                    </h3>
                    <p className="text-xs text-white/80 line-clamp-1">
                      {cat.subtitle}
                    </p>
                    <div className="pt-3 flex items-center gap-2 text-xs font-semibold text-[#FCD8CD] group-hover:text-white transition-colors">
                      <span>Explore outfits</span>
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
