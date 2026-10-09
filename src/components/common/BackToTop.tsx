import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export const BackToTop: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 left-6 z-30 p-3 bg-white/90 hover:bg-white text-[#2D3139] hover:text-[#D96B43] rounded-full shadow-lg border border-[#E8DFC9] backdrop-blur-xs transition-all duration-300 hover:scale-110 active:scale-95"
      aria-label="Back to top"
    >
      <ArrowUp size={18} />
    </button>
  );
};
