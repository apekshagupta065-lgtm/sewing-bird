import React, { useState } from 'react';
import { useCatalogue } from '../../context/CatalogueContext';
import { X, Heart, MessageCircle, ArrowRight, ShieldCheck, Sparkles, Check } from 'lucide-react';

export const QuickViewModal: React.FC = () => {
  const { 
    activeModal, 
    closeModal, 
    brandSettings, 
    toggleWishlist, 
    isInWishlist, 
    navigateTo, 
    openEnquiryModal
  } = useCatalogue();

  if (!activeModal || activeModal.type !== 'quickView' || !activeModal.product) {
    return null;
  }

  const product = activeModal.product;
  const isSaved = isInWishlist(product.id);

  const [activeImageIdx, setActiveImageIdx] = useState(product.coverImageIndex || 0);
  const [selectedSize, setSelectedSize] = useState(product.availableSizes[0] || '');
  const [selectedColour, setSelectedColour] = useState(product.availableColours[0]?.name || '');

  const handleFullDetail = () => {
    closeModal();
    navigateTo('product-detail', product.slug || product.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        onClick={closeModal}
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity" 
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 border border-[#EBE3D7] my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 z-20 p-2 text-[#68707D] hover:text-[#2D3139] bg-white/80 hover:bg-white rounded-full shadow-xs transition-colors"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Left: Product Images & Gallery Strip */}
          <div className="bg-[#FAF7F2] p-6 flex flex-col justify-between">
            {/* Main Featured Photo */}
            <div className="relative aspect-4/5 rounded-2xl overflow-hidden bg-white shadow-xs border border-[#EFE8DC]">
              <img
                src={product.images[activeImageIdx] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover object-center transition-all duration-300"
              />
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`absolute top-3 right-3 p-2.5 rounded-full shadow-md transition-all ${
                  isSaved ? 'bg-white text-[#E88065]' : 'bg-white/80 text-[#545B66] hover:bg-white'
                }`}
                aria-label="Toggle wishlist"
              >
                <Heart size={18} className={isSaved ? 'fill-[#E88065]' : ''} />
              </button>
            </div>

            {/* Thumbnail Strip */}
            {product.images.length > 1 && (
              <div className="flex gap-2.5 mt-4 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`relative w-16 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                      activeImageIdx === idx 
                        ? 'border-[#D96B43] shadow-xs scale-102' 
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info & Ordering / Enquiry */}
          <div className="p-6 md:p-8 flex flex-col justify-between">
            <div>
              {/* Category & SKU */}
              <div className="flex items-center justify-between text-xs text-[#717A88] mb-1.5">
                <span>{product.category}</span>
                <span className="font-mono text-[#9EA7B4]">{product.sku}</span>
              </div>

              {/* Title */}
              <h2 className="font-serif text-2xl font-bold text-[#20242B] mb-2">
                {product.name}
              </h2>

              {/* Price */}
              <div className="flex items-baseline gap-2 mb-4">
                {product.price !== undefined ? (
                  <>
                    <span className="font-sans text-2xl font-bold text-[#2D3139]">
                      {brandSettings.currencySymbol}{product.price}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-sm text-[#949CA9] line-through">
                        {brandSettings.currencySymbol}{product.originalPrice}
                      </span>
                    )}
                  </>
                ) : (
                  <span className="text-sm text-[#7D8592] italic">Price available upon enquiry</span>
                )}
              </div>

              {/* Description */}
              <p className="text-sm text-[#545B66] leading-relaxed mb-6 line-clamp-3">
                {product.description}
              </p>

              {/* Size Selector */}
              {product.availableSizes && product.availableSizes.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-[#2D3139] uppercase tracking-wider">
                      Select Size:
                    </label>
                    <span className="text-xs text-[#717A88]">{selectedSize || 'Choose size'}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.availableSizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                          selectedSize === size
                            ? 'bg-[#2D3139] text-white border-[#2D3139] shadow-xs'
                            : 'bg-white text-[#4A515D] border-[#E2D9CC] hover:border-[#2D3139]'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Colour Selector */}
              {product.availableColours && product.availableColours.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-[#2D3139] uppercase tracking-wider">
                      Select Colour:
                    </label>
                    <span className="text-xs text-[#717A88]">{selectedColour}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {product.availableColours.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => setSelectedColour(c.name)}
                        title={c.name}
                        className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                          selectedColour === c.name
                            ? 'border-[#2D3139] ring-2 ring-[#D96B43]/40 scale-110'
                            : 'border-white shadow-xs hover:scale-105'
                        }`}
                        style={{ backgroundColor: c.hex }}
                      >
                        {selectedColour === c.name && (
                          <Check size={12} className={c.hex === '#FFFFFF' ? 'text-black' : 'text-white'} />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Quality Note */}
              <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#EDE5D8] flex items-center gap-2.5 mb-6 text-xs text-[#525964]">
                <ShieldCheck size={16} className="text-[#3DB5C3] flex-shrink-0" />
                <span>{product.material || '100% GOTS Certified Organic Cotton'}</span>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="space-y-2 pt-2 border-t border-[#F0E8DC]">
              <button
                onClick={() => {
                  closeModal();
                  openEnquiryModal(product, selectedSize, selectedColour);
                }}
                className="w-full py-3.5 px-4 bg-[#1F8769] hover:bg-[#186A53] text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 shadow-md transition-colors"
              >
                <MessageCircle size={16} />
                <span>Enquire on WhatsApp</span>
              </button>

              <button
                onClick={handleFullDetail}
                className="w-full py-2.5 px-4 bg-transparent hover:bg-[#FAF7F2] text-[#2D3139] text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>View Complete Product Details & Sizing Guide</span>
                <ArrowRight size={14} />
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
