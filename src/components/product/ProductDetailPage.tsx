import React, { useState, useEffect } from 'react';
import { useCatalogue } from '../../context/CatalogueContext';
import { ProductCard } from '../common/ProductCard';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  ChevronLeft, 
  ChevronRight, 
  ShieldCheck, 
  Feather, 
  Sparkles, 
  Ruler, 
  RefreshCw, 
  Check, 
  Copy,
  Maximize2,
  X
} from 'lucide-react';
import { generateWhatsAppLink, generateEmailEnquiry } from '../../utils/storage';

export const ProductDetailPage: React.FC = () => {
  const { 
    selectedProductId, 
    products, 
    navigateTo, 
    brandSettings, 
    toggleWishlist, 
    isInWishlist, 
    openEnquiryModal,
    recordProductView,
    recentlyViewedProducts,
    showToast 
  } = useCatalogue();

  // Find product by id or slug
  const product = products.find(p => p.id === selectedProductId || p.slug === selectedProductId);

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColour, setSelectedColour] = useState('');
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [zoomModalOpen, setZoomModalOpen] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<'fabric' | 'care' | 'shipping' | null>('fabric');

  useEffect(() => {
    if (product) {
      setActiveImageIdx(product.coverImageIndex || 0);
      setSelectedSize(product.availableSizes[0] || '');
      setSelectedColour(product.availableColours[0]?.name || '');
      recordProductView(product.id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [product?.id]);

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8 bg-[#FAF7F2]">
        <h2 className="font-serif text-2xl font-bold text-[#20242B] mb-2">
          Outfit Not Found
        </h2>
        <p className="text-xs text-[#6F7785] max-w-sm mb-6">
          The outfit you're looking for may have been archived or updated.
        </p>
        <button
          onClick={() => navigateTo('catalogue')}
          className="px-6 py-2.5 bg-[#2D3139] text-white text-xs font-semibold rounded-xl hover:bg-[#D96B43] transition-colors"
        >
          Return to Catalogue
        </button>
      </div>
    );
  }

  const isSaved = isInWishlist(product.id);

  // Related products (same category, excluding current)
  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${product.name} - ${brandSettings.brandName}`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Outfit link copied to clipboard!', 'success');
    }
  };

  const currentImg = product.images[activeImageIdx] || product.images[0];

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Breadcrumb & Back Link */}
        <div className="flex items-center justify-between mb-8 text-xs text-[#7A8390]">
          <button
            onClick={() => navigateTo('catalogue')}
            className="flex items-center gap-1 text-[#2D3139] hover:text-[#D96B43] font-semibold transition-colors"
          >
            <ChevronLeft size={16} />
            <span>Back to All Outfits</span>
          </button>
          <div className="hidden sm:block">
            <span>Home</span> / <span>{product.category}</span> / <span className="text-[#2D3139] font-medium">{product.name}</span>
          </div>
        </div>

        {/* Main Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 bg-white p-6 sm:p-10 rounded-3xl border border-[#EAE1D3] shadow-xs">
          
          {/* Left Column: Gallery (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Main Featured Photo with Zoom Trigger */}
            <div className="relative aspect-4/5 rounded-2xl overflow-hidden bg-[#FAF7F2] border border-[#EAE1D3] group">
              <img
                src={currentImg}
                alt={`${product.name} angle ${activeImageIdx + 1}`}
                className="w-full h-full object-cover object-center transition-all duration-300"
              />

              {/* Wishlist button */}
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`absolute top-4 right-4 p-3 rounded-full shadow-md transition-all ${
                  isSaved ? 'bg-white text-[#E88065]' : 'bg-white/80 text-[#474D58] hover:bg-white'
                }`}
                aria-label="Wishlist"
              >
                <Heart size={20} className={isSaved ? 'fill-[#E88065]' : ''} />
              </button>

              {/* Zoom trigger */}
              <button
                onClick={() => setZoomModalOpen(true)}
                className="absolute bottom-4 right-4 p-2.5 bg-white/90 hover:bg-white text-[#2D3139] rounded-xl shadow-md backdrop-blur-xs text-xs font-medium flex items-center gap-1.5 transition-colors opacity-90 group-hover:opacity-100"
                title="View full-size photo"
              >
                <Maximize2 size={14} />
                <span className="hidden sm:inline">Zoom Photo</span>
              </button>

              {/* Prev / Next photo buttons on main image */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImageIdx(prev => (prev - 1 + product.images.length) % product.images.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-[#2D3139] shadow-md transition-all opacity-0 group-hover:opacity-100"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={() => setActiveImageIdx(prev => (prev + 1) % product.images.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-[#2D3139] shadow-md transition-all opacity-0 group-hover:opacity-100"
                    aria-label="Next image"
                  >
                    <ChevronRight size={18} />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Navigation Strip */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`relative w-20 h-24 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                      activeImageIdx === idx
                        ? 'border-[#D96B43] shadow-xs scale-102 ring-2 ring-[#D96B43]/20'
                        : 'border-[#EDE5D8] opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                    {idx === product.coverImageIndex && (
                      <span className="absolute bottom-1 right-1 text-[8px] bg-black/70 text-white px-1 py-0.2 rounded-xs">
                        Cover
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Photo count indicator */}
            <div className="text-[11px] text-[#7F8895] flex items-center justify-between px-1">
              <span>Showing view {activeImageIdx + 1} of {product.images.length} photographs</span>
              <span className="text-[#A2AAB6]">SKU: {product.sku}</span>
            </div>

          </div>

          {/* Right Column: Specs, Sizing, Enquiry Actions (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            
            <div>
              {/* Category, Status, Share */}
              <div className="flex items-center justify-between text-xs text-[#717A88] mb-2">
                <span className="uppercase tracking-wider font-semibold text-[#D96B43]">
                  {product.category}
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] text-[#8E97A4]">{product.sku}</span>
                  <button
                    onClick={handleShare}
                    className="p-1.5 hover:bg-[#FAF7F2] rounded-md text-[#666F7C] hover:text-[#2D3139]"
                    title="Share outfit link"
                  >
                    <Share2 size={15} />
                  </button>
                </div>
              </div>

              {/* Product Title */}
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#20242B] leading-tight mb-3">
                {product.name}
              </h1>

              {/* Pricing */}
              <div className="flex items-baseline gap-3 mb-5">
                {product.price !== undefined ? (
                  <>
                    <span className="font-sans text-3xl font-bold text-[#2D3139]">
                      {brandSettings.currencySymbol}{product.price}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-base text-[#9AA2B0] line-through font-normal">
                        {brandSettings.currencySymbol}{product.originalPrice}
                      </span>
                    )}
                    <span className="text-xs text-[#1F8769] font-medium bg-[#E8F5F1] px-2 py-0.5 rounded-md">
                      Complimentary Gift Packaging
                    </span>
                  </>
                ) : (
                  <span className="text-sm font-semibold text-[#666F7C] italic">
                    Price available upon WhatsApp request
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-[#525964] leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Size Selection */}
              {product.availableSizes && product.availableSizes.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2.5">
                    <label className="text-xs font-semibold text-[#20242B] uppercase tracking-wider">
                      Select Size:
                    </label>
                    <button
                      onClick={() => setSizeGuideOpen(true)}
                      className="text-xs text-[#D96B43] hover:underline flex items-center gap-1 font-medium"
                    >
                      <Ruler size={13} />
                      <span>Sizing Guide</span>
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.availableSizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-3.5 py-2 text-xs font-semibold rounded-xl border transition-all ${
                          selectedSize === size
                            ? 'bg-[#2D3139] text-white border-[#2D3139] shadow-xs'
                            : 'bg-white text-[#4A515D] border-[#DDD3C2] hover:border-[#2D3139]'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Colour Selection */}
              {product.availableColours && product.availableColours.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2.5">
                    <label className="text-xs font-semibold text-[#20242B] uppercase tracking-wider">
                      Select Colour:
                    </label>
                    <span className="text-xs text-[#6B7482] font-medium">{selectedColour}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    {product.availableColours.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => setSelectedColour(c.name)}
                        title={c.name}
                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                          selectedColour === c.name
                            ? 'border-[#2D3139] ring-2 ring-[#D96B43]/40 scale-110'
                            : 'border-white shadow-2xs hover:scale-105'
                        }`}
                        style={{ backgroundColor: c.hex }}
                      >
                        {selectedColour === c.name && (
                          <Check size={13} className={c.hex === '#FFFFFF' ? 'text-black' : 'text-white'} />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Primary Action Buttons (WhatsApp Enquiry & Studio Consultation) */}
              <div className="space-y-2.5 pt-2 mb-6">
                <button
                  onClick={() => openEnquiryModal(product, selectedSize, selectedColour)}
                  className="w-full py-4 px-6 bg-[#1F8769] hover:bg-[#186A53] text-white text-xs sm:text-sm font-semibold rounded-2xl flex items-center justify-center gap-2 shadow-md transition-all hover:shadow-lg"
                >
                  <MessageCircle size={18} />
                  <span>Enquire on WhatsApp ({selectedSize || 'Choose size'})</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => openEnquiryModal(product, selectedSize, selectedColour)}
                    className="py-2.5 px-3 bg-white hover:bg-[#FAF7F2] border border-[#DDD3C2] text-[#2D3139] text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <MessageCircle size={14} className="text-[#1F8769]" />
                    <span>Instant Studio Query</span>
                  </button>

                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="py-2.5 px-3 bg-white hover:bg-[#FAF7F2] border border-[#DDD3C2] text-[#2D3139] text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Heart size={14} className={isSaved ? 'fill-[#E88065] text-[#E88065]' : ''} />
                    <span>{isSaved ? 'Saved to Wishlist' : 'Save to Wishlist'}</span>
                  </button>
                </div>
              </div>

              {/* Accordions: Fabric, Care, Tailoring */}
              <div className="border-t border-[#EAE1D3] divide-y divide-[#EAE1D3] text-xs">
                
                {/* Fabric Specification */}
                <div className="py-3">
                  <button
                    onClick={() => setActiveAccordion(activeAccordion === 'fabric' ? null : 'fabric')}
                    className="w-full flex items-center justify-between text-left font-semibold text-[#20242B]"
                  >
                    <span className="flex items-center gap-2">
                      <Feather size={14} className="text-[#3DB5C3]" />
                      <span>Fabric & Organic Certification</span>
                    </span>
                    <span>{activeAccordion === 'fabric' ? '−' : '+'}</span>
                  </button>
                  {activeAccordion === 'fabric' && (
                    <div className="pt-2 text-[#5E6773] leading-relaxed pl-6">
                      <p>{product.material || '100% GOTS Certified Organic Cotton Voile'}</p>
                      <p className="mt-1 text-[11px] text-[#78818F]">
                        • Pre-washed with mineral-soft water to prevent post-wash shrinkage.<br />
                        • Natural coconut shell buttons and flat-felled French seams to prevent skin friction.
                      </p>
                    </div>
                  )}
                </div>

                {/* Washing Instructions */}
                <div className="py-3">
                  <button
                    onClick={() => setActiveAccordion(activeAccordion === 'care' ? null : 'care')}
                    className="w-full flex items-center justify-between text-left font-semibold text-[#20242B]"
                  >
                    <span className="flex items-center gap-2">
                      <RefreshCw size={14} className="text-[#1F8769]" />
                      <span>Care & Washing Recommendations</span>
                    </span>
                    <span>{activeAccordion === 'care' ? '−' : '+'}</span>
                  </button>
                  {activeAccordion === 'care' && (
                    <div className="pt-2 text-[#5E6773] leading-relaxed pl-6 space-y-1">
                      {product.careInstructions?.map((instr, idx) => (
                        <p key={idx}>• {instr}</p>
                      ))}
                    </div>
                  )}
                </div>

              </div>

            </div>

          </div>

        </div>

        {/* Related Outfits Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="font-serif text-2xl font-bold text-[#20242B]">
                  More from {product.category}
                </h3>
                <p className="text-xs text-[#717A88]">
                  Handmade cotton companions for this wardrobe look
                </p>
              </div>
              <button
                onClick={() => navigateTo('catalogue')}
                className="text-xs font-semibold text-[#D96B43] hover:underline"
              >
                View category →
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(rel => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        )}

        {/* Recently Viewed Outfits */}
        {recentlyViewedProducts.filter(p => p.id !== product.id).length > 0 && (
          <div className="mt-16 pt-12 border-t border-[#EAE1D3]">
            <h3 className="font-serif text-xl font-bold text-[#20242B] mb-6">
              Recently Explored by You
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {recentlyViewedProducts.filter(p => p.id !== product.id).slice(0, 6).map(rec => (
                <div
                  key={rec.id}
                  onClick={() => navigateTo('product-detail', rec.slug || rec.id)}
                  className="group bg-white p-2.5 rounded-2xl border border-[#EAE1D3] cursor-pointer hover:border-[#D96B43] transition-all shadow-2xs"
                >
                  <img
                    src={rec.images[0]}
                    alt={rec.name}
                    className="w-full aspect-4/5 rounded-xl object-cover mb-2"
                  />
                  <h4 className="font-serif text-xs font-semibold text-[#20242B] truncate group-hover:text-[#D96B43]">
                    {rec.name}
                  </h4>
                  {rec.price !== undefined && (
                    <p className="text-[11px] font-bold text-[#2D3139]">
                      {brandSettings.currencySymbol}{rec.price}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Sizing Guide Modal */}
      {sizeGuideOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setSizeGuideOpen(false)} className="fixed inset-0 bg-black/50 backdrop-blur-xs" />
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl z-10 border border-[#EAE1D3] animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-[#EAE1D3] mb-4">
              <h3 className="font-serif font-bold text-lg text-[#20242B] flex items-center gap-2">
                <Ruler size={18} className="text-[#D96B43]" />
                <span>Boutique Children's Sizing Guide</span>
              </h3>
              <button onClick={() => setSizeGuideOpen(false)} className="p-1 text-[#666F7C] hover:text-[#20242B]">
                <X size={18} />
              </button>
            </div>
            
            <p className="text-xs text-[#666F7C] mb-4">
              Our cotton silhouettes feature generous cuts with soft elastics designed to accommodate growth spurts. When between sizes, we recommend sizing up.
            </p>

            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#FAF7F2] text-[#20242B] font-semibold border-b border-[#E5DDD0]">
                    <th className="py-2.5 px-3">Age / Size</th>
                    <th className="py-2.5 px-3">Height (cm)</th>
                    <th className="py-2.5 px-3">Chest (cm)</th>
                    <th className="py-2.5 px-3">Weight (kg)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAE1D3] text-[#4A515D]">
                  <tr><td className="py-2 px-3 font-semibold">0-3 Months</td><td className="py-2 px-3">Up to 62</td><td className="py-2 px-3">42</td><td className="py-2 px-3">3 - 5.5</td></tr>
                  <tr><td className="py-2 px-3 font-semibold">3-6 Months</td><td className="py-2 px-3">62 - 68</td><td className="py-2 px-3">44</td><td className="py-2 px-3">5.5 - 7.5</td></tr>
                  <tr><td className="py-2 px-3 font-semibold">6-12 Months</td><td className="py-2 px-3">68 - 80</td><td className="py-2 px-3">47</td><td className="py-2 px-3">7.5 - 10</td></tr>
                  <tr><td className="py-2 px-3 font-semibold">12-18 Months</td><td className="py-2 px-3">80 - 86</td><td className="py-2 px-3">50</td><td className="py-2 px-3">10 - 11.5</td></tr>
                  <tr><td className="py-2 px-3 font-semibold">18-24 Months</td><td className="py-2 px-3">86 - 92</td><td className="py-2 px-3">52</td><td className="py-2 px-3">11.5 - 13</td></tr>
                  <tr><td className="py-2 px-3 font-semibold">2-3 Years</td><td className="py-2 px-3">92 - 98</td><td className="py-2 px-3">54</td><td className="py-2 px-3">13 - 15</td></tr>
                  <tr><td className="py-2 px-3 font-semibold">3-4 Years</td><td className="py-2 px-3">98 - 104</td><td className="py-2 px-3">56</td><td className="py-2 px-3">15 - 17</td></tr>
                  <tr><td className="py-2 px-3 font-semibold">4-5 Years</td><td className="py-2 px-3">104 - 110</td><td className="py-2 px-3">58</td><td className="py-2 px-3">17 - 19</td></tr>
                </tbody>
              </table>
            </div>

            <div className="mt-5 pt-4 border-t border-[#EAE1D3] flex items-center justify-between text-xs text-[#666F7C]">
              <span>Need exact custom measurements?</span>
              <button
                onClick={() => {
                  setSizeGuideOpen(false);
                  openEnquiryModal(product, selectedSize, selectedColour);
                }}
                className="font-semibold text-[#1F8769] hover:underline"
              >
                Ask our tailoring team on WhatsApp →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full-Screen Zoom Photo Modal */}
      {zoomModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <button
            onClick={() => setZoomModalOpen(false)}
            className="absolute top-6 right-6 p-2 text-white/80 hover:text-white bg-white/10 rounded-full"
          >
            <X size={24} />
          </button>
          <div className="max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl">
            <img
              src={currentImg}
              alt="High resolution garment view"
              className="max-h-[85vh] w-auto mx-auto object-contain"
            />
          </div>
        </div>
      )}

    </div>
  );
};
