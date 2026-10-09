import React from 'react';
import { useCatalogue } from '../../context/CatalogueContext';
import { Sparkles, Heart, Feather, ShieldCheck, Leaf, ArrowRight, MessageCircle } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { brandSettings, navigateTo } = useCatalogue();
  const story = brandSettings.aboutStory;

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-12 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header Hero */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D96B43] tracking-widest uppercase">
            <Sparkles size={14} />
            <span>Our Heritage & Craftsmanship</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#20242B] leading-tight">
            The Story Behind Every Stitch
          </h1>
          <p className="font-serif italic text-lg text-[#D96B43]">
            "{story.subtitle}"
          </p>
        </div>

        {/* Editorial Photo Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="aspect-4/5 rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-white">
            <img
              src="https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=1000&q=80"
              alt="Baby girl wearing heirloom cotton smocked dress"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-6 text-sm text-[#4E5664] leading-relaxed">
            <h2 className="font-serif font-bold text-2xl text-[#20242B]">
              Handcrafted in Small Batches
            </h2>
            <p>
              At <strong>{brandSettings.brandName}</strong> and our design studio <strong>{brandSettings.secondaryName}</strong>, we believe children’s fashion should be as enduring and gentle as a mother’s lullaby.
            </p>
            <p>
              We deliberately choose slow production over mass factories. Every seam is cut from breathable, natural fibre cottons, soft-washed linettes, and whisper-light double gauzes. We reject stiff plastics, harsh synthetic trims, and rough interior overlocking.
            </p>
            <div className="p-4 bg-white rounded-2xl border border-[#E8DEC9] space-y-2">
              <span className="font-serif font-bold text-xs text-[#20242B] block">
                The Sewing Bird Promise:
              </span>
              <ul className="text-xs space-y-1 text-[#666F7B]">
                <li>✓ 100% GOTS Certified Organic Cotton & Voile</li>
                <li>✓ Genuine Coconut Shell & Mother-of-Pearl Buttons</li>
                <li>✓ Pre-shrunk in purified mineral water</li>
                <li>✓ Generous growth ease with adjustable tie bows</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Studio Values */}
        <div className="pt-8 border-t border-[#EAE1D3]">
          <div className="text-center max-w-md mx-auto mb-10">
            <h3 className="font-serif font-bold text-2xl text-[#20242B]">
              Four Pillars of Our Design
            </h3>
            <p className="text-xs text-[#717A88] mt-1">
              Thoughtfully engineered for children’s tender skin and boundless play
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {story.values.map((val) => (
              <div
                key={val.title}
                className="p-6 bg-white rounded-2xl border border-[#EAE1D3] shadow-xs space-y-2.5"
              >
                <h4 className="font-serif font-bold text-base text-[#20242B]">
                  {val.title}
                </h4>
                <p className="text-xs text-[#5D6674] leading-relaxed">
                  {val.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Bar */}
        <div className="p-8 bg-[#FAF7F2] rounded-3xl border border-[#E0D7C9] text-center space-y-4">
          <h3 className="font-serif font-bold text-2xl text-[#20242B]">
            Looking for a Tailored Heirloom Piece?
          </h3>
          <p className="text-xs text-[#636C79] max-w-md mx-auto">
            We happily take bespoke sizing requests and personalized fabric enquiries through WhatsApp.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => navigateTo('catalogue')}
              className="px-6 py-3 bg-[#2D3139] hover:bg-[#D96B43] text-white text-xs font-semibold rounded-xl transition-colors"
            >
              Browse All Outfits
            </button>
            <a
              href={`https://wa.me/${brandSettings.whatsappNumber.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-[#1F8769] hover:bg-[#186A53] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <MessageCircle size={15} />
              <span>Message on WhatsApp</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
