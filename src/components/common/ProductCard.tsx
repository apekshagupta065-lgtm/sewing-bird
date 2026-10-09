import React, { useState } from 'react';
import { Product } from '../../types';
import { useCatalogue } from '../../context/CatalogueContext';
import { Heart, Eye, MessageCircle } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, priority = false }) => {
  const { 
    brandSettings, 
    navigateTo, 
    toggleWishlist, 
    isInWishlist, 
    openQuickView, 
    openEnquiryModal
  } = useCatalogue();

  const [isHovered, setIsHovered] = useState(false);
  const isSaved = isInWishlist(product.id);

  const coverImg = product.images[product.coverImageIndex] || product.images[0] || 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=800&q=80';
  const secondaryImg = product.images.length > 1 
    ? (product.coverImageIndex === 0 ? product.images[1] : product.images[0])
    : null;

  const handleCardClick = () => {
    navigateTo('product-detail', product.slug || product.id);
  };

  return (
    <div 
      className="group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-[#EFE8DD] shadow-xs hover:shadow-xl hover:border-[#E5D7C5] transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 1. Image Container with Aspect Ratio */}
      <div 
        onClick={handleCardClick}
        className="relative w-full aspect-4/5 bg-[#F8F4EC] overflow-hidden cursor-pointer"
      >
        {/* Primary Cover Image */}
        <img
          src={coverImg}
          alt={product.name}
          loading={priority ? 'eager' : 'lazy'}
          className={`w-full h-full object-cover object-center transition-all duration-700 ease-out ${
            secondaryImg && isHovered 
              ? 'opacity-0 scale-105' 
              : 'opacity-100 group-hover:scale-105'
          }`}
        />

        {/* Secondary Image for smooth Hover Switch */}
        {secondaryImg && (
          <img
            src={secondaryImg}
            alt={`${product.name} alternate view`}
            loading="lazy"
            className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 ease-out ${
              isHovered ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
            }`}
          />
        )}

        {/* Top Badges (New Arrival, Bestseller, Low Stock) */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isNewArrival && (
            <span className="px-2.5 py-1 text-[10px] font-semibold tracking-wider uppercase bg-[#2D3139] text-[#FAF7F2] rounded-md shadow-xs">
              New Arrival
            </span>
          )}
          {product.isBestSeller && !product.isNewArrival && (
            <span className="px-2.5 py-1 text-[10px] font-semibold tracking-wider uppercase bg-[#D96B43] text-white rounded-md shadow-xs">
              Best Seller
            </span>
          )}
          {product.availabilityStatus === 'low_stock' && (
            <span className="px-2.5 py-1 text-[10px] font-semibold tracking-wider uppercase bg-[#FEF3C7] text-[#92400E] rounded-md shadow-xs">
              Few Left
            </span>
          )}
        </div>

        {/* Wishlist Button (Top Right) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 z-10 ${
            isSaved 
              ? 'bg-white text-[#E88065] shadow-md scale-105' 
              : 'bg-white/80 text-[#474D58] hover:bg-white hover:text-[#E88065] hover:scale-110 shadow-xs'
          }`}
          aria-label={isSaved ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart size={17} className={isSaved ? "fill-[#E88065]" : ""} />
        </button>

        {/* Quick View Button (Reveals on hover desktop, always accessible) */}
        <div className="absolute inset-x-3 bottom-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              openQuickView(product);
            }}
            className="flex-1 py-2 px-3 bg-white/95 hover:bg-white text-[#2D3139] hover:text-[#D96B43] text-xs font-semibold rounded-xl shadow-md backdrop-blur-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <Eye size={14} />
            <span>Quick View</span>
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              openEnquiryModal(product);
            }}
            className="p-2 bg-[#1F8769] hover:bg-[#186A53] text-white rounded-xl shadow-md transition-colors"
            title="Enquire on WhatsApp"
          >
            <MessageCircle size={14} />
          </button>
        </div>
      </div>

      {/* 2. Product Details Card Body */}
      <div className="p-4 flex flex-col flex-1 justify-between bg-white">
        <div>
          {/* Category & SKU quietly unboxed */}
          <div className="flex items-center justify-between text-[11px] text-[#78818F] mb-1">
            <span>{product.category}</span>
            <span className="font-mono text-[10px] text-[#A0A8B4]">{product.sku}</span>
          </div>

          {/* Product Name */}
          <h3 
            onClick={handleCardClick}
            className="font-serif text-base font-semibold text-[#22262E] hover:text-[#D96B43] transition-colors line-clamp-1 cursor-pointer"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Available Sizes preview */}
          {product.availableSizes && product.availableSizes.length > 0 && (
            <div className="flex items-center gap-1 mt-1 text-[11px] text-[#717A88]">
              <span className="text-[10px] uppercase tracking-wider text-[#959DAA]">Sizes:</span>
              <span className="truncate">
                {product.availableSizes.slice(0, 4).join(', ')}
                {product.availableSizes.length > 4 ? ` +${product.availableSizes.length - 4}` : ''}
              </span>
            </div>
          )}
        </div>

        {/* Footer: Price & Colour Swatches */}
        <div className="mt-3 pt-2.5 border-t border-[#F2ECE1] flex items-center justify-between">
          {/* Price (if provided) */}
          <div className="flex items-baseline gap-1.5">
            {product.price !== undefined ? (
              <>
                <span className="font-sans font-bold text-sm text-[#2D3139]">
                  {brandSettings.currencySymbol}{product.price}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-xs text-[#9DA4B0] line-through font-normal">
                    {brandSettings.currencySymbol}{product.originalPrice}
                  </span>
                )}
              </>
            ) : (
              <span className="text-xs text-[#7D8693] font-medium">Price on request</span>
            )}
          </div>

          {/* Colour Swatches */}
          {product.availableColours && product.availableColours.length > 0 && (
            <div className="flex items-center -space-x-1">
              {product.availableColours.slice(0, 4).map((c, idx) => (
                <span
                  key={idx}
                  title={c.name}
                  className="w-3.5 h-3.5 rounded-full border border-white shadow-2xs inline-block"
                  style={{ backgroundColor: c.hex }}
                />
              ))}
              {product.availableColours.length > 4 && (
                <span className="text-[10px] text-[#717A88] pl-1 font-medium">
                  +{product.availableColours.length - 4}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
