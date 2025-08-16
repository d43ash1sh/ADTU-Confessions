import React from 'react';

interface ADTULogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export function ADTULogo({ size = 'md', showText = true, className = '' }: ADTULogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <div className={`flex items-center ${className}`}>
      {/* ADTU Circular Logo */}
      <div className={`${sizeClasses[size]} relative flex-shrink-0`}>
        <svg viewBox="0 0 100 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          {/* Outer serrated circle */}
          <circle cx="50" cy="50" r="48" fill="#4A5AA8" stroke="#4A5AA8" strokeWidth="1"/>
          
          {/* Serrated edge effect */}
          <circle cx="50" cy="50" r="46" fill="none" stroke="#4A5AA8" strokeWidth="4" strokeDasharray="2,1"/>
          
          {/* Main blue circle */}
          <circle cx="50" cy="50" r="40" fill="#4A5AA8"/>
          
          {/* Inner white circle */}
          <circle cx="50" cy="50" r="32" fill="white"/>
          
          {/* ASSAM text (top left) */}
          <text x="25" y="25" fill="#4A5AA8" fontSize="4" fontFamily="Arial, sans-serif" fontWeight="bold" transform="rotate(-45 25 25)">ASSAM</text>
          
          {/* down town text (top right) */}
          <text x="75" y="25" fill="#4A5AA8" fontSize="3" fontFamily="Arial, sans-serif" transform="rotate(45 75 25)">down town</text>
          
          {/* UNIVERSITY text (bottom) */}
          <text x="50" y="85" fill="#4A5AA8" fontSize="4" fontFamily="Arial, sans-serif" fontWeight="bold" textAnchor="middle">UNIVERSITY</text>
          
          {/* Central flame symbol */}
          <g transform="translate(50, 45)">
            <ellipse cx="0" cy="0" rx="8" ry="12" fill="#F4C430"/>
            <ellipse cx="0" cy="2" rx="5" ry="8" fill="#FFD700"/>
            <ellipse cx="0" cy="4" rx="3" ry="5" fill="#FFA500"/>
          </g>
          
          {/* Estd. 2010 */}
          <text x="50" y="68" textAnchor="middle" fill="#4A5AA8" fontSize="3" fontFamily="Arial, sans-serif">Estd. 2010</text>
          
          {/* Stars */}
          <text x="30" y="60" fill="#4A5AA8" fontSize="3">★</text>
          <text x="70" y="60" fill="#4A5AA8" fontSize="3">★</text>
          
          {/* Bottom ribbon */}
          <rect x="20" y="75" width="60" height="8" fill="#4A5AA8" rx="4"/>
          <text x="50" y="80" textAnchor="middle" fill="white" fontSize="2.5" fontFamily="Arial, sans-serif">Guwahati</text>
        </svg>
      </div>

      {/* Text beside logo */}
      {showText && (
        <div className="ml-3">
          <div className={`font-bold text-adtu-blue dark:text-blue-400 ${textSizes[size]}`}>
            ASSAM
          </div>
          <div className={`text-adtu-blue dark:text-blue-400 ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
            down town
          </div>
          <div className={`font-bold text-adtu-blue dark:text-blue-400 ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
            UNIVERSITY
          </div>
        </div>
      )}
    </div>
  );
} 