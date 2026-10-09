import React, { useState } from 'react';
import { useCatalogue } from '../../context/CatalogueContext';
import { MessageCircle, Mail, Clock, MapPin, Send, Check, Sparkles, HelpCircle } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { brandSettings, showToast } = useCatalogue();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Generate WhatsApp link or mailto
    const rawNumber = brandSettings.whatsappNumber.replace(/[^0-9]/g, '');
    const text = encodeURIComponent(
      `Hello ${brandSettings.brandName} Studio!\n` +
      `From: ${name || 'Customer'}\n` +
      (phone ? `Phone: ${phone}\n` : '') +
      (email ? `Email: ${email}\n` : '') +
      `Message: ${message}`
    );

    window.open(`https://wa.me/${rawNumber}?text=${text}`, '_blank');
    setSent(true);
    showToast('Redirected to WhatsApp with your enquiry!', 'success');
  };

  const faqs = [
    {
      q: 'How do catalogue enquiries work on The Sewing Bird?',
      a: 'Browse any outfit in our catalogue and click "Enquire on WhatsApp". Your enquiry will pre-fill with the exact outfit name, SKU code, selected size, and color so our studio team can confirm stock and dispatch details directly.'
    },
    {
      q: 'What fabrics do you use for your children’s clothing?',
      a: 'We use exclusively 100% GOTS-certified organic cotton, airy double gauze, cambric cotton voile, and French flax linen. Every garment is pre-washed to eliminate shrinkage.'
    },
    {
      q: 'Can I order a custom size or birthday outfit tailoring?',
      a: 'Yes! Send us a message on WhatsApp with your child’s height and chest measurements, and our sewing studio will advise on adjustments.'
    },
    {
      q: 'How are orders packaged?',
      a: 'All orders are wrapped in breathable unbleached tissue paper, tied with cotton ribbons, and shipped in plastic-free recycled boxes suitable for immediate gift giving.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-12 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D96B43] tracking-widest uppercase">
            <Sparkles size={14} />
            <span>Studio Concierge</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#20242B]">
            Get in Touch with Our Studio
          </h1>
          <p className="text-xs sm:text-sm text-[#666F7B]">
            Have a question about an outfit, custom sizing, or bulk gifting? We are always here to help.
          </p>
        </div>

        {/* Contact Grid: Direct WhatsApp Card + Form */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Direct channels (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            
            {/* WhatsApp Highlight Box */}
            <div className="p-6 bg-[#E8F5F1] rounded-3xl border border-[#BCE4D7] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#1F8769] text-white flex items-center justify-center shadow-xs">
                <MessageCircle size={22} />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#165A47]">
                WhatsApp Styling Assistant
              </h3>
              <p className="text-xs text-[#2A6E5A] leading-relaxed">
                Fastest way to check outfit availability, request photos of fabrics, or reserve a piece.
              </p>
              <a
                href={`https://wa.me/${brandSettings.whatsappNumber.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block w-full py-3 px-4 bg-[#1F8769] hover:bg-[#165A47] text-white text-xs font-semibold rounded-xl text-center shadow-xs transition-colors"
              >
                Chat on WhatsApp: {brandSettings.whatsappNumber}
              </a>
            </div>

            {/* Email Box */}
            <div className="p-5 bg-white rounded-2xl border border-[#EAE1D3] shadow-xs flex items-center gap-3.5">
              <div className="p-2.5 bg-[#FAF7F2] text-[#2D3139] rounded-xl border border-[#E5DDD0]">
                <Mail size={18} />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#8992A0] tracking-wider block">
                  Studio Email
                </span>
                <a href={`mailto:${brandSettings.enquiryEmail}`} className="text-xs font-semibold text-[#2D3139] hover:text-[#D96B43]">
                  {brandSettings.enquiryEmail}
                </a>
              </div>
            </div>

            {/* Operating Hours Box */}
            <div className="p-5 bg-white rounded-2xl border border-[#EAE1D3] shadow-xs flex items-center gap-3.5">
              <div className="p-2.5 bg-[#FAF7F2] text-[#2D3139] rounded-xl border border-[#E5DDD0]">
                <Clock size={18} />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#8992A0] tracking-wider block">
                  Customer Care Hours
                </span>
                <span className="text-xs text-[#4A525F]">
                  Mon – Sat, 9:00 AM – 6:00 PM
                </span>
              </div>
            </div>

          </div>

          {/* Form (7 cols) */}
          <div className="md:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-[#EAE1D3] shadow-xs">
            <h3 className="font-serif font-bold text-xl text-[#20242B] mb-1">
              Send a Studio Message
            </h3>
            <p className="text-xs text-[#717A88] mb-6">
              Fill in your inquiry and click send to open WhatsApp directly with your message.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#2D3139] uppercase tracking-wider mb-1.5">
                    Your Name:
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sarah Jenkins"
                    required
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#DDD3C2] rounded-xl focus:outline-hidden focus:ring-1 focus:ring-[#D96B43]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#2D3139] uppercase tracking-wider mb-1.5">
                    Phone / WhatsApp:
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +1 555 123 4567"
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#DDD3C2] rounded-xl focus:outline-hidden focus:ring-1 focus:ring-[#D96B43]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#2D3139] uppercase tracking-wider mb-1.5">
                  Email Address:
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. sarah@example.com"
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#DDD3C2] rounded-xl focus:outline-hidden focus:ring-1 focus:ring-[#D96B43]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#2D3139] uppercase tracking-wider mb-1.5">
                  Enquiry Details:
                </label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us what outfit or sizing advice you need..."
                  required
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#DDD3C2] rounded-xl focus:outline-hidden focus:ring-1 focus:ring-[#D96B43] leading-relaxed"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 bg-[#2D3139] hover:bg-[#D96B43] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <Send size={14} />
                <span>Submit & Open on WhatsApp</span>
              </button>
            </form>
          </div>

        </div>

        {/* FAQs */}
        <div className="pt-8 border-t border-[#EAE1D3] space-y-6">
          <div className="text-center max-w-md mx-auto">
            <h3 className="font-serif font-bold text-2xl text-[#20242B]">
              Frequently Asked Questions
            </h3>
            <p className="text-xs text-[#717A88] mt-1">
              Quick answers about ordering, sizing, and cotton care
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="p-5 bg-white rounded-2xl border border-[#EAE1D3] shadow-xs space-y-2">
                <h4 className="font-serif font-bold text-sm text-[#20242B]">
                  {faq.q}
                </h4>
                <p className="text-xs text-[#5C6572] leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
