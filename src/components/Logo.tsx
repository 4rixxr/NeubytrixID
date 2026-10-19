import React from 'react';

export interface NeubytrixLogoIconProps {
  className?: string;
  size?: number | string;
}

/**
 * Authentic NeubytrixID Swirl & Atom Emblem
 * Vibrant multi-colored spiral (cyan, emerald, yellow-orange, magenta, lime)
 * with a central golden sun orb and white atom orbit nucleus.
 */
export const NeubytrixLogoIcon: React.FC<NeubytrixLogoIconProps> = ({
  className = '',
  size = 36,
}) => {
  const pixelSize = typeof size === 'number' ? `${size}px` : size;

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: pixelSize, height: pixelSize }}
    >
      <svg
        viewBox="0 0 500 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm select-none"
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="nb-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00C4FF" />
            <stop offset="60%" stopColor="#0088EA" />
            <stop offset="100%" stopColor="#0057C2" />
          </linearGradient>

          <linearGradient id="nb-green" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#70E000" />
            <stop offset="50%" stopColor="#38B000" />
            <stop offset="100%" stopColor="#007200" />
          </linearGradient>

          <linearGradient id="nb-lime" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FCEE21" />
            <stop offset="40%" stopColor="#AACC00" />
            <stop offset="100%" stopColor="#2B9348" />
          </linearGradient>

          <linearGradient id="nb-orange" x1="0%" y1="0%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#FFDE59" />
            <stop offset="50%" stopColor="#FF9100" />
            <stop offset="100%" stopColor="#FF6D00" />
          </linearGradient>

          <linearGradient id="nb-pink" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF5D8F" />
            <stop offset="40%" stopColor="#FF007F" />
            <stop offset="100%" stopColor="#B5179E" />
          </linearGradient>

          <linearGradient id="nb-blue-anchor" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0096C7" />
            <stop offset="100%" stopColor="#03045E" />
          </linearGradient>

          <radialGradient id="nb-sun" cx="40%" cy="38%" r="65%">
            <stop offset="0%" stopColor="#FFF36D" />
            <stop offset="60%" stopColor="#FFB703" />
            <stop offset="100%" stopColor="#FB8500" />
          </radialGradient>
        </defs>

        <g id="neubytrix-official-logo">
          {/* 1. Background Cyan-Blue Swirl Arc (Top & Upper Left) */}
          <path
            d="M250,55 C330,55 405,105 425,185 C390,165 340,150 280,160 C210,172 165,225 150,290 C125,275 110,240 110,205 C110,122 173,55 250,55 Z"
            fill="url(#nb-cyan)"
          />

          {/* 2. Bottom Deep Blue Swirl Anchor */}
          <path
            d="M170,350 C210,430 310,460 380,410 C395,395 410,360 415,330 C370,390 285,410 215,380 C195,372 180,362 170,350 Z"
            fill="url(#nb-blue-anchor)"
          />

          {/* 3. Top-Right Emerald Green Ribbon with Sweeping Wing */}
          <path
            d="M260,85 C325,85 390,115 425,170 C445,160 470,165 485,185 C460,185 435,200 415,220 C365,165 295,145 220,158 C240,110 250,85 260,85 Z"
            fill="url(#nb-green)"
          />

          {/* 4. Lime Green Ribbon (Bottom-Left sweeping upwards) */}
          <path
            d="M115,320 C85,250 90,175 135,120 C120,160 115,210 135,260 C155,310 195,350 240,380 C180,395 135,365 115,320 Z"
            fill="url(#nb-lime)"
          />

          {/* 5. Bottom Hot Pink / Magenta Ribbon */}
          <path
            d="M165,390 C220,405 290,395 345,355 C390,320 415,270 420,225 C410,285 375,345 320,385 C275,415 210,425 155,405 C140,400 120,405 105,415 C125,400 145,393 165,390 Z"
            fill="url(#nb-pink)"
          />

          {/* 6. Golden Orange Wing / Ribbon (Middle Right) */}
          <path
            d="M245,290 C310,270 375,245 420,205 C445,195 470,200 495,220 C465,228 435,250 410,275 C365,325 305,355 240,360 C265,335 270,305 245,290 Z"
            fill="url(#nb-orange)"
          />

          {/* 7. Central Golden Sun Circle */}
          <circle
            cx="245"
            cy="245"
            r="88"
            fill="url(#nb-sun)"
          />

          {/* 8. White Atom Symbol in Center of Golden Sun */}
          <g id="nb-atom">
            {/* Nucleus (Solid White Center Circle) */}
            <circle cx="245" cy="245" r="18" fill="#FFFFFF" />

            {/* Orbit 1: Tilted -28deg */}
            <ellipse
              cx="245"
              cy="245"
              rx="58"
              ry="23"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="7"
              strokeLinecap="round"
              transform="rotate(-28 245 245)"
            />

            {/* Orbit 2: Tilted +38deg */}
            <ellipse
              cx="245"
              cy="245"
              rx="58"
              ry="23"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="7"
              strokeLinecap="round"
              transform="rotate(38 245 245)"
            />

            {/* Orbit 3: Steep Tilt +95deg */}
            <ellipse
              cx="245"
              cy="245"
              rx="58"
              ry="23"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="7"
              strokeLinecap="round"
              transform="rotate(95 245 245)"
            />

            {/* Electron Beads along the orbits */}
            <circle cx="196" cy="268" r="7" fill="#FFFFFF" />
            <circle cx="278" cy="286" r="7" fill="#FFFFFF" />
            <circle cx="258" cy="192" r="6" fill="#FFFFFF" />
          </g>
        </g>
      </svg>
    </div>
  );
};

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
}) => {
  const pixelSizes = {
    sm: 28,
    md: 36,
    lg: 44,
    xl: 60,
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Authentic Swirl & Atom Icon */}
      <NeubytrixLogoIcon size={pixelSizes[size]} />

      {/* Wordmark */}
      {showText && (
        <div className="flex items-baseline tracking-tight">
          <span
            className={`font-bold tracking-[-0.03em] ${textSizes[size]} text-slate-900 dark:text-white transition-colors duration-200`}
            style={{ fontFamily: "'Space Grotesk', 'Plus Jakarta Sans', sans-serif" }}
          >
            Neubytrix
          </span>
          <span
            className={`font-black tracking-tight ${textSizes[size]} gradient-text-brand`}
            style={{ fontFamily: "'Space Grotesk', 'Plus Jakarta Sans', sans-serif" }}
          >
            ID
          </span>
        </div>
      )}
    </div>
  );
};
