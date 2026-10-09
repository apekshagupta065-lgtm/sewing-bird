import React from 'react';
import { useCatalogue } from '../../context/CatalogueContext';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const { 
    activeModal, 
    closeModal, 
    cart, 
    updateCartQuantity, 
    removeFromCart, 
    brandSettings,
    navigateTo 
  } = useCatalogue();

  if (!activeModal || activeModal.type !== 'cartDrawer') return null;

  const subtotal = cart.reduce((sum, item) => {
    return sum + (item.product.price || 0) * item.quantity;
  }, 0);

  const handleCheckoutViaWhatsApp = () => {
    const rawNumber = brandSettings.whatsappNumber.replace(/[^0-9]/g, '');
    const lines = cart.map((item, idx) => 
      `${idx + 1}. ${item.product.name} (SKU: ${item.product.sku}) - Size: ${item.selectedSize}, Colour: ${item.selectedColour}, Qty: ${item.quantity} (${brandSettings.currencySymbol}${(item.product.price || 0) * item.quantity})`
    ).join('\n');

    const msg = encodeURIComponent(
      `Hello ${brandSettings.brandName}! 🌸\n` +
      `I would like to place an order for the following items in my bag:\n\n` +
      `${lines}\n\n` +
      `Subtotal: ${brandSettings.currencySymbol}${subtotal}\n\n` +
      `Please let me know shipping and payment instructions. Thank you!`
    );

    window.open(`https://wa.me/${rawNumber}?text=${msg}`, '_blank');
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
            <div className="p-1.5 bg-[#FAF3E0] text-[#D96B43] rounded-lg">
              <ShoppingBag size={18} />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-[#20242B]">
                Your Shopping Bag
              </h3>
              <p className="text-[11px] text-[#78818F]">
                {cart.length} {cart.length === 1 ? 'item' : 'items'}
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

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-16 px-4">
              <div className="w-16 h-16 rounded-full bg-[#F5ECE0] flex items-center justify-center text-[#7F8895] mb-4">
                <ShoppingBag size={28} />
              </div>
              <h4 className="font-serif text-lg font-semibold text-[#20242B]">
                Your bag is empty
              </h4>
              <p className="text-xs text-[#717A88] mt-1.5 max-w-xs mb-6">
                Explore our handcrafted cotton dresses, sets, and playwear to fill your bag.
              </p>
              <button
                onClick={() => {
                  closeModal();
                  navigateTo('catalogue');
                }}
                className="px-5 py-2.5 bg-[#2D3139] hover:bg-[#D96B43] text-white text-xs font-semibold rounded-xl transition-colors"
              >
                Shop Catalogue
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="p-3 bg-white rounded-2xl border border-[#EBE3D7] shadow-xs flex items-center gap-3.5"
              >
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-16 h-20 rounded-xl object-cover border border-[#E5DDD0] flex-shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <h4 className="font-serif font-semibold text-sm text-[#20242B] truncate">
                    {item.product.name}
                  </h4>
                  <div className="text-[11px] text-[#717A88] mt-0.5">
                    Size: <span className="font-medium text-[#2D3139]">{item.selectedSize}</span> · Colour: <span className="font-medium text-[#2D3139]">{item.selectedColour}</span>
                  </div>
                  {item.product.price !== undefined && (
                    <div className="text-xs font-bold text-[#2D3139] mt-1">
                      {brandSettings.currencySymbol}{item.product.price * item.quantity}
                    </div>
                  )}

                  {/* Quantity controls */}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-[#DDD4C5] rounded-lg overflow-hidden bg-[#FAF7F2]">
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="p-1 hover:bg-[#EAE1D3] text-[#4A515D]"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="px-2.5 text-xs font-semibold text-[#2D3139]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:bg-[#EAE1D3] text-[#4A515D]"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-1 text-[#9CA3AF] hover:text-[#DC2626] transition-colors"
                      title="Remove"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-[#EAE1D3] bg-white space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#68707D]">Estimated Subtotal</span>
              <span className="font-bold text-lg text-[#2D3139]">
                {brandSettings.currencySymbol}{subtotal}
              </span>
            </div>

            <button
              onClick={handleCheckoutViaWhatsApp}
              className="w-full py-3.5 px-4 bg-[#1F8769] hover:bg-[#186A53] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 shadow-md transition-colors"
            >
              <span>Confirm Order on WhatsApp</span>
              <ArrowRight size={14} />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
