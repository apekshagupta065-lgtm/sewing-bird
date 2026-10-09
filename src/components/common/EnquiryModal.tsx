import React, { useState } from 'react';
import { useCatalogue } from '../../context/CatalogueContext';
import { X, MessageCircle, Mail, Copy, Check, ExternalLink, Sparkles } from 'lucide-react';
import { generateWhatsAppLink, generateEmailEnquiry } from '../../utils/storage';

export const EnquiryModal: React.FC = () => {
  const { activeModal, closeModal, brandSettings, showToast } = useCatalogue();

  if (!activeModal || activeModal.type !== 'enquiry' || !activeModal.product) {
    return null;
  }

  const product = activeModal.product;
  const [selectedSize, setSelectedSize] = useState(activeModal.selectedSize || product.availableSizes[0] || '');
  const [selectedColour, setSelectedColour] = useState(activeModal.selectedColour || product.availableColours[0]?.name || '');
  const [customNote, setCustomNote] = useState('');
  const [copied, setCopied] = useState(false);

  const productUrl = `${window.location.origin}/?product=${product.slug || product.id}`;
  
  // Build message preview
  const sizeText = selectedSize ? ` (Size: ${selectedSize})` : '';
  const colourText = selectedColour ? ` (Colour: ${selectedColour})` : '';
  const noteText = customNote.trim() ? `\nNote: ${customNote.trim()}` : '';

  const constructedMessage = `Hello ${brandSettings.brandName}! 🌸\n` +
    `I would love to enquire about this outfit:\n` +
    `• Product: ${product.name}\n` +
    `• Reference / SKU: ${product.sku}\n` +
    (selectedSize ? `• Selected Size: ${selectedSize}\n` : '') +
    (selectedColour ? `• Selected Colour: ${selectedColour}\n` : '') +
    (product.price ? `• Listed Price: ${brandSettings.currencySymbol}${product.price}\n` : '') +
    `• Link: ${productUrl}${noteText}\n\n` +
    `Could you please share availability and ordering details? Thank you!`;

  const handleOpenWhatsApp = () => {
    const rawNumber = brandSettings.whatsappNumber.replace(/[^0-9]/g, '');
    const encoded = encodeURIComponent(constructedMessage);
    window.open(`https://wa.me/${rawNumber}?text=${encoded}`, '_blank');
    closeModal();
  };

  const handleOpenEmail = () => {
    const subject = encodeURIComponent(`Outfit Enquiry: ${product.name} (Ref: ${product.sku})`);
    const body = encodeURIComponent(constructedMessage);
    window.location.href = `mailto:${brandSettings.enquiryEmail}?subject=${subject}&body=${body}`;
    closeModal();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(constructedMessage);
    setCopied(true);
    showToast('Enquiry message copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        onClick={closeModal}
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity" 
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden z-10 border border-[#EBE3D7] my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-[#FAF7F2] border-b border-[#EAE2D4] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-[#E2F4EE] text-[#1F8769] rounded-lg">
              <MessageCircle size={18} />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-[#20242B]">
                Enquire About This Outfit
              </h3>
              <p className="text-[11px] text-[#717A88]">
                Direct response via WhatsApp or Email from our studio
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

        {/* Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          
          {/* Selected Product Summary Card */}
          <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-[#FAF7F2] border border-[#EBE3D7]">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-16 h-20 rounded-xl object-cover border border-[#E0D8CB] flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between text-[11px] text-[#78818F]">
                <span>{product.category}</span>
                <span className="font-mono text-[#9EA7B4]">{product.sku}</span>
              </div>
              <h4 className="font-serif font-semibold text-sm text-[#20242B] truncate">
                {product.name}
              </h4>
              {product.price !== undefined && (
                <p className="text-xs font-bold text-[#2D3139] mt-0.5">
                  {brandSettings.currencySymbol}{product.price}
                </p>
              )}
            </div>
          </div>

          {/* Size Choice */}
          {product.availableSizes && product.availableSizes.length > 0 && (
            <div>
              <label className="block text-xs font-semibold text-[#2D3139] uppercase tracking-wider mb-2">
                Preferred Size:
              </label>
              <div className="flex flex-wrap gap-2">
                {product.availableSizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
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

          {/* Colour Choice */}
          {product.availableColours && product.availableColours.length > 0 && (
            <div>
              <label className="block text-xs font-semibold text-[#2D3139] uppercase tracking-wider mb-2">
                Preferred Colour:
              </label>
              <div className="flex flex-wrap gap-2">
                {product.availableColours.map(c => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColour(c.name)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border transition-all ${
                      selectedColour === c.name
                        ? 'bg-[#FAF7F2] border-[#2D3139] font-semibold text-[#2D3139]'
                        : 'bg-white border-[#E2D9CC] text-[#555C66]'
                    }`}
                  >
                    <span 
                      className="w-3 h-3 rounded-full border border-black/20" 
                      style={{ backgroundColor: c.hex }} 
                    />
                    <span>{c.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Custom Note or Question */}
          <div>
            <label className="block text-xs font-semibold text-[#2D3139] uppercase tracking-wider mb-1.5">
              Special Requests or Questions (Optional):
            </label>
            <input
              type="text"
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              placeholder="e.g. Need by next Saturday, gift wrapping, size advice..."
              className="w-full px-3.5 py-2 text-xs bg-white border border-[#DDD4C5] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#D96B43]"
            />
          </div>

          {/* Message Preview Box */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-semibold text-[#717A88] uppercase tracking-wider">
                Pre-Filled Enquiry Message:
              </span>
              <button
                onClick={handleCopy}
                className="text-[11px] text-[#D96B43] hover:underline flex items-center gap-1"
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E7DFD1] text-[11px] text-[#4F5561] font-mono whitespace-pre-wrap leading-relaxed max-h-32 overflow-y-auto">
              {constructedMessage}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-2">
            <button
              onClick={handleOpenWhatsApp}
              className="w-full py-3.5 px-4 bg-[#1F8769] hover:bg-[#186A53] text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 shadow-md transition-colors"
            >
              <MessageCircle size={18} />
              <span>Send Enquiry via WhatsApp</span>
              <ExternalLink size={14} className="opacity-70" />
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleOpenEmail}
                className="py-2.5 px-3 bg-white hover:bg-[#FAF7F2] border border-[#DDD4C5] text-[#2D3139] text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <Mail size={14} />
                <span>Send via Email</span>
              </button>
              
              <button
                onClick={handleCopy}
                className="py-2.5 px-3 bg-white hover:bg-[#FAF7F2] border border-[#DDD4C5] text-[#2D3139] text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                {copied ? <Check size={14} className="text-[#1F8769]" /> : <Copy size={14} />}
                <span>{copied ? 'Copied!' : 'Copy Text'}</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
