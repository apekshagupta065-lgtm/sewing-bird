import React, { useState, useEffect } from 'react';
import { useCatalogue } from '../../context/CatalogueContext';
import { BrandLogo } from './BrandLogo';
import { 
  Search, 
  Heart, 
  ShoppingBag, 
  Menu, 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Lock, 
  SlidersHorizontal,
  MessageCircle,
  Sparkles
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    brandSettings, 
    currentView, 
    navigateTo, 
    wishlist, 
    cartCount, 
    openModal, 
    isAdminLoggedIn,
    setFilters
  } = useCatalogue();

  const [activeAnnouncement, setActiveAnnouncement] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Rotate announcement bar
  useEffect(() => {
    if (!brandSettings.announcements || brandSettings.announcements.length <= 1) return;
    const interval = setInterval(() => {
      setActiveAnnouncement(prev => (prev + 1) % brandSettings.announcements.length);
    }, (brandSettings.announcementIntervalSec || 5) * 1000);
    return () => clearInterval(interval);
  }, [brandSettings.announcements, brandSettings.announcementIntervalSec]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', view: 'home' as const },
    { label: 'Shop All', view: 'catalogue' as const, category: 'All Outfits' },
    { label: 'New Arrivals', view: 'catalogue' as const, filterNew: true },
    { label: 'Dresses', view: 'catalogue' as const, category: 'Dresses' },
    { label: 'Co-ord Sets', view: 'catalogue' as const, category: 'Co-ord Sets' },
    { label: 'Our Story', view: 'about' as const },
    { label: 'Contact', view: 'contact' as const }
  ];

  const handleNavClick = (link: typeof navLinks[0]) => {
    if (link.category) {
      setFilters(prev => ({ ...prev, category: link.category! }));
    }
    if (link.filterNew) {
      setFilters(prev => ({ ...prev, category: 'All Outfits', sortBy: 'newest' }));
    }
    navigateTo(link.view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* 1. Animated Announcement Bar */}
      {brandSettings.announcements && brandSettings.announcements.length > 0 && (
        <div className="relative bg-[#2D3139] text-[#FAF7F2] py-2 px-4 text-xs font-medium tracking-wide">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Prev button if multiple announcements */}
            {brandSettings.announcements.length > 1 && (
              <button
                onClick={() => setActiveAnnouncement(prev => (prev - 1 + brandSettings.announcements.length) % brandSettings.announcements.length)}
                className="hidden sm:inline-flex p-0.5 text-white/70 hover:text-white transition-colors"
                aria-label="Previous announcement"
              >
                <ChevronLeft size={14} />
              </button>
            )}

            {/* Announcement Message */}
            <div className="flex-1 text-center truncate px-2 select-none">
              <span className="transition-opacity duration-300 inline-block">
                {brandSettings.announcements[activeAnnouncement]}
              </span>
            </div>

            {/* Right side controls & WhatsApp fast link */}
            <div className="flex items-center gap-3">
              {brandSettings.announcements.length > 1 && (
                <button
                  onClick={() => setActiveAnnouncement(prev => (prev + 1) % brandSettings.announcements.length)}
                  className="hidden sm:inline-flex p-0.5 text-white/70 hover:text-white transition-colors"
                  aria-label="Next announcement"
                >
                  <ChevronRight size={14} />
                </button>
              )}
              <a
                href={`https://wa.me/${brandSettings.whatsappNumber.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:inline-flex items-center gap-1.5 text-[11px] text-[#A6E8D6] hover:text-white transition-colors border-l border-white/20 pl-3"
              >
                <MessageCircle size={12} />
                <span>WhatsApp Us</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 2. Main Navigation Bar */}
      <nav 
        className={`w-full transition-all duration-300 ${
          isScrolled 
            ? 'bg-[#FAF7F2]/95 backdrop-blur-md shadow-xs border-b border-[#EDE6DC]' 
            : 'bg-[#FAF7F2] border-b border-[#EFE9DF]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Mobile Hamburger & Search (Left) */}
            <div className="flex items-center gap-1 lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 text-[#2D3139] hover:text-[#D96B43] rounded-lg focus:outline-hidden"
                aria-label="Open mobile menu"
              >
                <Menu size={24} />
              </button>
              <button
                onClick={() => openModal('search')}
                className="p-2 text-[#2D3139] hover:text-[#D96B43] rounded-lg"
                aria-label="Search outfits"
              >
                <Search size={20} />
              </button>
            </div>

            {/* Brand Logo & Wordmark (Center on mobile, Left on desktop) */}
            <div 
              onClick={() => navigateTo('home')}
              className="flex-shrink-0"
            >
              <BrandLogo 
                size="md"
                brandName={brandSettings.brandName}
                secondaryName={brandSettings.secondaryName}
              />
            </div>

            {/* Desktop Navigation Links (Center) */}
            <div className="hidden lg:flex items-center space-x-7">
              {navLinks.map((link) => {
                const isActive = currentView === link.view;
                return (
                  <button
                    key={link.label}
                    onClick={() => handleNavClick(link)}
                    className={`relative py-1 text-sm font-medium transition-colors hover:text-[#D96B43] ${
                      isActive ? 'text-[#D96B43]' : 'text-[#3E434D]'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#D96B43] rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Right Action Icons (Search, Wishlist, Cart/Enquiry, Admin) */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Desktop Search Button */}
              <button
                onClick={() => openModal('search')}
                className="hidden lg:flex items-center gap-2 px-3 py-1.5 text-xs text-[#5C6370] bg-[#F3ECE0]/60 hover:bg-[#EFE5D7] rounded-full border border-[#E8DEC9] transition-colors"
                aria-label="Search outfits"
              >
                <Search size={14} />
                <span>Search outfits...</span>
                <kbd className="text-[10px] bg-white/70 px-1.5 py-0.5 rounded-sm text-[#7D8590]">⌘K</kbd>
              </button>

              {/* Wishlist / Favourites Heart Icon with Count Badge */}
              <button
                onClick={() => openModal('wishlistDrawer')}
                className="relative p-2 text-[#2D3139] hover:text-[#D96B43] rounded-full transition-colors"
                aria-label={`Favourites with ${wishlist.length} saved outfits`}
              >
                <Heart size={21} className={wishlist.length > 0 ? 'fill-[#E88065] text-[#E88065]' : ''} />
                {wishlist.length > 0 && (
                  <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-[#D96B43] rounded-full ring-2 ring-[#FAF7F2]">
                    {wishlist.length}
                  </span>
                )}
              </button>

              {/* Admin Dashboard Access Button */}
              <button
                onClick={() => {
                  if (isAdminLoggedIn) {
                    navigateTo('admin');
                  } else {
                    openModal('adminAuth');
                  }
                }}
                title={isAdminLoggedIn ? "Boutique Manager (Logged In)" : "Manage Catalogue / Upload Photos"}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  isAdminLoggedIn 
                    ? 'bg-[#3DB5C3]/15 text-[#1C7F8C] hover:bg-[#3DB5C3]/25 border border-[#3DB5C3]/30' 
                    : 'text-[#68707C] hover:text-[#2D3139] hover:bg-[#EFE7DC]'
                }`}
              >
                <Lock size={13} className={isAdminLoggedIn ? 'text-[#1C7F8C]' : 'text-[#7D8590]'} />
                <span className="hidden sm:inline">
                  {isAdminLoggedIn ? 'Manager' : 'Admin'}
                </span>
              </button>
            </div>

          </div>
        </div>
      </nav>

      {/* 3. Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div 
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity" 
          />

          {/* Drawer content */}
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-[#FAF7F2] shadow-2xl flex flex-col justify-between p-6 z-10 overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-[#EAE2D5]">
                <BrandLogo size="sm" brandName={brandSettings.brandName} secondaryName={brandSettings.secondaryName} />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-[#5C6370] hover:text-[#2D3139] rounded-lg"
                  aria-label="Close menu"
                >
                  <X size={22} />
                </button>
              </div>

              {/* Search button in mobile drawer */}
              <div className="pt-4 pb-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openModal('search');
                  }}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 text-xs text-[#5C6370] bg-[#F2EBDE] rounded-xl border border-[#E5DBCA]"
                >
                  <span className="flex items-center gap-2">
                    <Search size={15} />
                    <span>Search all outfits...</span>
                  </span>
                  <span className="text-[10px] text-[#8C93A0]">Browse</span>
                </button>
              </div>

              {/* Links */}
              <div className="py-4 space-y-1">
                {navLinks.map((link) => (
                  <button
                    key={link.label}
                    onClick={() => handleNavClick(link)}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-[#2D3139] hover:bg-[#F2EBDE] hover:text-[#D96B43] text-left transition-colors"
                  >
                    <span>{link.label}</span>
                    <ChevronRight size={16} className="text-[#A2AAB5]" />
                  </button>
                ))}
              </div>

              {/* Quick WhatsApp contact in drawer */}
              <div className="mt-4 p-4 rounded-xl bg-[#E8F5F1] border border-[#CDEAE0]">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#186A53] mb-1">
                  <MessageCircle size={15} />
                  <span>WhatsApp Styling Assistance</span>
                </div>
                <p className="text-[11px] text-[#367966] mb-3">
                  Need custom sizing or help choosing outfits? Chat directly with our studio!
                </p>
                <a
                  href={`https://wa.me/${brandSettings.whatsappNumber.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block w-full text-center py-1.5 px-3 bg-[#1F8769] hover:bg-[#186A53] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
                >
                  Message On WhatsApp
                </a>
              </div>
            </div>

            {/* Bottom Admin & Version info */}
            <div className="pt-6 border-t border-[#EAE2D5] flex items-center justify-between text-xs text-[#7B8390]">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (isAdminLoggedIn) {
                    navigateTo('admin');
                  } else {
                    openModal('adminAuth');
                  }
                }}
                className="flex items-center gap-1.5 font-medium hover:text-[#2D3139]"
              >
                <Lock size={13} />
                <span>{isAdminLoggedIn ? 'Manager Dashboard' : 'Admin Login'}</span>
              </button>
              <span className="text-[10px] text-[#A2AAB5]">The Sewing Bird Studio</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
