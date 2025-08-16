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
          {/* Modern gradient background */}
          <defs>
            <linearGradient id="modernGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="50%" stopColor="#1D4ED8" />
              <stop offset="100%" stopColor="#1E40AF" />
            </linearGradient>
            <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
          </defs>
          
          {/* Main circle with modern gradient */}
          <circle cx="50" cy="50" r="45" fill="url(#modernGradient)" />
          
          {/* Inner accent ring */}
          <circle cx="50" cy="50" r="35" fill="none" stroke="white" strokeWidth="2" opacity="0.3" />
          
          {/* Modern "A" lettermark */}
          <g transform="translate(50, 50)">
            {/* Letter A shape */}
            <path d="M-12 15 L-6 -10 L0 -15 L6 -10 L12 15 L8 15 L6 8 L-6 8 L-8 15 Z M-4 2 L4 2 L0 -6 Z" 
                  fill="white" />
            
            {/* Modern accent dot */}
            <circle cx="0" cy="-18" r="3" fill="url(#accentGradient)" />
          </g>
          
          {/* Subtle geometric elements */}
          <circle cx="25" cy="25" r="2" fill="white" opacity="0.4" />
          <circle cx="75" cy="75" r="2" fill="white" opacity="0.4" />
          <circle cx="75" cy="25" r="1.5" fill="white" opacity="0.3" />
          <circle cx="25" cy="75" r="1.5" fill="white" opacity="0.3" />
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