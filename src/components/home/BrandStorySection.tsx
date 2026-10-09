import React from 'react';
import { useCatalogue } from '../../context/CatalogueContext';
import { Feather, Heart, Sparkles, Leaf, ShieldCheck, ArrowRight } from 'lucide-react';

export const BrandStorySection: React.FC = () => {
  const { brandSettings, navigateTo } = useCatalogue();
  const story = brandSettings.aboutStory;

  const iconMap: Record<string, React.ReactNode> = {
    Feather: <Feather size={22} className="text-[#3DB5C3]" />,
    Heart: <Heart size={22} className="text-[#E88065]" />,
    Sparkles: <Sparkles size={22} className="text-[#D96B43]" />,
    Leaf: <Leaf size={22} className="text-[#1F8769]" />
  };

  return (
    <section className="py-20 lg:py-28 bg-[#F4EFE6] relative overflow-hidden border-t border-[#EAE0CF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Editorial Block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left visual collage */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-sm lg:max-w-none">
              <div className="aspect-3/4 rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white">
                <img
                  src="https://images.unsplash.com/photo-1543332164-6e82f355badc?auto=format&fit=crop&w=1000&q=80"
                  alt="Little girl smiling outdoors in gentle cotton dungarees"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Inset badge card */}
              <div className="absolute -bottom-6 -right-6 p-4 sm:p-5 rounded-2xl bg-white shadow-xl border border-[#E8DFC9] max-w-[240px]">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#1F8769] animate-pulse" />
                  <span className="text-[10px] uppercase font-bold text-[#1F8769] tracking-wider">
                    Studio Certified
                  </span>
                </div>
                <p className="font-serif font-bold text-xs text-[#20242B] leading-snug">
                  100% GOTS Organic Cotton & Hypoallergenic Inks
                </p>
              </div>
            </div>
          </div>

          {/* Right editorial story copy */}
          <div className="lg:col-span-7 space-y-6">
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#20242B] leading-tight">
              {story.heroTitle}
            </h2>

            <p className="font-serif italic text-base sm:text-lg text-[#D96B43]">
              "{story.subtitle}"
            </p>

            <div className="space-y-4 text-sm text-[#545D69] leading-relaxed">
              {story.paragraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>

            <div className="pt-4">
              <button
                onClick={() => navigateTo('about')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#2D3139] hover:bg-[#D96B43] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
              >
                <span>Read Our Full Story & Studio Notes</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

        </div>

        {/* 4 Pillar Badges */}
        <div className="mt-20 pt-16 border-t border-[#E5DBCA] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {story.values.map((v) => (
            <div 
              key={v.title}
              className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#E9DFCF] shadow-xs space-y-3 hover:border-[#D96B43] transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-2xs border border-[#EDE3D4]">
                {iconMap[v.icon] || <Sparkles size={20} className="text-[#D96B43]" />}
              </div>
              <h3 className="font-serif font-bold text-base text-[#20242B]">
                {v.title}
              </h3>
              <p className="text-xs text-[#636C79] leading-relaxed">
                {v.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
