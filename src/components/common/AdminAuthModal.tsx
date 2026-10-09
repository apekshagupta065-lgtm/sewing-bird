import React, { useState } from 'react';
import { useCatalogue } from '../../context/CatalogueContext';
import { X, Lock, KeyRound, Sparkles, ArrowRight } from 'lucide-react';

export const AdminAuthModal: React.FC = () => {
  const { activeModal, closeModal, loginAdmin, navigateTo } = useCatalogue();
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState(false);

  if (!activeModal || activeModal.type !== 'adminAuth') return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginAdmin(passcode.trim());
    if (success) {
      closeModal();
      navigateTo('admin');
    } else {
      setError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={closeModal}
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity" 
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden z-10 border border-[#E8DFC9] p-6 animate-in fade-in zoom-in-95 duration-200">
        
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 p-1.5 text-[#868E9B] hover:text-[#2D3139]"
        >
          <X size={18} />
        </button>

        <div className="text-center pt-2 pb-4">
          <div className="w-12 h-12 bg-[#3DB5C3]/15 text-[#1C7F8C] rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-2xs">
            <Lock size={22} />
          </div>
          <h3 className="font-serif font-bold text-xl text-[#20242B]">
            Boutique Manager Login
          </h3>
          <p className="text-xs text-[#717A88] mt-1">
            Access catalogue editor, bulk image upload, and brand settings.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#2D3139] uppercase tracking-wider mb-1.5">
              Admin Passcode:
            </label>
            <div className="relative">
              <KeyRound size={16} className="absolute left-3 top-3 text-[#9FA8B4]" />
              <input
                type="password"
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  setError(false);
                }}
                placeholder="Enter passcode (e.g. blossom)"
                autoFocus
                className={`w-full pl-9 pr-3.5 py-2.5 text-sm bg-[#FAF7F2] border rounded-xl focus:outline-hidden ${
                  error ? 'border-[#EF4444] ring-2 ring-[#EF4444]/20' : 'border-[#DDD4C5] focus:border-[#2D3139]'
                }`}
              />
            </div>
            {error && (
              <p className="text-[11px] text-[#DC2626] mt-1 font-medium">
                Incorrect passcode. Default passcode is: <span className="font-bold underline">blossom</span>
              </p>
            )}
          </div>

          <div className="p-2.5 bg-[#FAF7F2] rounded-xl border border-[#EDE5D8] text-[11px] text-[#636C79]">
            💡 <span className="font-semibold text-[#2D3139]">Demo Passcode:</span> Use <code className="bg-white px-1.5 py-0.5 rounded-sm font-mono text-[#D96B43]">blossom</code> or <code className="bg-white px-1.5 py-0.5 rounded-sm font-mono text-[#D96B43]">sewingbird</code>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#2D3139] hover:bg-[#D96B43] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-xs"
          >
            <span>Open Manager Dashboard</span>
            <ArrowRight size={14} />
          </button>
        </form>

      </div>
    </div>
  );
};
