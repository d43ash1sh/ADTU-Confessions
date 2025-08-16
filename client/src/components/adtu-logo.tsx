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
          {/* Official ADTU Logo Recreation */}
          
          {/* Outer blue circle */}
          <circle cx="50" cy="50" r="48" fill="#1e3a8a" stroke="#1e3a8a" strokeWidth="2"/>
          
          {/* Inner white circle */}
          <circle cx="50" cy="50" r="38" fill="white"/>
          
          {/* Central emblem - Book/Flame symbol */}
          <g transform="translate(50, 40)">
            {/* Open book base */}
            <path d="M-15 5 Q-15 0 -10 0 L10 0 Q15 0 15 5 L15 15 Q15 20 10 20 L-10 20 Q-15 20 -15 15 Z" 
                  fill="#1e3a8a" />
            
            {/* Book pages */}
            <rect x="-12" y="3" width="24" height="2" fill="white" opacity="0.8" />
            <rect x="-12" y="7" width="24" height="2" fill="white" opacity="0.8" />
            <rect x="-12" y="11" width="24" height="2" fill="white" opacity="0.8" />
            
            {/* Flame/Torch above book */}
            <ellipse cx="0" cy="-8" rx="6" ry="10" fill="#f59e0b" />
            <ellipse cx="0" cy="-6" rx="4" ry="7" fill="#fbbf24" />
            <ellipse cx="0" cy="-4" rx="2" ry="4" fill="#fcd34d" />
          </g>
          
          {/* University text curved at top */}
          <path id="topCurve" d="M 15 30 A 35 35 0 0 1 85 30" fill="none" />
          <text fontSize="6" fill="#1e3a8a" fontFamily="Arial, sans-serif" fontWeight="bold">
            <textPath href="#topCurve" startOffset="50%" textAnchor="middle">
              ASSAM DOWN TOWN
            </textPath>
          </text>
          
          {/* University text curved at bottom */}
          <path id="bottomCurve" d="M 15 70 A 35 35 0 0 0 85 70" fill="none" />
          <text fontSize="6" fill="#1e3a8a" fontFamily="Arial, sans-serif" fontWeight="bold">
            <textPath href="#bottomCurve" startOffset="50%" textAnchor="middle">
              UNIVERSITY
            </textPath>
          </text>
          
          {/* Established year */}
          <text x="50" y="85" textAnchor="middle" fill="#1e3a8a" fontSize="4" fontFamily="Arial, sans-serif">
            EST. 2010
          </text>
          
          {/* Decorative elements */}
          <circle cx="20" cy="50" r="1.5" fill="#f59e0b" />
          <circle cx="80" cy="50" r="1.5" fill="#f59e0b" />
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