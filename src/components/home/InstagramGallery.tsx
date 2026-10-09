import React from 'react';
import { useCatalogue } from '../../context/CatalogueContext';
import { Instagram, Heart, Eye, Sparkles } from 'lucide-react';

export const InstagramGallery: React.FC = () => {
  const { brandSettings, products, openQuickView, navigateTo } = useCatalogue();

  // Curated editorial childhood moments mapped to products
  const moments = [
    {
      image: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=700&q=80',
      tag: '#TheSewingBirdMoments',
      outfitName: 'Peony Blossom Dress',
      productId: 'cbc-prod-001'
    },
    {
      image: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=700&q=80',
      tag: '#BarefootAdventures',
      outfitName: 'Buttercup Ruffle Set',
      productId: 'cbc-prod-002'
    },
    {
      image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=700&q=80',
      tag: '#OrganicPlaywear',
      outfitName: 'Oatmeal Waffle Romper',
      productId: 'cbc-prod-003'
    },
    {
      image: 'https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?auto=format&fit=crop&w=700&q=80',
      tag: '#HeirloomSmocking',
      outfitName: 'Sweet Lavender Frock',
      productId: 'cbc-prod-007'
    },
    {
      image: 'https://images.unsplash.com/photo-1543332164-6e82f355badc?auto=format&fit=crop&w=700&q=80',
      tag: '#MudPieKitchen',
      outfitName: 'Corduroy Overalls Duo',
      productId: 'cbc-prod-006'
    },
    {
      image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=700&q=80',
      tag: '#SummerDaisyTwirls',
      outfitName: 'Vintage Daisy Frock',
      productId: 'cbc-prod-005'
    }
  ];

  const handleTileClick = (productId: string) => {
    const prod = products.find(p => p.id === productId);
    if (prod) {
      openQuickView(prod);
    } else {
      navigateTo('catalogue');
    }
  };

  return (
    <section className="py-20 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D96B43] tracking-widest uppercase mb-1">
            <Instagram size={14} />
            <span>Community & Childhood Memories</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#20242B]">
            Life in Soft Cotton
          </h2>
          <p className="text-xs sm:text-sm text-[#666F7B] mt-2">
            Tag <span className="font-semibold text-[#2D3139]">{brandSettings.instagramHandle}</span> on your little one's daily explorations to be featured in our lookbook.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {moments.map((m, idx) => (
            <div
              key={idx}
              onClick={() => handleTileClick(m.productId)}
              className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer shadow-xs border border-[#EBE3D7]"
            >
              <img
                src={m.image}
                alt={m.outfitName}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />

              {/* Hover overlay with product tag */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3 text-white backdrop-blur-2xs">
                <div className="flex justify-end">
                  <Heart size={14} className="text-white fill-white" />
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-[#FCD8CD] block">
                    {m.tag}
                  </span>
                  <span className="font-serif font-bold text-xs line-clamp-1">
                    {m.outfitName}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
