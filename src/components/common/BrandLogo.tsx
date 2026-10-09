import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  brandName?: string;
  secondaryName?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
  brandName = 'The Sewing Bird',
  secondaryName = "Children's Boutique"
}) => {
  const sizeMap = {
    sm: { icon: 34, title: 'text-base', sub: 'text-[9px]' },
    md: { icon: 44, title: 'text-lg', sub: 'text-[10px]' },
    lg: { icon: 56, title: 'text-2xl', sub: 'text-xs' },
    xl: { icon: 72, title: 'text-3xl', sub: 'text-sm' },
  };

  const { icon, title, sub } = sizeMap[size];

  return (
    <div className={`flex items-center gap-2.5 group cursor-pointer ${className}`}>
      {/* Official Bluebird Badge Icon replicating the user's uploaded logo */}
      <div 
        style={{ width: icon, height: icon }}
        className="relative flex-shrink-0 transition-transform duration-300 group-hover:scale-105"
      >
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full drop-shadow-xs"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer circle */}
          <circle cx="100" cy="100" r="92" fill="#FFFDF9" stroke="#1F2421" strokeWidth="4" />
          
          {/* Side curved accent arcs */}
          <path d="M 24,68 A 82,82 0 0,0 24,132" fill="none" stroke="#1F2421" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M 176,68 A 82,82 0 0,1 176,132" fill="none" stroke="#1F2421" strokeWidth="3.5" strokeLinecap="round" />
          
          {/* Inner circle */}
          <circle cx="100" cy="100" r="68" fill="none" stroke="#1F2421" strokeWidth="3" />
          
          {/* Top text: THE */}
          <text
            x="100"
            y="48"
            textAnchor="middle"
            fontFamily="system-ui, -apple-system, sans-serif"
            fontSize="12"
            fontWeight="800"
            letterSpacing="5"
            fill="#1F2421"
          >
            THE
          </text>
          
          {/* Bottom text: SEWING BIRD */}
          <text
            x="100"
            y="162"
            textAnchor="middle"
            fontFamily="system-ui, -apple-system, sans-serif"
            fontSize="11.5"
            fontWeight="800"
            letterSpacing="3.5"
            fill="#1F2421"
          >
            SEWING BIRD
          </text>

          {/* Center Bluebird Silhouette */}
          <g transform="translate(76, 80) scale(0.48)">
            <path
              d="M 42,22 
                 C 42,22 25,28 12,38 
                 C 0,48 5,68 18,78 
                 C 32,88 65,92 88,78 
                 C 105,68 108,52 108,52 
                 L 118,34 
                 C 118,34 98,44 88,44 
                 C 76,44 72,36 68,26 
                 C 62,12 50,12 42,22 Z"
              fill="#3DB5C3"
            />
            {/* Beak */}
            <polygon points="14,40 2,47 16,52" fill="#3DB5C3" />
            {/* Feather wing accent */}
            <path d="M 52,48 C 65,48 85,42 98,34 L 75,64 C 62,68 52,62 52,48 Z" fill="#2DA0AD" opacity="0.45" />
            {/* Eye */}
            <circle cx="28" cy="42" r="4.2" fill="#1F2421" />
          </g>
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col leading-tight">
          <span 
            style={{ fontFamily: 'Verdana, sans-serif', fontWeight: 'normal' }}
            className={`font-normal tracking-tight text-[#24272D] transition-colors group-hover:text-[#D96B43] ${title}`}
          >
            {brandName}
          </span>
          <span className={`font-sans tracking-widest uppercase font-semibold text-[#666F75] ${sub}`}>
            {secondaryName}
          </span>
        </div>
      )}
    </div>
  );
};
