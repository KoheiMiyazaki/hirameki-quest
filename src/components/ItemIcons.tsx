import React from 'react';

interface WeaponIconProps {
  type: 'none' | 'wooden_sword' | 'iron_sword' | 'diamond_sword';
  className?: string;
}

export const WeaponIcon: React.FC<WeaponIconProps> = ({ type, className = 'w-10 h-10' }) => {
  if (type === 'wooden_sword') {
    // デザイン画の「木のけん」を再現したSVG
    return (
      <svg viewBox="0 0 64 64" className={className}>
        <g transform="rotate(-30 32 32)">
          {/* Blade */}
          <path d="M29 6 L35 6 L36 38 L28 38 Z" fill="#b45309" stroke="#78350f" stroke-width="2" />
          <path d="M30 8 L32 36" stroke="#92400e" stroke-width="1.5" stroke-linecap="round" />
          {/* Wood grain notch */}
          <path d="M35 18 L32 20" stroke="#78350f" stroke-width="1.5" />
          {/* Guard */}
          <rect x="22" y="38" width="20" height="6" rx="2" fill="#78350f" stroke="#451a03" stroke-width="1.5" />
          {/* Hilt */}
          <rect x="30" y="44" width="4" height="12" fill="#d97706" stroke="#78350f" stroke-width="1.5" />
          {/* Pommel */}
          <circle cx="32" cy="58" r="4" fill="#78350f" stroke="#451a03" stroke-width="1" />
        </g>
      </svg>
    );
  }

  if (type === 'iron_sword') {
    return (
      <svg viewBox="0 0 64 64" className={className}>
        <g transform="rotate(-30 32 32)">
          <path d="M29 6 L32 2 L35 6 L36 38 L28 38 Z" fill="#cbd5e1" stroke="#475569" stroke-width="2" />
          <path d="M32 4 L32 38" stroke="#94a3b8" stroke-width="1.5" />
          <rect x="20" y="38" width="24" height="6" rx="2" fill="#64748b" stroke="#334155" stroke-width="1.5" />
          <rect x="30" y="44" width="4" height="12" fill="#475569" />
          <circle cx="32" cy="58" r="4" fill="#94a3b8" stroke="#334155" stroke-width="1" />
        </g>
      </svg>
    );
  }

  if (type === 'diamond_sword') {
    return (
      <svg viewBox="0 0 64 64" className={className}>
        <g transform="rotate(-30 32 32)">
          <path d="M29 6 L32 2 L35 6 L36 38 L28 38 Z" fill="#38bdf8" stroke="#0284c7" stroke-width="2" />
          <path d="M32 4 L32 38" stroke="#e0f2fe" stroke-width="1.5" />
          <rect x="20" y="38" width="24" height="6" rx="2" fill="#0284c7" stroke="#0369a1" stroke-width="1.5" />
          <rect x="30" y="44" width="4" height="12" fill="#0f172a" />
          <polygon points="32,54 36,58 32,62 28,58" fill="#7dd3fc" stroke="#0284c7" stroke-width="1" />
        </g>
      </svg>
    );
  }

  // なし
  return (
    <svg viewBox="0 0 64 64" className={`${className} opacity-30`}>
      <circle cx="32" cy="32" r="26" fill="none" stroke="#6b7280" stroke-width="2" stroke-dasharray="4 4" />
      <line x1="18" y1="46" x2="46" y2="18" stroke="#6b7280" stroke-width="3" stroke-linecap="round" />
    </svg>
  );
};

interface ArmorIconProps {
  type: 'none' | 'leather_armor' | 'iron_armor' | 'diamond_armor';
  className?: string;
}

export const ArmorIcon: React.FC<ArmorIconProps> = ({ type, className = 'w-10 h-10' }) => {
  if (type === 'diamond_armor') {
    // デザイン画の「ダイヤのぼうぐ」を再現したクリスタルアーマーSVG
    return (
      <svg viewBox="0 0 64 64" className={className}>
        <defs>
          <linearGradient id="diaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#bae6fd" />
            <stop offset="50%" stop-color="#38bdf8" />
            <stop offset="100%" stop-color="#0284c7" />
          </linearGradient>
        </defs>
        {/* Helmet */}
        <g stroke="#0369a1" stroke-width="1.5">
          <path d="M22 20 C22 10 42 10 42 20 L40 28 L24 28 Z" fill="url(#diaGrad)" />
          {/* Visor slit with glowing light */}
          <path d="M26 21 L38 21 L35 24 L29 24 Z" fill="#0f172a" />
          <polygon points="32,12 30,16 34,16" fill="#ffffff" />
        </g>
        {/* Shoulders / Pauldrons */}
        <polygon points="14,26 24,24 22,34 12,34" fill="url(#diaGrad)" stroke="#0369a1" stroke-width="1.5" />
        <polygon points="50,26 40,24 42,34 52,34" fill="url(#diaGrad)" stroke="#0369a1" stroke-width="1.5" />
        {/* Chestplate */}
        <path d="M22 28 L42 28 L40 48 L32 54 L24 48 Z" fill="url(#diaGrad)" stroke="#0369a1" stroke-width="1.5" />
        {/* Diamond Core Emblem on chest */}
        <polygon points="32,32 37,38 32,44 27,38" fill="#ffffff" stroke="#0284c7" stroke-width="1" />
        {/* Crystal facets highlight */}
        <polygon points="32,32 34,38 32,44 30,38" fill="#e0f2fe" />
      </svg>
    );
  }

  if (type === 'iron_armor') {
    return (
      <svg viewBox="0 0 64 64" className={className}>
        <path d="M22 20 C22 10 42 10 42 20 L40 28 L24 28 Z" fill="#94a3b8" stroke="#475569" stroke-width="1.5" />
        <path d="M26 21 L38 21 L35 24 L29 24 Z" fill="#1e293b" />
        <polygon points="14,26 24,24 22,34 12,34" fill="#94a3b8" stroke="#475569" stroke-width="1.5" />
        <polygon points="50,26 40,24 42,34 52,34" fill="#94a3b8" stroke="#475569" stroke-width="1.5" />
        <path d="M22 28 L42 28 L40 48 L32 54 L24 48 Z" fill="#cbd5e1" stroke="#475569" stroke-width="1.5" />
        <circle cx="32" cy="38" r="4" fill="#64748b" />
      </svg>
    );
  }

  if (type === 'leather_armor') {
    return (
      <svg viewBox="0 0 64 64" className={className}>
        <path d="M22 28 L42 28 L40 48 L32 54 L24 48 Z" fill="#b45309" stroke="#78350f" stroke-width="1.5" />
        <polygon points="14,28 22,26 22,34 14,36" fill="#92400e" stroke="#78350f" stroke-width="1.5" />
        <polygon points="50,28 42,26 42,34 50,36" fill="#92400e" stroke="#78350f" stroke-width="1.5" />
        <line x1="32" y1="28" x2="32" y2="48" stroke="#78350f" stroke-width="1.5" stroke-dasharray="2 2" />
      </svg>
    );
  }

  // なし
  return (
    <svg viewBox="0 0 64 64" className={`${className} opacity-30`}>
      <circle cx="32" cy="32" r="26" fill="none" stroke="#6b7280" stroke-width="2" stroke-dasharray="4 4" />
      <path d="M24 20 L40 20 L38 44 L32 48 L26 44 Z" fill="none" stroke="#6b7280" stroke-width="2" stroke-dasharray="3 3" />
    </svg>
  );
};
