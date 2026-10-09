import React, { useState } from 'react';
import { useCatalogue } from '../../context/CatalogueContext';
import { BrandLogo } from './BrandLogo';
import { Heart, MessageCircle, Mail, MapPin, Instagram, Sparkles, Check, ArrowRight } from 'lucide-react';
import { CATEGORIES_LIST } from '../../data/initialData';

export const Footer: React.FC = () => {
  const { brandSettings, navigateTo, setFilters, openModal, isAdminLoggedIn } = useCatalogue();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail('');
    }, 4000);
  };

  const handleCategoryClick = (cat: string) => {
    setFilters(prev => ({ ...prev, category: cat }));
    navigateTo('catalogue');
  };

  return (
    <footer className="bg-[#F4EFE6] border-t border-[#E8DEC9] text-[#2D3139] mt-24">
      {/* 1. Newsletter & Studio Promise Bar */}
      <div className="border-b border-[#E8DEC9] bg-[#FAF7F2] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D96B43] tracking-widest uppercase mb-1">
              <Sparkles size={13} />
              <span>The Sewing Bird Letters</span>
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#20242B]">
              Be First to Know About New Outfits & Collections
            </h3>
            <p className="text-xs text-[#636C79] mt-1.5 max-w-md">
              Receive early access to seasonal cotton drops, heirloom restocks, and private studio collection releases.
            </p>
          </div>

          <div>
            {subscribed ? (
              <div className="p-4 bg-[#E8F5F1] border border-[#BCE4D7] rounded-2xl flex items-center gap-2.5 text-xs text-[#176650] font-medium">
                <Check size={18} className="text-[#1F8769] flex-shrink-0" />
                <span>Thank you for joining our circle! We've sent your welcome note. 🌸</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  required
                  className="flex-1 px-4 py-3 text-xs bg-white border border-[#DDD3C2] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#D96B43]"
                />
                <button
                  type="submit"
                  className="px-5 py-3 bg-[#2D3139] hover:bg-[#D96B43] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <span>Subscribe</span>
                  <ArrowRight size={14} />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* 2. Main Footer Navigation Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <BrandLogo 
              size="lg" 
              brandName={brandSettings.brandName} 
              secondaryName={brandSettings.secondaryName} 
            />
            <p className="text-xs text-[#5E6773] leading-relaxed max-w-sm">
              Thoughtfully handcrafted children's clothing with whimsical vintage soul and everyday playability. Made exclusively with breathable organic cottons, natural buttons, and heirloom stitching.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={`https://wa.me/${brandSettings.whatsappNumber.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-white hover:bg-[#E8F5F1] text-[#1F8769] rounded-xl border border-[#DDD3C2] shadow-2xs transition-colors"
                title="WhatsApp Studio"
              >
                <MessageCircle size={17} />
              </a>
              <a
                href={`mailto:${brandSettings.enquiryEmail}`}
                className="p-2.5 bg-white hover:bg-[#FAF7F2] text-[#2D3139] rounded-xl border border-[#DDD3C2] shadow-2xs transition-colors"
                title="Email Us"
              >
                <Mail size={17} />
              </a>
              <span className="text-xs font-medium text-[#78818F] pl-2 font-mono">
                {brandSettings.instagramHandle}
              </span>
            </div>
          </div>

          {/* Shop Categories Col */}
          <div>
            <h4 className="font-serif font-semibold text-sm text-[#20242B] mb-4">
              Explore Outfits
            </h4>
            <ul className="space-y-2.5 text-xs text-[#545D69]">
              {CATEGORIES_LIST.slice(1, 6).map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => handleCategoryClick(cat)}
                    className="hover:text-[#D96B43] transition-colors text-left"
                  >
                    {cat}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => handleCategoryClick('All Outfits')}
                  className="font-medium text-[#D96B43] hover:underline"
                >
                  Shop All Outfits →
                </button>
              </li>
            </ul>
          </div>

          {/* Boutique & Story Col */}
          <div>
            <h4 className="font-serif font-semibold text-sm text-[#20242B] mb-4">
              Our Boutique
            </h4>
            <ul className="space-y-2.5 text-xs text-[#545D69]">
              <li>
                <button onClick={() => navigateTo('about')} className="hover:text-[#D96B43] transition-colors">
                  Our Story & Craft
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('catalogue')} className="hover:text-[#D96B43] transition-colors">
                  All Outfits Catalogue
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('contact')} className="hover:text-[#D96B43] transition-colors">
                  Contact Studio
                </button>
              </li>
              <li>
                <button onClick={() => openModal('wishlistDrawer')} className="hover:text-[#D96B43] transition-colors">
                  Saved Favourites
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    if (isAdminLoggedIn) navigateTo('admin');
                    else openModal('adminAuth');
                  }} 
                  className="text-[#647182] hover:text-[#2D3139] flex items-center gap-1 font-medium"
                >
                  <span>Boutique Manager</span>
                  <span className="text-[10px] bg-[#E8DEC9] px-1.5 py-0.5 rounded-sm">Studio</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Care */}
          <div>
            <h4 className="font-serif font-semibold text-sm text-[#20242B] mb-4">
              Direct Orders
            </h4>
            <div className="space-y-3 text-xs text-[#545D69]">
              <p className="leading-relaxed">
                We operate on a boutique catalogue model with personal WhatsApp consultations.
              </p>
              <div className="p-3 bg-white rounded-xl border border-[#E0D5C3] space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#89929F] tracking-wider block">
                  Studio WhatsApp:
                </span>
                <a
                  href={`https://wa.me/${brandSettings.whatsappNumber.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono font-medium text-[#1F8769] hover:underline"
                >
                  {brandSettings.whatsappNumber}
                </a>
              </div>
              <div className="text-[11px] text-[#717A88]">
                <span>Hours: Mon – Sat, 9:00am – 6:00pm</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Credits */}
        <div className="mt-16 pt-8 border-t border-[#E8DEC9] flex flex-col sm:flex-row items-center justify-between text-xs text-[#7A8390] gap-4">
          <p>
            © {new Date().getFullYear()} {brandSettings.brandName} & {brandSettings.secondaryName}. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs">
            <span>Hypoallergenic Organic Cotton</span>
            <span>·</span>
            <span>Handmade Heirloom Quality</span>
            <span>·</span>
            <span>Plastic-Free Packaging</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
