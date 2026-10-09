import React from 'react';
import { useCatalogue } from '../../context/CatalogueContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useCatalogue();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between p-3.5 rounded-2xl shadow-xl border backdrop-blur-md transition-all duration-300 animate-in slide-in-from-bottom-2 ${
              isSuccess 
                ? 'bg-[#183B32]/95 text-white border-[#2A5E50]' 
                : isError
                ? 'bg-[#5A1D1D]/95 text-white border-[#842C2C]'
                : 'bg-[#2D3139]/95 text-white border-[#454B57]'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0 pr-2">
              {isSuccess && <CheckCircle2 size={18} className="text-[#64E0B6] flex-shrink-0" />}
              {isError && <AlertCircle size={18} className="text-[#FCA5A5] flex-shrink-0" />}
              {!isSuccess && !isError && <Info size={18} className="text-[#93C5FD] flex-shrink-0" />}
              <span className="text-xs font-medium leading-snug">{toast.message}</span>
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="p-1 text-white/70 hover:text-white rounded-lg flex-shrink-0"
              aria-label="Dismiss toast"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
