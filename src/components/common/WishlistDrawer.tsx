import React from 'react';
import { useCatalogue } from '../../context/CatalogueContext';
import { X, Heart, Trash2, MessageCircle, ArrowRight, Sparkles } from 'lucide-react';

export const WishlistDrawer: React.FC = () => {
  const { 
    activeModal, 
    closeModal, 
    wishlist, 
    products, 
    toggleWishlist, 
    navigateTo, 
    brandSettings,
    openEnquiryModal 
  } = useCatalogue();

  if (!activeModal || activeModal.type !== 'wishlistDrawer') return null;

  const savedProducts = wishlist
    .map(id => products.find(p => p.id === id))
    .filter((p): p is typeof products[0] => Boolean(p));

  const handleCombinedEnquiry = () => {
    if (savedProducts.length === 0) return;
    const rawNumber = brandSettings.whatsappNumber.replace(/[^0-9]/g, '');
    const outfitList = savedProducts
      .map((p, idx) => `${idx + 1}. ${p.name} (Ref: ${p.sku}) - ${window.location.origin}/?product=${p.slug || p.id}`)
      .join('\n');

    const message = encodeURIComponent(
      `Hello ${brandSettings.brandName}! 🌸\n` +
      `I have saved ${savedProducts.length} outfits to my wishlist and would love to enquire about them:\n\n` +
      `${outfitList}\n\n` +
      `Could you let me know about availability and sizing assistance? Thank you!`
    );

    window.open(`https://wa.me/${rawNumber}?text=${message}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={closeModal}
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity" 
      />

      <div className="fixed inset-y-0 right-0 max-w-md w-full bg-[#FAF7F2] shadow-2xl flex flex-col justify-between z-10 animate-in slide-in-from-right duration-300 border-l border-[#EBE3D7]">
        
        {/* Header */}
        <div className="p-5 border-b border-[#EAE1D3] bg-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-[#FDE8E5] text-[#D96B43] rounded-lg">
              <Heart size={18} className="fill-[#D96B43]" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-[#20242B]">
                Your Loved Outfits
              </h3>
              <p className="text-[11px] text-[#78818F]">
                {savedProducts.length} {savedProducts.length === 1 ? 'favourite saved' : 'favourites saved'} · Noted by studio ❤️
              </p>
            </div>
          </div>
          <button
            onClick={closeModal}
            className="p-1.5 text-[#68707D] hover:text-[#20242B] rounded-lg"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {savedProducts.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-16 px-4">
              <div className="w-16 h-16 rounded-full bg-[#FCEBE7] flex items-center justify-center text-[#E88065] mb-4">
                <Heart size={28} />
              </div>
              <h4 className="font-serif text-lg font-semibold text-[#20242B]">
                Your wishlist is empty
              </h4>
              <p className="text-xs text-[#717A88] mt-1.5 max-w-xs mb-6">
                Tap the heart on any dress, romper, or co-ord set to save your favourites while exploring our catalogue.
              </p>
              <button
                onClick={() => {
                  closeModal();
                  navigateTo('catalogue');
                }}
                className="px-5 py-2.5 bg-[#2D3139] hover:bg-[#D96B43] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
              >
                Explore Collection
              </button>
            </div>
          ) : (
            savedProducts.map((prod) => (
              <div
                key={prod.id}
                className="p-3 bg-white rounded-2xl border border-[#EBE3D7] shadow-xs flex items-center gap-3.5 group"
              >
                <img
                  src={prod.images[0]}
                  alt={prod.name}
                  onClick={() => {
                    closeModal();
                    navigateTo('product-detail', prod.slug || prod.id);
                  }}
                  className="w-16 h-20 rounded-xl object-cover cursor-pointer border border-[#E5DDD0] flex-shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <div className="text-[10px] text-[#868E9B] uppercase tracking-wider">
                    {prod.category} · {prod.sku}
                  </div>
                  <h4 
                    onClick={() => {
                      closeModal();
                      navigateTo('product-detail', prod.slug || prod.id);
                    }}
                    className="font-serif font-semibold text-sm text-[#20242B] truncate hover:text-[#D96B43] cursor-pointer"
                  >
                    {prod.name}
                  </h4>
                  {prod.price !== undefined && (
                    <div className="text-xs font-bold text-[#2D3139] mt-0.5">
                      {brandSettings.currencySymbol}{prod.price}
                    </div>
                  )}

                  {/* Actions row */}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => {
                        closeModal();
                        openEnquiryModal(prod);
                      }}
                      className="px-2.5 py-1 bg-[#E8F5F1] hover:bg-[#D4EFE6] text-[#1B775C] text-[11px] font-semibold rounded-lg flex items-center gap-1 transition-colors"
                    >
                      <MessageCircle size={12} />
                      <span>Enquire</span>
                    </button>
                    <button
                      onClick={() => toggleWishlist(prod.id)}
                      className="p-1 text-[#9CA3AF] hover:text-[#DC2626] rounded-md transition-colors"
                      title="Remove from wishlist"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer with Combined WhatsApp Enquiry */}
        {savedProducts.length > 0 && (
          <div className="p-5 border-t border-[#EAE1D3] bg-white space-y-2">
            <button
              onClick={handleCombinedEnquiry}
              className="w-full py-3 px-4 bg-[#1F8769] hover:bg-[#186A53] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 shadow-md transition-colors"
            >
              <MessageCircle size={16} />
              <span>Send My Loved Outfits to {brandSettings.brandName} on WhatsApp</span>
            </button>
            <p className="text-[10px] text-center text-[#7F8895]">
              Sends your {savedProducts.length} favourite outfits directly so we can check availability
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
