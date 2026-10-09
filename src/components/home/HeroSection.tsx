import React from 'react';
import { useCatalogue } from '../../context/CatalogueContext';
import { ArrowRight, Sparkles, Heart, Feather, ShieldCheck } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { brandSettings, navigateTo, setFilters } = useCatalogue();

  const handleExplore = () => {
    setFilters(prev => ({ ...prev, category: 'All Outfits' }));
    navigateTo('catalogue');
  };

  const handleDiscoverStory = () => {
    navigateTo('about');
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 bg-[#FAF7F2]">
      
      {/* Whimsical Decorative Floating Elements */}
      <div className="absolute top-12 left-10 text-[#F5C2B4]/40 animate-gentle-float pointer-events-none select-none">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" opacity="0" />
          {/* Flower shape */}
          <circle cx="12" cy="7" r="3" />
          <circle cx="12" cy="17" r="3" />
          <circle cx="7" cy="12" r="3" />
          <circle cx="17" cy="12" r="3" />
          <circle cx="12" cy="12" r="2.5" fill="#E89678" />
        </svg>
      </div>

      <div className="absolute bottom-16 right-16 text-[#3DB5C3]/20 animate-gentle-float [animation-delay:2s] pointer-events-none select-none">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L15 8L22 9L17 14L18 21L12 17.5L6 21L7 14L2 9L9 8L12 2Z" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Editorial Headline & Copy */}
          <div className="lg:col-span-7 space-y-6 lg:pr-6 text-center lg:text-left">
            
            {/* Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#20242B] leading-[1.15]">
              {brandSettings.brandName}
            </h1>

            <p className="text-base sm:text-lg text-[#555C66] max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Handcrafted children's clothing catalogue. Browse thoughtful outfits and enquire directly with our studio.
            </p>

            {/* Interactive CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                onClick={handleExplore}
                className="w-full sm:w-auto px-7 py-3.5 bg-[#2D3139] hover:bg-[#D96B43] text-white text-sm font-semibold rounded-2xl flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <span>Explore Collection</span>
                <ArrowRight size={16} />
              </button>

              <button
                onClick={handleDiscoverStory}
                className="w-full sm:w-auto px-7 py-3.5 bg-white hover:bg-[#FAF7F2] text-[#2D3139] text-sm font-semibold rounded-2xl border border-[#DED5C5] shadow-xs hover:border-[#2D3139] transition-all duration-200"
              >
                <span>Discover Our Story</span>
              </button>
            </div>

            {/* Micro Feature Proof Points */}
            <div className="pt-6 grid grid-cols-3 gap-3 border-t border-[#EAE1D3] max-w-lg mx-auto lg:mx-0 text-left">
              <div className="flex items-center gap-2 text-xs text-[#525964]">
                <Feather size={16} className="text-[#3DB5C3] flex-shrink-0" />
                <span>100% Organic Cotton</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#525964]">
                <Heart size={16} className="text-[#E88065] flex-shrink-0" />
                <span>Hand-Smocked Detailing</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#525964]">
                <ShieldCheck size={16} className="text-[#1F8769] flex-shrink-0" />
                <span>Zero Pinch Elastic</span>
              </div>
            </div>

          </div>

          {/* Right Column: Editorial Visual Grid */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Primary Image */}
              <div className="relative aspect-4/5 rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                <img
                  src="https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=1200&q=85"
                  alt="Child wearing handmade floral cotton smocked dress"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
                
                {/* Floating caption chip */}
                <div className="absolute bottom-4 left-4 right-4 p-3 rounded-2xl bg-white/90 backdrop-blur-md border border-white/50 shadow-md flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#D96B43] tracking-wider block">
                      Featured Outfit
                    </span>
                    <span className="font-serif font-bold text-xs text-[#20242B]">
                      Peony Blossom Smocked Voile Dress
                    </span>
                  </div>
                  <button
                    onClick={handleExplore}
                    className="p-1.5 bg-[#2D3139] text-white rounded-lg hover:bg-[#D96B43] transition-colors"
                  >
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>

              {/* Overlapping Secondary Vignette Card */}
              <div className="hidden sm:block absolute -bottom-6 -left-8 w-44 aspect-3/4 rounded-2xl overflow-hidden shadow-xl border-4 border-white bg-white">
                <img
                  src="https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=600&q=80"
                  alt="Baby girl wearing ruffled yellow cotton outfit"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 right-2 text-center text-[10px] font-semibold text-[#2D3139] bg-white/90 py-0.5 rounded-md backdrop-blur-xs">
                  Buttercup Duo
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
