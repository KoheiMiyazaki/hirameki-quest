import React from 'react';
import { MonsterSvgType } from '../gameData.ts';

interface MonsterRendererProps {
  type: MonsterSvgType;
  isHit?: boolean;
}

export const MonsterRenderer: React.FC<MonsterRendererProps> = ({ type, isHit = false }) => {
  const animClass = isHit ? 'anim-shake anim-flash-red' : 'anim-monster-idle';
  const svgBaseProps = {
    viewBox: '0 0 320 320',
    className: `w-full h-full select-none transition-transform duration-150 ${animClass}`
  };

  // 1. プリンティラノ （プリン × ティラノサウルス）
  if (type === 'pudding_tyranno') {
    return (
      <svg {...svgBaseProps}>
        <ellipse cx="160" cy="285" rx="80" ry="18" fill="#f59e0b" opacity="0.4" />
        {/* Tail with pudding drip */}
        <path d="M90 230 Q40 240 30 200 Q50 215 80 210" fill="#fde047" stroke="#d97706" strokeWidth="4" />
        {/* Feet */}
        <rect x="110" y="240" width="30" height="35" rx="10" fill="#fde047" stroke="#d97706" strokeWidth="4" />
        <rect x="175" y="240" width="30" height="35" rx="10" fill="#fde047" stroke="#d97706" strokeWidth="4" />
        <circle cx="118" cy="275" r="4" fill="#d97706" />
        <circle cx="132" cy="275" r="4" fill="#d97706" />
        <circle cx="183" cy="275" r="4" fill="#d97706" />
        <circle cx="197" cy="275" r="4" fill="#d97706" />
        {/* Pudding Body (Trapezoid jelly) */}
        <path d="M100 240 L115 130 Q160 120 205 130 L220 240 Q160 255 100 240 Z" fill="#fef08a" stroke="#ca8a04" strokeWidth="4" />
        {/* Caramel Sauce Topping (Dripping dark brown) */}
        <path d="M115 130 Q160 120 205 130 L208 160 Q195 150 185 165 Q175 145 160 160 Q145 148 135 165 Q125 152 112 155 Z" fill="#78350f" stroke="#451a03" strokeWidth="3" />
        {/* Cherry on top with green leaf */}
        <circle cx="160" cy="115" r="14" fill="#ef4444" stroke="#991b1b" strokeWidth="3" />
        <path d="M160 102 Q170 85 180 88" stroke="#15803d" strokeWidth="3" fill="none" />
        <ellipse cx="180" cy="88" rx="7" ry="4" fill="#22c55e" />
        {/* Tyranno Eyes */}
        <circle cx="140" cy="170" r="9" fill="#1c1917" />
        <circle cx="142" cy="168" r="3" fill="#ffffff" />
        <circle cx="180" cy="170" r="9" fill="#1c1917" />
        <circle cx="182" cy="168" r="3" fill="#ffffff" />
        {/* Cute Sharp T-Rex Teeth Grin */}
        <path d="M135 195 Q160 215 185 195" stroke="#78350f" strokeWidth="3" fill="none" />
        <polygon points="144,196 148,206 152,197" fill="#ffffff" stroke="#78350f" strokeWidth="1" />
        <polygon points="156,197 160,208 164,198" fill="#ffffff" stroke="#78350f" strokeWidth="1" />
        <polygon points="168,197 172,206 176,196" fill="#ffffff" stroke="#78350f" strokeWidth="1" />
        {/* Tiny Tyranno Arms */}
        <path d="M112 185 Q95 190 92 180" stroke="#ca8a04" strokeWidth="6" strokeLinecap="round" />
        <path d="M208 185 Q225 190 228 180" stroke="#ca8a04" strokeWidth="6" strokeLinecap="round" />
      </svg>
    );
  }

  // 2. オムライスライオン （オムライス × ライオン）
  if (type === 'omurice_lion') {
    return (
      <svg {...svgBaseProps}>
        <ellipse cx="160" cy="285" rx="85" ry="18" fill="#ea580c" opacity="0.4" />
        {/* Big Fluffy Omelet Egg Mane */}
        <circle cx="160" cy="160" r="78" fill="#facc15" stroke="#ca8a04" strokeWidth="5" />
        {/* Ketchup zigzag swirl on mane */}
        <path d="M110 110 Q140 90 170 115 Q195 95 210 120" stroke="#ef4444" strokeWidth="7" fill="none" strokeLinecap="round" />
        <path d="M95 160 Q85 190 120 210" stroke="#ef4444" strokeWidth="6" fill="none" strokeLinecap="round" />
        <path d="M225 160 Q235 190 200 210" stroke="#ef4444" strokeWidth="6" fill="none" strokeLinecap="round" />
        {/* Lion Head */}
        <circle cx="160" cy="165" r="48" fill="#fdba74" stroke="#c2410c" strokeWidth="4" />
        {/* Ears */}
        <circle cx="125" cy="120" r="16" fill="#fdba74" stroke="#c2410c" strokeWidth="3" />
        <circle cx="125" cy="120" r="8" fill="#fed7aa" />
        <circle cx="195" cy="120" r="16" fill="#fdba74" stroke="#c2410c" strokeWidth="3" />
        <circle cx="195" cy="120" r="8" fill="#fed7aa" />
        {/* Eyes */}
        <ellipse cx="145" cy="160" rx="6" ry="8" fill="#1c1917" />
        <circle cx="147" cy="158" r="2.5" fill="#ffffff" />
        <ellipse cx="175" cy="160" rx="6" ry="8" fill="#1c1917" />
        <circle cx="177" cy="158" r="2.5" fill="#ffffff" />
        {/* Nose & Whiskers */}
        <polygon points="160,170 152,180 168,180" fill="#9a3412" />
        <line x1="125" y1="175" x2="140" y2="178" stroke="#9a3412" strokeWidth="2.5" />
        <line x1="125" y1="185" x2="140" y2="183" stroke="#9a3412" strokeWidth="2.5" />
        <line x1="195" y1="175" x2="180" y2="178" stroke="#9a3412" strokeWidth="2.5" />
        <line x1="195" y1="185" x2="180" y2="183" stroke="#9a3412" strokeWidth="2.5" />
        {/* Paws */}
        <ellipse cx="130" cy="250" rx="20" ry="15" fill="#fdba74" stroke="#c2410c" strokeWidth="3.5" />
        <ellipse cx="190" cy="250" rx="20" ry="15" fill="#fdba74" stroke="#c2410c" strokeWidth="3.5" />
      </svg>
    );
  }

  // 3. メロンパンダ （メロンパン × パンダ）
  if (type === 'melon_panda') {
    return (
      <svg {...svgBaseProps}>
        <ellipse cx="160" cy="285" rx="75" ry="18" fill="#15803d" opacity="0.4" />
        {/* Melon bread dome body */}
        <circle cx="160" cy="165" r="75" fill="#bbf7d0" stroke="#16a34a" strokeWidth="5" />
        {/* Melon bread grid lines */}
        <path d="M100 135 L220 135" stroke="#4ade80" strokeWidth="4" />
        <path d="M90 165 L230 165" stroke="#4ade80" strokeWidth="4" />
        <path d="M100 195 L220 195" stroke="#4ade80" strokeWidth="4" />
        <path d="M130 100 L130 230" stroke="#4ade80" strokeWidth="4" />
        <path d="M160 90 L160 240" stroke="#4ade80" strokeWidth="4" />
        <path d="M190 100 L190 230" stroke="#4ade80" strokeWidth="4" />
        {/* Panda Ears */}
        <circle cx="110" cy="98" r="22" fill="#18181b" stroke="#09090b" strokeWidth="3" />
        <circle cx="210" cy="98" r="22" fill="#18181b" stroke="#09090b" strokeWidth="3" />
        {/* Panda Eye Patches */}
        <ellipse cx="132" cy="165" rx="16" ry="13" fill="#18181b" transform="rotate(-15 132 165)" />
        <circle cx="132" cy="165" r="5" fill="#ffffff" />
        <ellipse cx="188" cy="165" rx="16" ry="13" fill="#18181b" transform="rotate(15 188 165)" />
        <circle cx="188" cy="165" r="5" fill="#ffffff" />
        {/* Nose & Mouth */}
        <ellipse cx="160" cy="182" rx="7" ry="5" fill="#18181b" />
        <path d="M154 190 Q160 196 166 190" stroke="#18181b" strokeWidth="3" fill="none" />
        {/* Little Bamboo Leaf in mouth */}
        <path d="M166 190 Q190 185 195 200 Q180 198 166 190" fill="#22c55e" stroke="#15803d" strokeWidth="2" />
        {/* Panda Paws */}
        <circle cx="105" cy="245" r="18" fill="#18181b" stroke="#09090b" strokeWidth="3" />
        <circle cx="215" cy="245" r="18" fill="#18181b" stroke="#09090b" strokeWidth="3" />
      </svg>
    );
  }

  // 4. エビフライノセロス （エビフライ × サイ）
  if (type === 'fried_shrimp_rhino') {
    return (
      <svg {...svgBaseProps}>
        <ellipse cx="160" cy="285" rx="85" ry="18" fill="#d97706" opacity="0.4" />
        {/* Golden fried crispy body */}
        <ellipse cx="150" cy="190" rx="75" ry="55" fill="#f59e0b" stroke="#b45309" strokeWidth="4" />
        {/* Breadcrumb crunchy texture speckles */}
        <circle cx="120" cy="170" r="3" fill="#d97706" />
        <circle cx="140" cy="210" r="3" fill="#d97706" />
        <circle cx="170" cy="180" r="3" fill="#d97706" />
        <circle cx="160" cy="220" r="3" fill="#d97706" />
        {/* Rhino Head */}
        <circle cx="205" cy="175" r="38" fill="#fbbf24" stroke="#b45309" strokeWidth="4" />
        {/* Giant Red Shrimp Tail as Rhino Horn */}
        <g transform="translate(230, 100) rotate(15)">
          <path d="M0 60 L-10 10 L10 25 L25 5 L15 60 Z" fill="#ef4444" stroke="#b91c1c" strokeWidth="3.5" />
          <path d="M0 60 L10 25" stroke="#b91c1c" strokeWidth="2" />
        </g>
        {/* Tartar sauce dollop */}
        <ellipse cx="140" cy="155" rx="22" ry="10" fill="#fef08a" stroke="#ca8a04" strokeWidth="2" />
        <circle cx="135" cy="155" r="2" fill="#22c55e" />
        <circle cx="146" cy="156" r="2" fill="#ef4444" />
        {/* Cute Rhino Eye */}
        <circle cx="195" cy="165" r="7" fill="#18181b" />
        <circle cx="197" cy="163" r="2.5" fill="#ffffff" />
        {/* Legs */}
        <rect x="105" y="235" width="28" height="35" rx="8" fill="#d97706" stroke="#92400e" strokeWidth="3.5" />
        <rect x="175" y="235" width="28" height="35" rx="8" fill="#d97706" stroke="#92400e" strokeWidth="3.5" />
      </svg>
    );
  }

  // 5. たいやきシャーク （たいやき × サメ）
  if (type === 'taiyaki_shark') {
    return (
      <svg {...svgBaseProps}>
        <ellipse cx="160" cy="285" rx="85" ry="18" fill="#b45309" opacity="0.4" />
        {/* Taiyaki Body (Waffle fish) */}
        <path d="M60 160 Q120 90 220 120 Q260 160 220 200 Q120 230 60 160 Z" fill="#d97706" stroke="#78350f" strokeWidth="4.5" />
        {/* Shark Fin on top with waffle scales */}
        <path d="M150 115 L180 60 L195 110 Z" fill="#b45309" stroke="#78350f" strokeWidth="4" />
        {/* Taiyaki scale pattern */}
        <path d="M130 145 Q145 155 130 165" stroke="#78350f" strokeWidth="3" fill="none" />
        <path d="M150 145 Q165 155 150 165" stroke="#78350f" strokeWidth="3" fill="none" />
        <path d="M140 170 Q155 180 140 190" stroke="#78350f" strokeWidth="3" fill="none" />
        {/* Shark Tail fin */}
        <path d="M65 160 L25 110 L45 160 L20 210 Z" fill="#b45309" stroke="#78350f" strokeWidth="4" />
        {/* Anko (sweet red bean) oozing from mouth */}
        <ellipse cx="235" cy="165" rx="14" ry="10" fill="#450a0a" stroke="#7f1d1d" strokeWidth="2.5" />
        {/* Shark Eye */}
        <circle cx="210" cy="145" r="9" fill="#18181b" stroke="#ffffff" strokeWidth="2" />
        <circle cx="212" cy="143" r="3" fill="#ffffff" />
        {/* Shark Gill slits */}
        <line x1="185" y1="150" x2="185" y2="175" stroke="#78350f" strokeWidth="3" />
        <line x1="175" y1="152" x2="175" y2="173" stroke="#78350f" strokeWidth="3" />
      </svg>
    );
  }

  // 6. ドライヤーカメレオン （ドライヤー × カメレオン）
  if (type === 'dryer_chameleon') {
    return (
      <svg {...svgBaseProps}>
        <ellipse cx="160" cy="285" rx="80" ry="18" fill="#0891b2" opacity="0.4" />
        {/* Curled Cord Tail with electric plug */}
        <path d="M90 200 Q50 200 60 160 Q75 140 50 130 Q30 150 40 180" stroke="#164e63" strokeWidth="7" fill="none" strokeLinecap="round" />
        <rect x="25" y="170" width="16" height="12" rx="3" fill="#e2e8f0" stroke="#475569" strokeWidth="2" />
        <line x1="20" y1="173" x2="25" y2="173" stroke="#94a3b8" strokeWidth="2.5" />
        <line x1="20" y1="179" x2="25" y2="179" stroke="#94a3b8" strokeWidth="2.5" />
        {/* Dryer Chameleon Body */}
        <ellipse cx="150" cy="180" rx="65" ry="45" fill="#06b6d4" stroke="#0e7490" strokeWidth="4" />
        {/* Dryer Nozzle Head pointing right */}
        <path d="M190 155 L250 145 L250 195 L190 195 Z" fill="#0891b2" stroke="#164e63" strokeWidth="4" />
        <rect x="245" y="140" width="10" height="60" rx="3" fill="#e2e8f0" stroke="#475569" strokeWidth="2" />
        {/* Hot / Warm wind wave lines */}
        <path d="M265 150 Q285 155 295 145" stroke="#f97316" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M265 170 Q285 170 305 170" stroke="#facc15" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M265 190 Q285 185 295 195" stroke="#f97316" strokeWidth="3" fill="none" strokeLinecap="round" />
        {/* Chameleon Rolling Turret Eye */}
        <circle cx="165" cy="150" r="22" fill="#22d3ee" stroke="#0e7490" strokeWidth="4" />
        <circle cx="165" cy="150" r="14" fill="#0891b2" />
        <circle cx="168" cy="148" r="6" fill="#18181b" />
        <circle cx="170" cy="146" r="2" fill="#ffffff" />
        {/* Claws */}
        <circle cx="120" cy="235" r="12" fill="#0891b2" stroke="#0e7490" strokeWidth="3" />
        <circle cx="180" cy="235" r="12" fill="#0891b2" stroke="#0e7490" strokeWidth="3" />
      </svg>
    );
  }

  // 7. ルンバペンギン （お掃除ロボット × ペンギン）
  if (type === 'roomba_penguin') {
    return (
      <svg {...svgBaseProps}>
        <ellipse cx="160" cy="285" rx="85" ry="18" fill="#1e293b" opacity="0.5" />
        {/* Robotic Vacuum Base (Roomba disc) */}
        <ellipse cx="160" cy="245" rx="90" ry="28" fill="#334155" stroke="#0f172a" strokeWidth="5" />
        <ellipse cx="160" cy="240" rx="75" ry="20" fill="#1e293b" />
        {/* Glowing LED Power Button */}
        <circle cx="160" cy="240" r="8" fill="#38bdf8" stroke="#0284c7" strokeWidth="2" />
        {/* Spinning side cleaning brushes */}
        <line x1="85" y1="260" x2="65" y2="275" stroke="#22c55e" strokeWidth="4" strokeLinecap="round" />
        <line x1="235" y1="260" x2="255" y2="275" stroke="#22c55e" strokeWidth="4" strokeLinecap="round" />
        {/* Penguin Upper Body riding inside */}
        <ellipse cx="160" cy="155" rx="48" ry="60" fill="#09090b" stroke="#000000" strokeWidth="4" />
        <ellipse cx="160" cy="165" rx="30" ry="42" fill="#f8fafc" />
        {/* Penguin Flippers */}
        <ellipse cx="110" cy="165" rx="14" ry="30" fill="#09090b" transform="rotate(25 110 165)" />
        <ellipse cx="210" cy="165" rx="14" ry="30" fill="#09090b" transform="rotate(-25 210 165)" />
        {/* Pilot Aviator Goggles */}
        <rect x="130" y="118" width="26" height="20" rx="8" fill="#38bdf8" stroke="#0369a1" strokeWidth="3" />
        <rect x="164" y="118" width="26" height="20" rx="8" fill="#38bdf8" stroke="#0369a1" strokeWidth="3" />
        <line x1="156" y1="128" x2="164" y2="128" stroke="#475569" strokeWidth="4" />
        {/* Yellow Beak */}
        <polygon points="160,138 148,150 172,150" fill="#f59e0b" stroke="#b45309" strokeWidth="2.5" />
      </svg>
    );
  }

  // 8. てんとうむしカメラ （てんとう虫 × カメラ）
  if (type === 'camera_ladybug') {
    return (
      <svg {...svgBaseProps}>
        <ellipse cx="160" cy="285" rx="75" ry="18" fill="#dc2626" opacity="0.4" />
        {/* Round Red Ladybug Shell */}
        <circle cx="160" cy="165" r="75" fill="#ef4444" stroke="#991b1b" strokeWidth="5" />
        {/* Center seam line */}
        <line x1="160" y1="90" x2="160" y2="240" stroke="#18181b" strokeWidth="4" />
        {/* Ladybug spots as Camera Lenses with reflection */}
        <circle cx="120" cy="140" r="18" fill="#1e293b" stroke="#0f172a" strokeWidth="3" />
        <circle cx="120" cy="140" r="10" fill="#0284c7" />
        <circle cx="117" cy="137" r="3" fill="#ffffff" />

        <circle cx="200" cy="140" r="18" fill="#1e293b" stroke="#0f172a" strokeWidth="3" />
        <circle cx="200" cy="140" r="10" fill="#0284c7" />
        <circle cx="197" cy="137" r="3" fill="#ffffff" />

        <circle cx="125" cy="195" r="16" fill="#1e293b" stroke="#0f172a" strokeWidth="3" />
        <circle cx="195" cy="195" r="16" fill="#1e293b" stroke="#0f172a" strokeWidth="3" />

        {/* Head with Shutter Button and Pop-up Flash */}
        <ellipse cx="160" cy="90" rx="35" ry="22" fill="#18181b" stroke="#09090b" strokeWidth="3" />
        {/* Camera Flash Box on head */}
        <rect x="145" y="55" width="30" height="20" rx="4" fill="#e2e8f0" stroke="#475569" strokeWidth="2.5" />
        <circle cx="160" cy="65" r="5" fill="#facc15" />
        {/* Shutter Button */}
        <rect x="185" y="60" width="10" height="12" rx="2" fill="#ef4444" />
        {/* Antennae */}
        <path d="M140 75 Q125 50 115 55" stroke="#18181b" strokeWidth="3" fill="none" />
        <circle cx="115" cy="55" r="4" fill="#ef4444" />
        <path d="M180 75 Q195 50 205 55" stroke="#18181b" strokeWidth="3" fill="none" />
        <circle cx="205" cy="55" r="4" fill="#ef4444" />
      </svg>
    );
  }

  // 9. トースターウサギ （トースター × ウサギ）
  if (type === 'toaster_rabbit') {
    return (
      <svg {...svgBaseProps}>
        <ellipse cx="160" cy="285" rx="80" ry="18" fill="#64748b" opacity="0.4" />
        {/* Toast Bread Slices popping up as Rabbit Ears! */}
        <g>
          {/* Left Bread Ear */}
          <path d="M120 120 L115 45 Q125 35 135 45 L140 120 Z" fill="#fed7aa" stroke="#ca8a04" strokeWidth="3.5" />
          <path d="M122 110 L118 55 Q125 48 132 55 L135 110 Z" fill="#ea580c" opacity="0.4" />
          {/* Right Bread Ear */}
          <path d="M180 120 L175 45 Q185 35 195 45 L200 120 Z" fill="#fed7aa" stroke="#ca8a04" strokeWidth="3.5" />
          <path d="M182 110 L178 55 Q185 48 192 55 L195 110 Z" fill="#ea580c" opacity="0.4" />
        </g>
        {/* Shiny Chrome Toaster Body */}
        <rect x="95" y="120" width="130" height="120" rx="24" fill="#cbd5e1" stroke="#475569" strokeWidth="5" />
        {/* Highlight sheen */}
        <rect x="105" y="130" width="20" height="95" rx="8" fill="#f8fafc" opacity="0.6" />
        {/* Toaster Slots on top */}
        <rect x="115" y="116" width="30" height="8" rx="3" fill="#1e293b" />
        <rect x="175" y="116" width="30" height="8" rx="3" fill="#1e293b" />
        {/* Cute Rabbit Face on toaster */}
        <circle cx="140" cy="165" r="7" fill="#1e293b" />
        <circle cx="142" cy="163" r="2.5" fill="#ffffff" />
        <circle cx="180" cy="165" r="7" fill="#1e293b" />
        <circle cx="182" cy="163" r="2.5" fill="#ffffff" />
        <polygon points="160,175 154,183 166,183" fill="#f43f5e" />
        <path d="M154 186 Q160 192 166 186" stroke="#475569" strokeWidth="2.5" fill="none" />
        {/* Toaster Slider Lever & Timer Knob */}
        <rect x="225" y="150" width="14" height="8" rx="2" fill="#ef4444" />
        <circle cx="160" cy="215" r="10" fill="#64748b" stroke="#334155" strokeWidth="2" />
        <line x1="160" y1="215" x2="160" y2="209" stroke="#ffffff" strokeWidth="2" />
        {/* Feet */}
        <rect x="110" y="240" width="24" height="15" rx="6" fill="#334155" />
        <rect x="186" y="240" width="24" height="15" rx="6" fill="#334155" />
      </svg>
    );
  }

  // 10. テレビオオカミ （テレビ × オオカミ）
  if (type === 'tv_wolf') {
    return (
      <svg {...svgBaseProps}>
        <ellipse cx="160" cy="285" rx="80" ry="18" fill="#4338ca" opacity="0.4" />
        {/* TV Antenna Ears */}
        <line x1="130" y1="95" x2="100" y2="45" stroke="#94a3b8" strokeWidth="5" strokeLinecap="round" />
        <circle cx="98" cy="42" r="6" fill="#ef4444" />
        <line x1="190" y1="95" x2="220" y2="45" stroke="#94a3b8" strokeWidth="5" strokeLinecap="round" />
        <circle cx="222" cy="42" r="6" fill="#ef4444" />
        {/* Retro Wooden / Indigo CRT TV Body */}
        <rect x="90" y="90" width="140" height="120" rx="18" fill="#312e81" stroke="#1e1b4b" strokeWidth="5" />
        {/* Glowing TV Screen with Howling Wolf Face */}
        <rect x="105" y="105" width="85" height="90" rx="12" fill="#4338ca" stroke="#6366f1" strokeWidth="3" />
        {/* Pixel / Screen Static Wolf Eyes */}
        <ellipse cx="132" cy="135" rx="8" ry="6" fill="#38bdf8" />
        <circle cx="132" cy="135" r="3" fill="#ffffff" />
        <ellipse cx="162" cy="135" rx="8" ry="6" fill="#38bdf8" />
        <circle cx="162" cy="135" r="3" fill="#ffffff" />
        {/* Wolf Muzzle & Fangs */}
        <polygon points="147,150 140,165 154,165" fill="#e0e7ff" />
        <polygon points="142,165 144,172 147,165" fill="#ffffff" />
        <polygon points="148,165 151,172 153,165" fill="#ffffff" />
        {/* TV Knobs on right */}
        <circle cx="210" cy="125" r="9" fill="#1e1b4b" stroke="#6366f1" strokeWidth="2" />
        <circle cx="210" cy="155" r="9" fill="#1e1b4b" stroke="#6366f1" strokeWidth="2" />
        <line x1="205" y1="180" x2="218" y2="180" stroke="#6366f1" strokeWidth="3" />
        {/* Wolf Paws / Claws */}
        <rect x="110" y="210" width="28" height="50" rx="8" fill="#312e81" stroke="#1e1b4b" strokeWidth="4" />
        <rect x="182" y="210" width="28" height="50" rx="8" fill="#312e81" stroke="#1e1b4b" strokeWidth="4" />
        <circle cx="118" cy="258" r="3" fill="#e0e7ff" />
        <circle cx="128" cy="258" r="3" fill="#e0e7ff" />
        <circle cx="190" cy="258" r="3" fill="#e0e7ff" />
        <circle cx="200" cy="258" r="3" fill="#e0e7ff" />
      </svg>
    );
  }

  // 11. ボクシングコアラ （ボクシング × コアラ）
  if (type === 'boxing_koala') {
    return (
      <svg {...svgBaseProps}>
        <ellipse cx="160" cy="285" rx="80" ry="18" fill="#dc2626" opacity="0.4" />
        {/* Koala Fluffy Round Ears */}
        <circle cx="105" cy="115" r="30" fill="#9ca3af" stroke="#4b5563" strokeWidth="4" />
        <circle cx="105" cy="115" r="18" fill="#f3f4f6" />
        <circle cx="215" cy="115" r="30" fill="#9ca3af" stroke="#4b5563" strokeWidth="4" />
        <circle cx="215" cy="115" r="18" fill="#f3f4f6" />
        {/* Koala Head & Body */}
        <ellipse cx="160" cy="160" r="52" fill="#9ca3af" stroke="#4b5563" strokeWidth="4" />
        {/* Blue Sport Sweatband on Forehead */}
        <rect x="118" y="125" width="84" height="15" rx="6" fill="#2563eb" stroke="#1d4ed8" strokeWidth="2.5" />
        {/* Big Oval Black Nose */}
        <ellipse cx="160" cy="170" rx="16" ry="22" fill="#1f2937" stroke="#111827" strokeWidth="2" />
        {/* Eyes with fiery boxing fighting spirit */}
        <circle cx="138" cy="155" r="7" fill="#111827" />
        <polygon points="137,153 140,157 135,157" fill="#facc15" />
        <circle cx="182" cy="155" r="7" fill="#111827" />
        <polygon points="181,153 184,157 179,157" fill="#facc15" />
        {/* Giant Red Boxing Gloves in guard stance */}
        <circle cx="115" cy="200" r="28" fill="#ef4444" stroke="#991b1b" strokeWidth="4" />
        <circle cx="115" cy="195" r="14" fill="#dc2626" opacity="0.6" />
        <circle cx="205" cy="200" r="28" fill="#ef4444" stroke="#991b1b" strokeWidth="4" />
        <circle cx="205" cy="195" r="14" fill="#dc2626" opacity="0.6" />
        {/* Eucalyptus leaf in mouth */}
        <path d="M152 195 Q140 205 130 195 Q140 188 152 195" fill="#22c55e" stroke="#15803d" strokeWidth="2" />
      </svg>
    );
  }

  // 12. テニスラプトル （テニス × ヴェロキラプトル）
  if (type === 'tennis_raptor') {
    return (
      <svg {...svgBaseProps}>
        <ellipse cx="160" cy="285" rx="85" ry="18" fill="#65a30d" opacity="0.4" />
        {/* Raptor Body */}
        <ellipse cx="140" cy="195" rx="55" ry="45" fill="#84cc16" stroke="#4d7c0f" strokeWidth="4" />
        {/* Long tail */}
        <path d="M90 200 Q40 220 20 180" stroke="#84cc16" strokeWidth="16" fill="none" strokeLinecap="round" />
        {/* Raptor Snout & Head */}
        <path d="M150 160 L210 135 Q225 155 205 170 L160 180 Z" fill="#84cc16" stroke="#4d7c0f" strokeWidth="4" />
        {/* White Sports Visor cap */}
        <path d="M150 130 Q180 120 220 130" stroke="#f8fafc" strokeWidth="8" strokeLinecap="round" />
        {/* Sharp Raptor eye & grin */}
        <circle cx="170" cy="145" r="6" fill="#eab308" />
        <circle cx="171" cy="144" r="2.5" fill="#000000" />
        <polygon points="185,160 190,167 193,160" fill="#ffffff" />
        <polygon points="195,158 200,165 203,158" fill="#ffffff" />
        {/* Tennis Racket in hand */}
        <ellipse cx="230" cy="175" rx="24" ry="32" fill="none" stroke="#ef4444" strokeWidth="5" />
        <line x1="230" y1="145" x2="230" y2="205" stroke="#ef4444" strokeWidth="2" />
        <line x1="210" y1="175" x2="250" y2="175" stroke="#ef4444" strokeWidth="2" />
        <line x1="225" y1="205" x2="210" y2="235" stroke="#78716c" strokeWidth="6" strokeLinecap="round" />
        {/* Fluorescent Tennis Ball with speed lines */}
        <circle cx="265" cy="130" r="12" fill="#ccfbf1" stroke="#14b8a6" strokeWidth="3" />
        <line x1="285" y1="120" x2="300" y2="115" stroke="#facc15" strokeWidth="3" strokeLinecap="round" />
        <line x1="285" y1="135" x2="305" y2="135" stroke="#facc15" strokeWidth="3" strokeLinecap="round" />
        {/* Legs with Sickle Claws */}
        <rect x="120" y="235" width="22" height="35" rx="6" fill="#65a30d" />
        <rect x="165" y="235" width="22" height="35" rx="6" fill="#65a30d" />
      </svg>
    );
  }

  // 13. 野球ウマ （野球 × ウマ）
  if (type === 'baseball_horse') {
    return (
      <svg {...svgBaseProps}>
        <ellipse cx="160" cy="285" rx="80" ry="18" fill="#1d4ed8" opacity="0.4" />
        {/* Horse Body in Pinstripe Baseball Uniform */}
        <ellipse cx="160" cy="210" rx="55" ry="50" fill="#f8fafc" stroke="#1e3a8a" strokeWidth="4" />
        <line x1="140" y1="175" x2="140" y2="250" stroke="#3b82f6" strokeWidth="2.5" />
        <line x1="160" y1="175" x2="160" y2="255" stroke="#3b82f6" strokeWidth="2.5" />
        <line x1="180" y1="175" x2="180" y2="250" stroke="#3b82f6" strokeWidth="2.5" />
        {/* Horse Head & Mane */}
        <polygon points="120,105 130,70 145,100" fill="#92400e" stroke="#451a03" strokeWidth="2.5" />
        <polygon points="180,105 170,70 155,100" fill="#92400e" stroke="#451a03" strokeWidth="2.5" />
        <ellipse cx="160" cy="140" rx="38" ry="48" fill="#b45309" stroke="#78350f" strokeWidth="4" />
        {/* Baseball Cap */}
        <path d="M125 110 Q160 85 195 110 Z" fill="#1d4ed8" stroke="#1e3a8a" strokeWidth="3" />
        <path d="M125 110 L95 115" stroke="#1d4ed8" strokeWidth="8" strokeLinecap="round" />
        <text x="160" y="105" textAnchor="middle" fontWeight="bold" fontSize="12" fill="#ffffff">H</text>
        {/* Snout with Nostrils */}
        <ellipse cx="160" cy="165" rx="22" ry="15" fill="#fde68a" stroke="#78350f" strokeWidth="3" />
        <circle cx="152" cy="165" r="4" fill="#78350f" />
        <circle cx="168" cy="165" r="4" fill="#78350f" />
        {/* Wooden Baseball Bat */}
        <line x1="205" y1="220" x2="255" y2="120" stroke="#ca8a04" strokeWidth="10" strokeLinecap="round" />
        {/* Red Baseball Stitching in glove */}
        <circle cx="105" cy="205" r="18" fill="#92400e" stroke="#451a03" strokeWidth="3" />
        <circle cx="105" cy="205" r="9" fill="#f8fafc" stroke="#dc2626" strokeWidth="2" strokeDasharray="3 2" />
      </svg>
    );
  }

  // 14. ボウリングゴリラ （ボクシング... ボウリング × ゴリラ）
  if (type === 'bowling_gorilla') {
    return (
      <svg {...svgBaseProps}>
        <ellipse cx="160" cy="285" rx="85" ry="18" fill="#18181b" opacity="0.4" />
        {/* Massive Gorilla Chest & Arms */}
        <ellipse cx="160" cy="195" rx="72" ry="58" fill="#3f3f46" stroke="#18181b" strokeWidth="5" />
        <circle cx="95" cy="210" r="30" fill="#3f3f46" stroke="#18181b" strokeWidth="4" />
        <circle cx="225" cy="210" r="30" fill="#3f3f46" stroke="#18181b" strokeWidth="4" />
        {/* Gorilla Crest Head */}
        <path d="M130 145 C130 95 190 95 190 145 Z" fill="#27272a" stroke="#18181b" strokeWidth="4" />
        {/* Heavy Brow & Eyes */}
        <rect x="132" y="130" width="56" height="15" rx="6" fill="#18181b" />
        <circle cx="145" cy="148" r="5" fill="#facc15" />
        <circle cx="175" cy="148" r="5" fill="#facc15" />
        {/* Wide Snout */}
        <ellipse cx="160" cy="165" rx="22" ry="14" fill="#71717a" stroke="#18181b" strokeWidth="3" />
        <circle cx="152" cy="165" r="4" fill="#18181b" />
        <circle cx="168" cy="165" r="4" fill="#18181b" />
        {/* Big Swirling Bowling Ball held in front */}
        <circle cx="160" cy="235" r="32" fill="#7c3aed" stroke="#4c1d95" strokeWidth="4" />
        <circle cx="152" cy="225" r="4" fill="#ffffff" />
        <circle cx="168" cy="225" r="4" fill="#ffffff" />
        <circle cx="160" cy="242" r="4" fill="#ffffff" />
        {/* Bowling Pin Crest Emblem */}
        <polygon points="160,110 163,122 157,122" fill="#ef4444" />
      </svg>
    );
  }

  // 15. スイミングカッパ （水泳 × カッパ）
  if (type === 'swimming_kappa') {
    return (
      <svg {...svgBaseProps}>
        <ellipse cx="160" cy="285" rx="80" ry="18" fill="#0d9488" opacity="0.4" />
        {/* Water Splash Ring */}
        <path d="M90 270 Q160 250 230 270 Q160 290 90 270 Z" fill="#67e8f9" opacity="0.7" />
        {/* Kappa Head with Water Plate (Sara) */}
        <circle cx="160" cy="155" r="50" fill="#4ade80" stroke="#15803d" strokeWidth="4" />
        {/* Golden Plate (Sara) with water */}
        <ellipse cx="160" cy="110" rx="35" ry="14" fill="#ca8a04" stroke="#854d0e" strokeWidth="3" />
        <ellipse cx="160" cy="108" rx="26" ry="8" fill="#38bdf8" />
        {/* Blue Swimming Goggles */}
        <rect x="130" y="135" width="25" height="18" rx="7" fill="#38bdf8" stroke="#0284c7" strokeWidth="3" />
        <rect x="165" y="135" width="25" height="18" rx="7" fill="#38bdf8" stroke="#0284c7" strokeWidth="3" />
        <line x1="155" y1="144" x2="165" y2="144" stroke="#0284c7" strokeWidth="3" />
        <line x1="110" y1="144" x2="130" y2="144" stroke="#0284c7" strokeWidth="3" />
        <line x1="190" y1="144" x2="210" y2="144" stroke="#0284c7" strokeWidth="3" />
        {/* Kappa Duck Beak */}
        <ellipse cx="160" cy="168" rx="18" ry="12" fill="#facc15" stroke="#ca8a04" strokeWidth="3" />
        {/* Red Kickboard Float held in hands */}
        <rect x="115" y="200" width="90" height="45" rx="12" fill="#ef4444" stroke="#991b1b" strokeWidth="4" />
        <text x="160" y="228" textAnchor="middle" fontWeight="black" fontSize="14" fill="#ffffff">SPEED</text>
        {/* Webbed green hands */}
        <circle cx="120" cy="205" r="10" fill="#22c55e" stroke="#15803d" strokeWidth="2" />
        <circle cx="200" cy="205" r="10" fill="#22c55e" stroke="#15803d" strokeWidth="2" />
      </svg>
    );
  }

  // 16. パトカーキツネ （パトカー × キツネ）
  if (type === 'patrol_fox') {
    return (
      <svg {...svgBaseProps}>
        <ellipse cx="160" cy="285" rx="85" ry="18" fill="#0284c7" opacity="0.4" />
        {/* Fox Pointy Ears with police check pattern */}
        <polygon points="110,135 90,65 140,105" fill="#ea580c" stroke="#9a3412" strokeWidth="3.5" />
        <polygon points="115,125 102,80 135,105" fill="#f8fafc" />
        <polygon points="210,135 230,65 180,105" fill="#ea580c" stroke="#9a3412" strokeWidth="3.5" />
        <polygon points="205,125 218,80 185,105" fill="#f8fafc" />
        {/* Police Flashing Siren on head between ears */}
        <rect x="145" y="70" width="30" height="18" rx="4" fill="#ef4444" stroke="#991b1b" strokeWidth="2" />
        <circle cx="152" cy="79" r="4" fill="#38bdf8" />
        <circle cx="168" cy="79" r="4" fill="#f87171" />
        {/* Fox Head */}
        <polygon points="160,195 105,135 215,135" fill="#ea580c" stroke="#9a3412" strokeWidth="4" />
        <polygon points="160,195 125,150 195,150" fill="#f8fafc" />
        {/* Fox Eyes */}
        <ellipse cx="140" cy="138" rx="8" ry="5" fill="#18181b" transform="rotate(-15 140 138)" />
        <ellipse cx="180" cy="138" rx="8" ry="5" fill="#18181b" transform="rotate(15 180 138)" />
        <circle cx="160" cy="190" r="6" fill="#18181b" />
        {/* Patrol Car Body Lower */}
        <rect x="100" y="200" width="120" height="55" rx="14" fill="#f8fafc" stroke="#0f172a" strokeWidth="4" />
        <rect x="100" y="225" width="120" height="30" rx="6" fill="#09090b" />
        <text x="160" y="220" textAnchor="middle" fontWeight="black" fontSize="14" fill="#09090b">POLICE</text>
        {/* Patrol Car Wheels */}
        <circle cx="115" cy="260" r="14" fill="#18181b" stroke="#64748b" strokeWidth="3" />
        <circle cx="205" cy="260" r="14" fill="#18181b" stroke="#64748b" strokeWidth="3" />
      </svg>
    );
  }

  // 17. ドリルモグラ （ドリル車 × モグラ）
  if (type === 'drill_mole') {
    return (
      <svg {...svgBaseProps}>
        <ellipse cx="160" cy="285" rx="80" ry="18" fill="#78350f" opacity="0.4" />
        {/* Mole Body */}
        <ellipse cx="160" cy="195" rx="65" ry="60" fill="#57534e" stroke="#292524" strokeWidth="4" />
        {/* Yellow Construction Hard Hat with Headlamp */}
        <path d="M110 130 C110 85 210 85 210 130 Z" fill="#eab308" stroke="#a16207" strokeWidth="4" />
        <rect x="95" y="125" width="130" height="12" rx="4" fill="#ca8a04" stroke="#854d0e" strokeWidth="2" />
        <circle cx="160" cy="100" r="10" fill="#fef08a" stroke="#ca8a04" strokeWidth="2" />
        {/* Mole Squint Eyes */}
        <line x1="130" y1="150" x2="145" y2="150" stroke="#1c1917" strokeWidth="4" strokeLinecap="round" />
        <line x1="175" y1="150" x2="190" y2="150" stroke="#1c1917" strokeWidth="4" strokeLinecap="round" />
        {/* Giant Metallic Spinning Spiral Drill Nose */}
        <path d="M140 165 L180 165 L160 235 Z" fill="#94a3b8" stroke="#334155" strokeWidth="4" />
        <path d="M145 180 Q160 190 175 180" stroke="#cbd5e1" strokeWidth="3" fill="none" />
        <path d="M150 200 Q160 210 170 200" stroke="#cbd5e1" strokeWidth="3" fill="none" />
        {/* Mole Digging Claws */}
        <path d="M95 190 L75 220 L90 225 L105 200 Z" fill="#a8a29e" stroke="#292524" strokeWidth="3" />
        <path d="M225 190 L245 220 L230 225 L215 200 Z" fill="#a8a29e" stroke="#292524" strokeWidth="3" />
        {/* Soil & Rock particles flying */}
        <circle cx="70" cy="240" r="4" fill="#78350f" />
        <circle cx="250" cy="240" r="4" fill="#78350f" />
      </svg>
    );
  }

  // 18. ショベルカーザウルス （ショベルカー × 首長竜）
  if (type === 'excavator_saurus') {
    return (
      <svg {...svgBaseProps}>
        <ellipse cx="160" cy="285" rx="85" ry="18" fill="#ca8a04" opacity="0.4" />
        {/* Caterpillar Tank Treads Base */}
        <rect x="90" y="245" width="140" height="24" rx="10" fill="#1f2937" stroke="#111827" strokeWidth="4" />
        <circle cx="108" cy="257" r="7" fill="#6b7280" />
        <circle cx="134" cy="257" r="7" fill="#6b7280" />
        <circle cx="160" cy="257" r="7" fill="#6b7280" />
        <circle cx="186" cy="257" r="7" fill="#6b7280" />
        <circle cx="212" cy="257" r="7" fill="#6b7280" />
        {/* Cabin Body */}
        <rect x="110" y="195" width="85" height="52" rx="10" fill="#eab308" stroke="#a16207" strokeWidth="4" />
        <rect x="120" y="202" width="30" height="25" rx="4" fill="#38bdf8" stroke="#0284c7" strokeWidth="2" />
        {/* Hydraulic Excavator Arm as Long Brachiosaurus Neck */}
        <line x1="180" y1="210" x2="215" y2="120" stroke="#ca8a04" strokeWidth="12" strokeLinecap="round" />
        <line x1="215" y1="120" x2="250" y2="85" stroke="#eab308" strokeWidth="10" strokeLinecap="round" />
        <circle cx="215" cy="120" r="8" fill="#18181b" />
        {/* Hydraulic Piston Cylinders */}
        <line x1="170" y1="190" x2="200" y2="140" stroke="#94a3b8" strokeWidth="4" />
        {/* Shovel Bucket as Dinosaur Head & Jaw */}
        <path d="M245 75 L285 75 L275 110 L240 100 Z" fill="#a16207" stroke="#713f12" strokeWidth="3.5" />
        {/* Sharp Digger Bucket Teeth */}
        <polygon points="275,110 270,120 265,110" fill="#e2e8f0" />
        <polygon points="265,110 260,120 255,110" fill="#e2e8f0" />
        <polygon points="255,110 250,120 245,110" fill="#e2e8f0" />
        {/* Dinosaur Eye on shovel head */}
        <circle cx="260" cy="88" r="5" fill="#facc15" />
        <circle cx="261" cy="88" r="2" fill="#000000" />
      </svg>
    );
  }

  // 19. ヘリコプタカ （ヘリコプター × タカ）
  if (type === 'helicopter_hawk') {
    return (
      <svg {...svgBaseProps}>
        <ellipse cx="160" cy="285" rx="80" ry="18" fill="#0284c7" opacity="0.4" />
        {/* Spinning Helicopter Rotor Blades on Head */}
        <line x1="70" y1="65" x2="250" y2="65" stroke="#64748b" strokeWidth="6" strokeLinecap="round" />
        <circle cx="160" cy="65" r="8" fill="#0f172a" />
        <line x1="160" y1="65" x2="160" y2="90" stroke="#0f172a" strokeWidth="5" />
        {/* Soaring Hawk Wings */}
        <path d="M120 160 L30 115 L60 160 L45 190 L110 185 Z" fill="#0369a1" stroke="#075985" strokeWidth="3.5" />
        <path d="M200 160 L290 115 L260 160 L275 190 L210 185 Z" fill="#0369a1" stroke="#075985" strokeWidth="3.5" />
        {/* Helicopter Cockpit Bubble / Hawk Head */}
        <ellipse cx="160" cy="140" rx="42" ry="48" fill="#0284c7" stroke="#075985" strokeWidth="4" />
        {/* Cockpit Glass Visor */}
        <path d="M130 120 Q160 100 190 120 L185 150 Q160 160 135 150 Z" fill="#7dd3fc" stroke="#0284c7" strokeWidth="2.5" />
        {/* Sharp Golden Hawk Beak */}
        <polygon points="160,150 148,168 172,168" fill="#facc15" stroke="#ca8a04" strokeWidth="2.5" />
        {/* Hawk Eyes */}
        <circle cx="145" cy="132" r="5" fill="#18181b" />
        <circle cx="175" cy="132" r="5" fill="#18181b" />
        {/* Helicopter Landing Skids as Talons */}
        <line x1="120" y1="235" x2="120" y2="255" stroke="#334155" strokeWidth="4" />
        <line x1="100" y1="255" x2="140" y2="255" stroke="#334155" strokeWidth="5" strokeLinecap="round" />
        <line x1="200" y1="235" x2="200" y2="255" stroke="#334155" strokeWidth="4" />
        <line x1="180" y1="255" x2="220" y2="255" stroke="#334155" strokeWidth="5" strokeLinecap="round" />
      </svg>
    );
  }

  // 20. チャリンコラッコ （自転車 × ラッコ）
  if (type === 'bicycle_otter') {
    return (
      <svg {...svgBaseProps}>
        <ellipse cx="160" cy="285" rx="85" ry="18" fill="#0284c7" opacity="0.4" />
        {/* Bicycle Wheels */}
        <circle cx="105" cy="245" r="24" fill="none" stroke="#e2e8f0" strokeWidth="4" />
        <circle cx="105" cy="245" r="5" fill="#0f172a" />
        <circle cx="215" cy="245" r="24" fill="none" stroke="#e2e8f0" strokeWidth="4" />
        <circle cx="215" cy="245" r="5" fill="#0f172a" />
        {/* Bicycle Frame */}
        <line x1="105" y1="245" x2="150" y2="245" stroke="#ef4444" strokeWidth="5" />
        <line x1="150" y1="245" x2="185" y2="195" stroke="#ef4444" strokeWidth="5" />
        <line x1="105" y1="245" x2="140" y2="195" stroke="#ef4444" strokeWidth="5" />
        <line x1="140" y1="195" x2="185" y2="195" stroke="#ef4444" strokeWidth="5" />
        <line x1="185" y1="195" x2="215" y2="245" stroke="#ef4444" strokeWidth="5" />
        {/* Handlebars with bell */}
        <line x1="185" y1="195" x2="195" y2="165" stroke="#64748b" strokeWidth="4" />
        <path d="M185 165 L210 165" stroke="#0f172a" strokeWidth="5" strokeLinecap="round" />
        <circle cx="205" cy="160" r="4" fill="#facc15" />
        {/* Cute Sea Otter Riding */}
        <ellipse cx="145" cy="165" rx="35" ry="42" fill="#78350f" stroke="#451a03" strokeWidth="4" />
        {/* White Otter Belly */}
        <ellipse cx="148" cy="172" rx="20" ry="24" fill="#fef3c7" />
        {/* Otter Head */}
        <circle cx="145" cy="120" r="28" fill="#92400e" stroke="#451a03" strokeWidth="3.5" />
        {/* Snout & Whiskers */}
        <ellipse cx="145" cy="128" rx="14" ry="10" fill="#fef3c7" />
        <ellipse cx="145" cy="125" rx="5" ry="3.5" fill="#18181b" />
        {/* Eyes */}
        <circle cx="135" cy="115" r="4" fill="#18181b" />
        <circle cx="155" cy="115" r="4" fill="#18181b" />
        {/* Tiny Sea Shell held with one hand */}
        <circle cx="120" cy="160" r="8" fill="#f43f5e" stroke="#9f1239" strokeWidth="1.5" />
        {/* Bicycle Helmet on Otter */}
        <path d="M120 110 C120 85 170 85 170 110 Z" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="3" />
      </svg>
    );
  }

  // 21. クルマ・ザ・マッハ （スーパーカー × ロボットランナー）
  if (type === 'car_the_mach') {
    return (
      <svg {...svgBaseProps}>
        <defs>
          <linearGradient id="carBodyGrad" x1="0%" y1="0%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="60%" stopColor="#dc2626" />
            <stop offset="100%" stopColor="#991b1b" />
          </linearGradient>
          <linearGradient id="flameGrad" x1="100%" y1="50%" x2="0%" y2="50%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="30%" stopColor="#f59e0b" />
            <stop offset="70%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#7f1d1d" />
          </linearGradient>
          <linearGradient id="silverJoint" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f1f5f9" />
            <stop offset="50%" stopColor="#94a3b8" />
            <stop offset="100%" stopColor="#475569" />
          </linearGradient>
          <linearGradient id="windshieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
        </defs>

        {/* 1. 地面の影と摩擦スパーク */}
        <ellipse cx="160" cy="285" rx="100" ry="16" fill="#881337" opacity="0.5" />
        {/* 前足の下の青白い摩擦スパーク */}
        <path d="M230 280 L285 270 L250 282 L290 280 L240 288 Z" fill="#38bdf8" opacity="0.8" />
        <path d="M225 282 L260 278 L240 285 Z" fill="#ffffff" />
        {/* 後ろ足の土煙クラウド */}
        <ellipse cx="55" cy="265" rx="28" ry="18" fill="#a8a29e" opacity="0.6" />
        <ellipse cx="40" cy="255" rx="20" ry="14" fill="#d6d3d1" opacity="0.5" />
        <ellipse cx="70" cy="270" rx="18" ry="12" fill="#78716c" opacity="0.6" />

        {/* 2. ジェット噴射の炎（後方マフラーから） */}
        {/* 上段の炎 */}
        <path d="M95 125 C60 115 40 100 15 110 C45 125 65 130 95 132 Z" fill="url(#flameGrad)" />
        <path d="M90 126 C65 120 50 110 30 115 C55 125 70 128 90 130 Z" fill="#fef08a" />
        {/* 下段の炎 */}
        <path d="M85 145 C50 145 25 135 5 150 C35 158 55 155 85 152 Z" fill="url(#flameGrad)" />
        <path d="M80 146 C55 146 35 140 20 148 C45 152 65 150 80 149 Z" fill="#fef08a" />
        {/* デュアルマフラー排気管 */}
        <rect x="90" y="118" width="22" height="15" rx="3" fill="url(#silverJoint)" stroke="#1e293b" strokeWidth="2" />
        <rect x="80" y="140" width="22" height="15" rx="3" fill="url(#silverJoint)" stroke="#1e293b" strokeWidth="2" />

        {/* スピード風切り線 */}
        <line x1="140" y1="85" x2="35" y2="85" stroke="#f43f5e" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
        <line x1="170" y1="70" x2="100" y2="70" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
        <line x1="120" y1="175" x2="30" y2="175" stroke="#f43f5e" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />

        {/* 3. 後ろ足（後方へ強く蹴り出すロボ脚） */}
        {/* 股関節 */}
        <circle cx="150" cy="195" r="14" fill="url(#silverJoint)" stroke="#1e293b" strokeWidth="2.5" />
        {/* 太ももアーマー */}
        <path d="M145 200 L95 240 L108 248 L155 205 Z" fill="url(#carBodyGrad)" stroke="#7f1d1d" strokeWidth="2.5" />
        <line x1="140" y1="205" x2="105" y2="238" stroke="url(#silverJoint)" strokeWidth="4" />
        {/* 膝関節 */}
        <circle cx="95" cy="245" r="11" fill="url(#silverJoint)" stroke="#1e293b" strokeWidth="2.5" />
        {/* すねアーマー */}
        <path d="M92 250 L65 270 L72 278 L100 252 Z" fill="url(#carBodyGrad)" stroke="#7f1d1d" strokeWidth="2.5" />
        {/* レーシングスニーカー（後ろ足） */}
        <path d="M65 270 L52 285 L72 292 L82 278 Z" fill="#dc2626" stroke="#0f172a" strokeWidth="2.5" />
        <path d="M52 285 L46 295 L68 300 L72 292 Z" fill="#0f172a" />
        <line x1="46" y1="298" x2="68" y2="301" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />

        {/* 4. 前足（前方に大きく踏み出すロボ脚） */}
        {/* 前脚の太ももアーマー */}
        <path d="M165 195 L215 225 L205 238 L158 205 Z" fill="url(#carBodyGrad)" stroke="#7f1d1d" strokeWidth="2.5" />
        <line x1="168" y1="200" x2="205" y2="225" stroke="url(#silverJoint)" strokeWidth="4" />
        {/* 前膝メカ関節 */}
        <circle cx="212" cy="230" r="12" fill="url(#silverJoint)" stroke="#1e293b" strokeWidth="2.5" />
        {/* 前すねガード */}
        <path d="M212 235 L255 270 L245 280 L205 242 Z" fill="url(#carBodyGrad)" stroke="#7f1d1d" strokeWidth="2.5" />
        <polygon points="218,245 242,268 236,274 212,250" fill="url(#silverJoint)" />
        {/* 足首メカ関節 ＆ レーシングスニーカー */}
        <circle cx="252" cy="272" r="8" fill="url(#silverJoint)" stroke="#1e293b" strokeWidth="2" />
        <path d="M250 270 L280 278 L275 292 L245 284 Z" fill="#dc2626" stroke="#0f172a" strokeWidth="2.5" />
        {/* 白いソール */}
        <path d="M245 284 L275 292 L282 290 L285 282" stroke="#ffffff" strokeWidth="3.5" fill="none" strokeLinecap="round" />

        {/* 5. 真紅のスポーツカーボディシェル */}
        {/* 車体メイン */}
        <path
          d="M95 160 C90 135 110 120 155 115 C190 100 240 125 265 145 C275 152 278 160 270 168 C240 178 185 178 105 170 Z"
          fill="url(#carBodyGrad)"
          stroke="#7f1d1d"
          strokeWidth="3.5"
        />
        {/* ボディサイドの艶やかなハイライトライン */}
        <path d="M125 142 Q190 130 250 148" stroke="#ffffff" strokeWidth="3" fill="none" opacity="0.6" strokeLinecap="round" />

        {/* フロントガラス ＆ サイドウィンドウ */}
        <path
          d="M152 118 C185 105 215 125 228 135 L160 138 Z"
          fill="url(#windshieldGrad)"
          stroke="#475569"
          strokeWidth="2"
        />
        {/* ウィンドウ反射光 */}
        <line x1="175" y1="115" x2="165" y2="135" stroke="#38bdf8" strokeWidth="2.5" opacity="0.7" />

        {/* 後輪ホイール（スポークつき） */}
        <circle cx="120" cy="162" r="16" fill="#0f172a" stroke="#334155" strokeWidth="3" />
        <circle cx="120" cy="162" r="10" fill="url(#silverJoint)" />
        <circle cx="120" cy="162" r="4" fill="#0f172a" />

        {/* 前輪ホイール */}
        <circle cx="195" cy="172" r="17" fill="#0f172a" stroke="#334155" strokeWidth="3" />
        <circle cx="195" cy="172" r="11" fill="url(#silverJoint)" />
        <circle cx="195" cy="172" r="4" fill="#0f172a" />

        {/* 鋭いLEDヘッドライト */}
        <polygon points="250,148 268,154 252,160" fill="#38bdf8" stroke="#0284c7" strokeWidth="1.5" />
        <polygon points="254,150 265,153 255,157" fill="#ffffff" />
        {/* フロントグリル */}
        <path d="M245 163 Q260 165 268 163 L265 168 Q252 170 242 167 Z" fill="#0f172a" stroke="#1e293b" strokeWidth="1.5" />

        {/* 6. ロボットアーム＆握りこぶし */}
        {/* 肩アーマー */}
        <ellipse cx="145" cy="140" rx="14" ry="10" fill="url(#carBodyGrad)" stroke="#7f1d1d" strokeWidth="2" />
        {/* 上腕＆肘関節 */}
        <path d="M140 142 L105 165 L112 173 L145 148 Z" fill="url(#carBodyGrad)" stroke="#7f1d1d" strokeWidth="2" />
        <circle cx="108" cy="168" r="7" fill="url(#silverJoint)" stroke="#1e293b" strokeWidth="2" />
        {/* 前腕＆力強い拳 */}
        <path d="M108 170 L95 190 L105 195 L116 175 Z" fill="url(#carBodyGrad)" stroke="#7f1d1d" strokeWidth="2" />
        <rect x="90" y="188" width="14" height="12" rx="4" fill="url(#silverJoint)" stroke="#0f172a" strokeWidth="2" />
        <line x1="94" y1="188" x2="94" y2="198" stroke="#0f172a" strokeWidth="1.5" />
        <line x1="99" y1="188" x2="99" y2="198" stroke="#0f172a" strokeWidth="1.5" />

        {/* 7. コックピットから覗くレーシングヘルメット */}
        <ellipse cx="205" cy="95" rx="20" ry="22" fill="url(#carBodyGrad)" stroke="#7f1d1d" strokeWidth="3" />
        {/* ヘルメットの白いレーシングストライプ */}
        <path d="M195 78 Q210 74 220 85" stroke="#ffffff" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        {/* メタリックバイザー */}
        <path d="M205 92 Q225 90 226 108 L208 112 Q200 102 205 92 Z" fill="#0f172a" stroke="url(#silverJoint)" strokeWidth="2" />
        <line x1="210" y1="96" x2="222" y2="98" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
        {/* ヘルメット横のイヤーポッド */}
        <circle cx="192" cy="98" r="6" fill="url(#silverJoint)" stroke="#1e293b" strokeWidth="1.5" />
      </svg>
    );
  }

  // 22. スケルトン・ゼロ・ブローク （アーマード・スケルトン・アーチャー）
  if (type === 'skeleton_zero_broke') {
    return (
      <svg {...svgBaseProps}>
        <defs>
          <linearGradient id="bronzeHelm" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ea580c" />
            <stop offset="40%" stopColor="#c2410c" />
            <stop offset="100%" stopColor="#7c2d12" />
          </linearGradient>
          <linearGradient id="steelArmor" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="45%" stopColor="#94a3b8" />
            <stop offset="100%" stopColor="#475569" />
          </linearGradient>
          <linearGradient id="boneGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="70%" stopColor="#fef08a" />
            <stop offset="100%" stopColor="#fef9c3" />
          </linearGradient>
          <linearGradient id="woodBow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#92400e" />
            <stop offset="100%" stopColor="#451a03" />
          </linearGradient>
        </defs>

        {/* 1. 地面の影 */}
        <ellipse cx="160" cy="295" rx="65" ry="14" fill="#701a75" opacity="0.4" />

        {/* 2. 背中の矢筒（矢が何本も刺さっている） */}
        <g transform="translate(115, 80) rotate(-25)">
          {/* 矢の羽（フェザー） */}
          <line x1="0" y1="0" x2="0" y2="40" stroke="#78350f" strokeWidth="3" />
          <polygon points="-5,5 0,0 5,5 0,15" fill="#fef08a" stroke="#ca8a04" strokeWidth="1" />
          <line x1="10" y1="2" x2="10" y2="40" stroke="#78350f" strokeWidth="3" />
          <polygon points="5,7 10,2 15,7 10,17" fill="#fef08a" stroke="#ca8a04" strokeWidth="1" />
          <line x1="-8" y1="5" x2="-8" y2="40" stroke="#78350f" strokeWidth="3" />
          <polygon points="-13,10 -8,5 -3,10 -8,20" fill="#fef08a" stroke="#ca8a04" strokeWidth="1" />
          {/* 矢筒本体 */}
          <rect x="-12" y="30" width="28" height="48" rx="5" fill="#9a3412" stroke="#451a03" strokeWidth="2.5" />
          <rect x="-14" y="28" width="32" height="7" rx="2" fill="#ca8a04" />
        </g>

        {/* 3. 鉄の足・ブーツ（サバトン） */}
        {/* 左足ブーツ */}
        <rect x="132" y="250" width="18" height="32" rx="4" fill="url(#steelArmor)" stroke="#1e293b" strokeWidth="2" />
        <path d="M125 280 L148 280 L150 292 L120 292 Z" fill="url(#steelArmor)" stroke="#1e293b" strokeWidth="2" />
        <circle cx="140" cy="265" r="2" fill="#0f172a" />
        <circle cx="140" cy="275" r="2" fill="#0f172a" />

        {/* 右足ブーツ */}
        <rect x="170" y="250" width="18" height="32" rx="4" fill="url(#steelArmor)" stroke="#1e293b" strokeWidth="2" />
        <path d="M170 280 L193 280 L198 292 L168 292 Z" fill="url(#steelArmor)" stroke="#1e293b" strokeWidth="2" />
        <circle cx="180" cy="265" r="2" fill="#0f172a" />
        <circle cx="180" cy="275" r="2" fill="#0f172a" />

        {/* 4. スケルトンの脚の骨（脛骨・膝・大腿骨） */}
        {/* 左脚 */}
        <line x1="140" y1="215" x2="140" y2="250" stroke="#fef08a" strokeWidth="6" strokeLinecap="round" />
        <circle cx="140" cy="235" r="5" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.5" />
        {/* 右脚 */}
        <line x1="180" y1="215" x2="180" y2="250" stroke="#fef08a" strokeWidth="6" strokeLinecap="round" />
        <circle cx="180" cy="235" r="5" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.5" />

        {/* 5. 鎖帷子（チェーンメイル）と銅の腰鎧（タセット） */}
        {/* 鎖帷子スカート */}
        <path d="M130 195 L190 195 L195 220 L125 220 Z" fill="#64748b" stroke="#334155" strokeWidth="2" />
        <line x1="130" y1="205" x2="190" y2="205" stroke="#94a3b8" strokeWidth="2" strokeDasharray="3 3" />
        <line x1="128" y1="213" x2="192" y2="213" stroke="#94a3b8" strokeWidth="2" strokeDasharray="3 3" />
        {/* ブロンズの腰垂れプレート */}
        <path d="M130 178 L148 178 L145 208 L126 205 Z" fill="url(#bronzeHelm)" stroke="#431407" strokeWidth="2" />
        <circle cx="137" cy="190" r="2" fill="#fef08a" />
        <path d="M172 178 L190 178 L194 205 L175 208 Z" fill="url(#bronzeHelm)" stroke="#431407" strokeWidth="2" />
        <circle cx="183" cy="190" r="2" fill="#fef08a" />
        <path d="M148 178 L172 178 L170 215 L150 215 Z" fill="url(#bronzeHelm)" stroke="#431407" strokeWidth="2" />
        <circle cx="160" cy="195" r="2" fill="#fef08a" />

        {/* 6. 鋼鉄の胸当て（キュイラス） ＆ "ZB"の刻印 */}
        <path
          d="M135 125 C135 118 185 118 185 125 L192 180 L128 180 Z"
          fill="url(#steelArmor)"
          stroke="#1e293b"
          strokeWidth="2.5"
        />
        {/* 胸当ての正中線の峰 */}
        <line x1="160" y1="120" x2="160" y2="180" stroke="#ffffff" strokeWidth="2" opacity="0.6" />
        {/* 矢筒の革ベルト（斜めがけ） */}
        <line x1="140" y1="120" x2="182" y2="180" stroke="#78350f" strokeWidth="5" />
        <rect x="156" y="142" width="10" height="7" rx="1.5" fill="#f59e0b" stroke="#78350f" strokeWidth="1" />
        {/* ★ 胸当てに刻印された "ZB"（Zero Broke）の文字！ */}
        <text
          x="172"
          y="142"
          textAnchor="middle"
          fontSize="10"
          fontWeight="900"
          fontFamily="monospace"
          fill="#1e293b"
          stroke="#334155"
          strokeWidth="0.5"
          letterSpacing="-1"
        >
          ZB
        </text>

        {/* 7. スケルトンの腕の骨と弓を構えるポーズ */}
        {/* 首の頸椎の骨 */}
        <rect x="155" y="105" width="10" height="18" rx="2" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.5" />
        <line x1="155" y1="112" x2="165" y2="112" stroke="#ca8a04" strokeWidth="1.5" />

        {/* 左腕（弓を持つ手）：肩から前方に伸びる */}
        <line x1="185" y1="128" x2="205" y2="160" stroke="#fef08a" strokeWidth="5" strokeLinecap="round" />
        <circle cx="205" cy="160" r="4" fill="#ca8a04" />
        <line x1="205" y1="160" x2="208" y2="188" stroke="#fef08a" strokeWidth="4.5" strokeLinecap="round" />
        {/* 弓を握る骨の指 */}
        <ellipse cx="208" cy="190" rx="6" ry="7" fill="#fef08a" stroke="#451a03" strokeWidth="1.5" />

        {/* 木のロングボウ（大弓） */}
        <path d="M228 90 Q175 190 120 235" fill="none" stroke="url(#woodBow)" strokeWidth="6" strokeLinecap="round" />
        <circle cx="228" cy="90" r="4" fill="#ca8a04" />
        <circle cx="120" cy="235" r="4" fill="#ca8a04" />
        {/* 弓の弦（ピンと張られた弦） */}
        <line x1="228" y1="90" x2="168" y2="175" stroke="#f8fafc" strokeWidth="1.5" />
        <line x1="168" y1="175" x2="120" y2="235" stroke="#f8fafc" strokeWidth="1.5" />

        {/* 右腕（弦をつがえて引く手） */}
        <line x1="135" y1="128" x2="115" y2="155" stroke="#fef08a" strokeWidth="5" strokeLinecap="round" />
        <circle cx="115" cy="155" r="4" fill="#ca8a04" />
        <line x1="115" y1="155" x2="160" y2="172" stroke="#fef08a" strokeWidth="4.5" strokeLinecap="round" />
        {/* つがえる骨の手 */}
        <ellipse cx="162" cy="172" rx="6" ry="6" fill="#fef08a" stroke="#451a03" strokeWidth="1.5" />

        {/* つがえられた矢 */}
        <line x1="165" y1="173" x2="235" y2="205" stroke="#78350f" strokeWidth="3" />
        {/* 矢羽 */}
        <polygon points="163,168 172,172 165,178" fill="#fef08a" stroke="#ca8a04" strokeWidth="1" />
        {/* 鋭い鉄の鏃（矢じり） */}
        <polygon points="230,200 245,208 234,210" fill="url(#steelArmor)" stroke="#0f172a" strokeWidth="1.5" />

        {/* 8. ドクロの頭部 ＆ 古代戦士の兜 */}
        {/* ドクロ頭蓋骨（ベース） */}
        <ellipse cx="160" cy="88" rx="22" ry="24" fill="url(#boneGrad)" stroke="#78350f" strokeWidth="2.5" />
        {/* 顎の骨 */}
        <path d="M150 98 L170 98 L168 108 L152 108 Z" fill="url(#boneGrad)" stroke="#78350f" strokeWidth="2" />
        {/* 不敵な歯の並び */}
        <line x1="152" y1="102" x2="168" y2="102" stroke="#78350f" strokeWidth="1.5" />
        <line x1="156" y1="98" x2="156" y2="107" stroke="#78350f" strokeWidth="1.5" />
        <line x1="160" y1="98" x2="160" y2="107" stroke="#78350f" strokeWidth="1.5" />
        <line x1="164" y1="98" x2="164" y2="107" stroke="#78350f" strokeWidth="1.5" />
        {/* ドクロの鼻腔（逆三角） */}
        <polygon points="160,88 157,94 163,94" fill="#18181b" />
        {/* ドクロの眼窩（黒い窪み） */}
        <ellipse cx="150" cy="80" rx="6" ry="7" fill="#18181b" stroke="#78350f" strokeWidth="1" />
        <circle cx="151" cy="79" r="1.5" fill="#fef08a" />
        <ellipse cx="170" cy="80" rx="6" ry="7" fill="#18181b" stroke="#78350f" strokeWidth="1" />
        <circle cx="169" cy="79" r="1.5" fill="#fef08a" />

        {/* 古代戦士のブロンズ兜（ヘルメット） */}
        {/* トサカ飾り（クレスト） */}
        <path d="M155 35 Q160 22 165 35 L165 62 L155 62 Z" fill="#c2410c" stroke="#431407" strokeWidth="2" />
        <line x1="160" y1="28" x2="160" y2="60" stroke="#f97316" strokeWidth="2" />
        {/* 兜の本体ドーム */}
        <path d="M136 68 C136 40 184 40 184 68 Z" fill="url(#bronzeHelm)" stroke="#431407" strokeWidth="3" />
        {/* 兜の頬当て（チークガード） */}
        <path d="M136 65 L138 98 L145 95 L145 68 Z" fill="url(#bronzeHelm)" stroke="#431407" strokeWidth="2" />
        <path d="M184 65 L182 98 L175 95 L175 68 Z" fill="url(#bronzeHelm)" stroke="#431407" strokeWidth="2" />
        {/* 額のアーチと鼻当てガード */}
        <path d="M140 68 Q160 58 180 68 L170 76 L160 82 L150 76 Z" fill="url(#bronzeHelm)" stroke="#431407" strokeWidth="2" />
        <circle cx="160" cy="66" r="3" fill="#fef08a" />
      </svg>
    );
  }

  // 23. ベッド・ヘッド （四脚ロボットベッド）
  if (type === 'bed_head') {
    return (
      <svg {...svgBaseProps}>
        <defs>
          <linearGradient id="woodFrame" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d97706" />
            <stop offset="50%" stopColor="#b45309" />
            <stop offset="100%" stopColor="#78350f" />
          </linearGradient>
          <linearGradient id="brassJoint" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="40%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#a16207" />
          </linearGradient>
          <linearGradient id="bedSteelRail" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#64748b" />
            <stop offset="50%" stopColor="#94a3b8" />
            <stop offset="100%" stopColor="#475569" />
          </linearGradient>
          <linearGradient id="quiltBlue" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#94a3b8" />
            <stop offset="50%" stopColor="#64748b" />
            <stop offset="100%" stopColor="#475569" />
          </linearGradient>
          <linearGradient id="quiltCream" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fefce8" />
            <stop offset="100%" stopColor="#fef08a" />
          </linearGradient>
        </defs>

        {/* 1. 地面の影と摩擦スパーク */}
        <ellipse cx="160" cy="285" rx="100" ry="16" fill="#701a75" opacity="0.4" />

        {/* 4つのキャスターホイールの摩擦スパーク（青白い光芒） */}
        {/* 左奥足スパーク */}
        <path d="M72 265 L48 245 L62 268 L40 258 L68 275 Z" fill="#38bdf8" opacity="0.8" />
        <circle cx="50" cy="252" r="2" fill="#ffffff" />
        {/* 右奥足スパーク */}
        <path d="M135 260 L115 240 L128 262 L108 252 L132 268 Z" fill="#38bdf8" opacity="0.8" />
        {/* 手前右足スパーク */}
        <path d="M190 278 L155 262 L180 282 L145 272 L185 288 Z" fill="#38bdf8" opacity="0.85" />
        <path d="M180 280 L160 270 L175 284 Z" fill="#ffffff" />
        {/* 手前先頭右足スパーク */}
        <path d="M255 275 L220 260 L248 278 L210 268 L250 285 Z" fill="#38bdf8" opacity="0.85" />
        <path d="M245 276 L228 266 L240 280 Z" fill="#ffffff" />

        {/* 2. 奥のロボット脚（2本） */}
        {/* 左奥脚 */}
        <g>
          {/* 股関節 */}
          <circle cx="95" cy="180" r="8" fill="url(#brassJoint)" stroke="#451a03" strokeWidth="1.5" />
          {/* 上腿 */}
          <path d="M92 185 L72 215 L80 220 L100 188 Z" fill="url(#woodFrame)" stroke="#451a03" strokeWidth="2" opacity="0.85" />
          {/* 膝関節 */}
          <circle cx="76" cy="218" r="7" fill="url(#brassJoint)" stroke="#451a03" strokeWidth="1.5" />
          {/* 下腿 */}
          <path d="M74 224 L78 252 L85 252 L80 224 Z" fill="url(#woodFrame)" stroke="#451a03" strokeWidth="1.5" opacity="0.85" />
          {/* キャスター */}
          <rect x="75" y="252" width="10" height="5" rx="1" fill="url(#brassJoint)" />
          <circle cx="80" cy="265" r="7" fill="#1e293b" stroke="#0f172a" strokeWidth="2" />
          <circle cx="80" cy="265" r="3" fill="url(#brassJoint)" />
        </g>
        {/* 右奥脚 */}
        <g>
          {/* 股関節 */}
          <circle cx="140" cy="190" r="8" fill="url(#brassJoint)" stroke="#451a03" strokeWidth="1.5" />
          {/* 上腿 */}
          <path d="M137 195 L155 218 L148 223 L130 200 Z" fill="url(#woodFrame)" stroke="#451a03" strokeWidth="2" opacity="0.85" />
          {/* 膝関節 */}
          <circle cx="152" cy="220" r="7" fill="url(#brassJoint)" stroke="#451a03" strokeWidth="1.5" />
          {/* 下腿 */}
          <path d="M152 225 L140 252 L146 254 L158 225 Z" fill="url(#woodFrame)" stroke="#451a03" strokeWidth="1.5" opacity="0.85" />
          {/* キャスター */}
          <rect x="138" y="252" width="10" height="5" rx="1" fill="url(#brassJoint)" />
          <circle cx="143" cy="264" r="7" fill="#1e293b" stroke="#0f172a" strokeWidth="2" />
          <circle cx="143" cy="264" r="3" fill="url(#brassJoint)" />
        </g>

        {/* 3. ヘッドボード（左後方の高い木製ヘッドボード） */}
        {/* 後方左の柱 */}
        <rect x="85" y="65" width="12" height="120" rx="3" fill="url(#woodFrame)" stroke="#451a03" strokeWidth="2.5" />
        <circle cx="91" cy="60" r="7" fill="url(#brassJoint)" stroke="#451a03" strokeWidth="2" />
        {/* 後方右の柱 */}
        <rect x="145" y="70" width="12" height="100" rx="3" fill="url(#woodFrame)" stroke="#451a03" strokeWidth="2.5" />
        <circle cx="151" cy="65" r="7" fill="url(#brassJoint)" stroke="#451a03" strokeWidth="2" />
        {/* ヘッドボードアーチ板 */}
        <path d="M96 85 C96 68 146 68 146 85 L146 150 L96 150 Z" fill="url(#woodFrame)" stroke="#451a03" strokeWidth="2.5" />
        {/* 木目ラインとヒビ */}
        <path d="M110 80 Q115 110 110 140" stroke="#78350f" strokeWidth="1.5" fill="none" />
        <path d="M130 85 Q125 115 132 145" stroke="#78350f" strokeWidth="1.5" fill="none" />
        <line x1="108" y1="72" x2="114" y2="85" stroke="#451a03" strokeWidth="1.5" />

        {/* 4. ふかふかの枕（ピロー） */}
        <ellipse cx="125" cy="115" rx="28" ry="14" fill="#fefce8" stroke="#cbd5e1" strokeWidth="2" transform="rotate(-8 125 115)" />
        <path d="M102 118 Q125 125 145 118" stroke="#e2e8f0" strokeWidth="1.5" fill="none" />

        {/* 5. マットレスとパッチワーク布団（キルト掛け布団） */}
        {/* 厚みのあるマットレス土台 */}
        <polygon points="96,138 238,150 236,182 94,170" fill="#f8fafc" stroke="#94a3b8" strokeWidth="2" />
        {/* パッチワーク掛け布団本体 */}
        <polygon points="120,122 238,135 236,178 116,165" fill="#f1f5f9" stroke="#64748b" strokeWidth="2.5" />
        {/* パッチワーク柄（青とクリームのチェック） */}
        <polygon points="135,124 165,128 162,148 132,145" fill="url(#quiltBlue)" stroke="#475569" strokeWidth="1" />
        <polygon points="165,128 198,131 195,152 162,148" fill="url(#quiltCream)" stroke="#ca8a04" strokeWidth="1" />
        <polygon points="198,131 235,135 233,158 195,152" fill="url(#quiltBlue)" stroke="#475569" strokeWidth="1" />
        <polygon points="132,145 162,148 158,168 128,165" fill="url(#quiltCream)" stroke="#ca8a04" strokeWidth="1" />
        <polygon points="162,148 195,152 192,172 158,168" fill="url(#quiltBlue)" stroke="#475569" strokeWidth="1" />
        <polygon points="195,152 233,158 230,178 192,172" fill="url(#quiltCream)" stroke="#ca8a04" strokeWidth="1" />
        {/* 掛け布団の側面ドレープ・折り返し */}
        <path d="M116 130 C122 135 122 165 115 178 L126 182 L132 140 Z" fill="#fefce8" stroke="#cbd5e1" strokeWidth="1.5" />

        {/* 6. ベッド下の鉄製レールフレーム（リベット付き） */}
        <polygon points="90,168 245,178 245,190 90,180" fill="url(#bedSteelRail)" stroke="#1e293b" strokeWidth="2" />
        <circle cx="95" cy="174" r="2" fill="#0f172a" />
        <circle cx="115" cy="175" r="2" fill="#0f172a" />
        <circle cx="145" cy="177" r="2" fill="#0f172a" />
        <circle cx="180" cy="180" r="2" fill="#0f172a" />
        <circle cx="215" cy="182" r="2" fill="#0f172a" />
        <circle cx="240" cy="184" r="2" fill="#0f172a" />

        {/* 7. フットボード（手前右側の木製フットボード） */}
        {/* 手前フットボード板 */}
        <path d="M190 148 Q220 135 245 145 L245 192 L190 190 Z" fill="url(#woodFrame)" stroke="#451a03" strokeWidth="2.5" />
        {/* フットボードの木目 */}
        <path d="M205 145 Q215 165 210 188" stroke="#78350f" strokeWidth="1.5" fill="none" />
        <path d="M228 145 Q232 168 230 188" stroke="#78350f" strokeWidth="1.5" fill="none" />
        {/* 手前右側支柱 */}
        <rect x="184" y="130" width="12" height="75" rx="3" fill="url(#woodFrame)" stroke="#451a03" strokeWidth="2.5" />
        <circle cx="190" cy="125" r="6" fill="url(#brassJoint)" stroke="#451a03" strokeWidth="2" />
        {/* 手前先頭支柱 */}
        <rect x="242" y="125" width="12" height="75" rx="3" fill="url(#woodFrame)" stroke="#451a03" strokeWidth="2.5" />
        <circle cx="248" cy="120" r="6" fill="url(#brassJoint)" stroke="#451a03" strokeWidth="2" />

        {/* 8. 手前のロボット脚（2本） */}
        {/* 手前左脚（後ろ足） */}
        <g>
          {/* 金の股関節ピボット */}
          <circle cx="102" cy="190" r="11" fill="url(#brassJoint)" stroke="#451a03" strokeWidth="2.5" />
          <circle cx="102" cy="190" r="5" fill="#78350f" />
          {/* 木製太ももアーム */}
          <path d="M96 195 L95 235 L108 238 L112 195 Z" fill="url(#woodFrame)" stroke="#451a03" strokeWidth="2.5" />
          {/* 金の膝関節ピボット */}
          <circle cx="102" cy="240" r="9" fill="url(#brassJoint)" stroke="#451a03" strokeWidth="2" />
          <circle cx="102" cy="240" r="4" fill="#78350f" />
          {/* 木製すねアーム */}
          <path d="M98 245 L82 268 L92 272 L106 248 Z" fill="url(#woodFrame)" stroke="#451a03" strokeWidth="2.5" />
          {/* 真鍮スリーブと工業用キャスターホイール */}
          <rect x="80" y="270" width="12" height="6" rx="1.5" fill="url(#brassJoint)" stroke="#451a03" strokeWidth="1.5" />
          <path d="M83 276 L81 285 L88 285 L90 276 Z" fill="#64748b" stroke="#1e293b" strokeWidth="1.5" />
          <circle cx="86" cy="285" r="9" fill="#1e293b" stroke="#0f172a" strokeWidth="2.5" />
          <circle cx="86" cy="285" r="4" fill="url(#brassJoint)" />
        </g>

        {/* 手前右脚（前足：力強く前方に突っ張る） */}
        <g>
          {/* 金の股関節ピボット */}
          <circle cx="175" cy="198" r="11" fill="url(#brassJoint)" stroke="#451a03" strokeWidth="2.5" />
          <circle cx="175" cy="198" r="5" fill="#78350f" />
          {/* 木製太ももアーム */}
          <path d="M172 205 L178 242 L190 240 L184 200 Z" fill="url(#woodFrame)" stroke="#451a03" strokeWidth="2.5" />
          {/* 金の膝関節ピボット */}
          <circle cx="184" cy="245" r="9" fill="url(#brassJoint)" stroke="#451a03" strokeWidth="2" />
          <circle cx="184" cy="245" r="4" fill="#78350f" />
          {/* 木製すねアーム */}
          <path d="M184 250 L198 274 L208 270 L192 246 Z" fill="url(#woodFrame)" stroke="#451a03" strokeWidth="2.5" />
          {/* 真鍮スリーブと工業用キャスターホイール */}
          <rect x="198" y="272" width="12" height="6" rx="1.5" fill="url(#brassJoint)" stroke="#451a03" strokeWidth="1.5" />
          <path d="M201 278 L200 286 L207 286 L208 278 Z" fill="#64748b" stroke="#1e293b" strokeWidth="1.5" />
          <circle cx="205" cy="286" r="9" fill="#1e293b" stroke="#0f172a" strokeWidth="2.5" />
          <circle cx="205" cy="286" r="4" fill="url(#brassJoint)" />
        </g>
      </svg>
    );
  }

  // 21. ゾンビエレファント
  if (type === 'elephant') {
    return (
      <svg {...svgBaseProps}>
      <defs>
        <filter id="purpleShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#a855f7" floodOpacity="0.5" />
        </filter>
        <linearGradient id="eleSkin" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#86efac" />
          <stop offset="50%" stopColor="#4ade80" />
          <stop offset="100%" stopColor="#22c55e" />
        </linearGradient>
        <linearGradient id="pirateHat" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#991b1b" />
        </linearGradient>
      </defs>

      {/* Purple magic ground puddle */}
      <ellipse cx="160" cy="285" rx="90" ry="20" fill="#a855f7" opacity="0.85" filter="url(#purpleShadow)" />
      <ellipse cx="160" cy="285" rx="75" ry="14" fill="#d8b4fe" opacity="0.4" />

      {/* Tail with tuft */}
      <path d="M210 240 Q240 250 245 270" stroke="#22c55e" strokeWidth="8" fill="none" strokeLinecap="round" />
      <circle cx="247" cy="272" r="7" fill="#15803d" />

      {/* Feet / Legs */}
      <g fill="url(#eleSkin)" stroke="#14532d" strokeWidth="4">
        <rect x="110" y="240" width="36" height="42" rx="10" />
        <rect x="174" y="240" width="36" height="42" rx="10" />
        {/* Toenails */}
        <circle cx="118" cy="278" r="4" fill="#fef08a" />
        <circle cx="128" cy="278" r="4" fill="#fef08a" />
        <circle cx="138" cy="278" r="4" fill="#fef08a" />
        <circle cx="182" cy="278" r="4" fill="#fef08a" />
        <circle cx="192" cy="278" r="4" fill="#fef08a" />
        <circle cx="202" cy="278" r="4" fill="#fef08a" />
      </g>

      {/* Body & Tattered Zombie Tunic */}
      <ellipse cx="160" cy="210" rx="60" ry="55" fill="url(#eleSkin)" stroke="#14532d" strokeWidth="4" />
      {/* Tattered green pirate clothes */}
      <path
        d="M106 200 C110 180 150 175 160 175 C170 175 210 180 214 200 L218 245 L195 235 L175 248 L160 235 L145 248 L125 235 L102 245 Z"
        fill="#0284c7"
        stroke="#0c4a6e"
        strokeWidth="3"
      />
      {/* Yellow necklace bells / beads */}
      <circle cx="135" cy="215" r="5" fill="#facc15" stroke="#713f12" strokeWidth="1.5" />
      <circle cx="160" cy="220" r="6" fill="#facc15" stroke="#713f12" strokeWidth="1.5" />
      <circle cx="185" cy="215" r="5" fill="#facc15" stroke="#713f12" strokeWidth="1.5" />

      {/* Big Zombie Ears */}
      <g stroke="#14532d" strokeWidth="4">
        <ellipse cx="90" cy="140" rx="35" ry="45" fill="url(#eleSkin)" transform="rotate(-15 90 140)" />
        <ellipse cx="90" cy="140" rx="22" ry="32" fill="#86efac" opacity="0.6" transform="rotate(-15 90 140)" />
        <path d="M60 135 Q70 142 63 150 Z" fill="#000000" />
      </g>
      <g stroke="#14532d" strokeWidth="4">
        <ellipse cx="230" cy="140" rx="35" ry="45" fill="url(#eleSkin)" transform="rotate(15 230 140)" />
        <ellipse cx="230" cy="140" rx="22" ry="32" fill="#86efac" opacity="0.6" transform="rotate(15 230 140)" />
      </g>

      {/* Head */}
      <circle cx="160" cy="145" r="55" fill="url(#eleSkin)" stroke="#14532d" strokeWidth="4" />

      {/* Stitches */}
      <path d="M125 125 L145 120" stroke="#166534" strokeWidth="3" strokeLinecap="round" />
      <path d="M128 118 L130 126" stroke="#166534" strokeWidth="2.5" />
      <path d="M136 117 L138 125" stroke="#166534" strokeWidth="2.5" />
      <path d="M143 116 L145 124" stroke="#166534" strokeWidth="2.5" />

      {/* Red Zombie Eyes */}
      <g>
        <ellipse cx="140" cy="140" rx="12" ry="15" fill="#fef2f2" stroke="#991b1b" strokeWidth="3" />
        <ellipse cx="180" cy="140" rx="12" ry="15" fill="#fef2f2" stroke="#991b1b" strokeWidth="3" />
        <path d="M132 152 Q140 160 148 152" stroke="#ef4444" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M172 152 Q180 160 188 152" stroke="#ef4444" strokeWidth="3" fill="none" strokeLinecap="round" />
        <circle cx="140" cy="162" r="3" fill="#dc2626" />
        <circle cx="140" cy="138" r="4" fill="#7f1d1d" />
        <circle cx="180" cy="138" r="4" fill="#7f1d1d" />
        <path d="M128 135 C132 125 148 125 152 135 Z" fill="#22c55e" stroke="#14532d" strokeWidth="2" />
        <path d="M168 135 C172 125 188 125 192 135 Z" fill="#22c55e" stroke="#14532d" strokeWidth="2" />
      </g>

      {/* Curved Elephant Trunk */}
      <g stroke="#14532d" strokeWidth="4">
        <path
          d="M152 155 Q145 190 120 185 Q110 180 122 170 Q138 170 142 155"
          fill="url(#eleSkin)"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>

      {/* White Tusks */}
      <path d="M135 162 Q125 175 130 182 Q136 178 140 165 Z" fill="#ffffff" stroke="#14532d" strokeWidth="2.5" />
      <path d="M185 162 Q195 175 190 182 Q184 178 180 165 Z" fill="#ffffff" stroke="#14532d" strokeWidth="2.5" />

      {/* Pirate Bandanna */}
      <g>
        <path
          d="M110 115 C115 85 205 85 210 115 C185 105 135 105 110 115 Z"
          fill="url(#pirateHat)"
          stroke="#7f1d1d"
          strokeWidth="3"
        />
        <g transform="translate(160, 102) scale(0.65)">
          <circle cx="0" cy="-6" r="8" fill="#ffffff" />
          <path d="M-6 0 L6 0 L4 5 L-4 5 Z" fill="#ffffff" />
          <circle cx="-3" cy="-7" r="1.5" fill="#000000" />
          <circle cx="3" cy="-7" r="1.5" fill="#000000" />
          <line x1="-12" y1="-12" x2="12" y2="4" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="-12" y1="4" x2="12" y2="-12" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
        </g>
        <path d="M208 112 Q225 115 220 128 Q210 126 206 118" fill="#dc2626" stroke="#7f1d1d" strokeWidth="2" />
      </g>

      {/* Staff with skull */}
      <g>
        <line x1="85" y1="70" x2="110" y2="250" stroke="#78350f" strokeWidth="7" strokeLinecap="round" />
        <circle cx="85" cy="72" r="14" fill="#f3f4f6" stroke="#374151" strokeWidth="2.5" />
        <circle cx="80" cy="70" r="3" fill="#000000" />
        <circle cx="90" cy="70" r="3" fill="#000000" />
        <path d="M81 79 L89 79" stroke="#000000" strokeWidth="2" strokeLinecap="round" />
        <path
          d="M86 85 Q60 95 62 125 L75 120 L70 135 L88 120 Z"
          fill="#15803d"
          stroke="#14532d"
          strokeWidth="2"
        />
        <ellipse cx="106" cy="205" rx="14" ry="12" fill="url(#eleSkin)" stroke="#14532d" strokeWidth="3" />
      </g>
    </svg>
    );
  }

  // =========================================================================
  // 👑 1. インフェルノ・ドラゴン (BOSS 1: 灼熱の暴君)
  // =========================================================================
  if (type === 'inferno_dragon') {
    return (
      <svg {...svgBaseProps}>
        <defs>
          <radialGradient id="dragonFlame" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="45%" stopColor="#f97316" />
            <stop offset="85%" stopColor="#dc2626" />
            <stop offset="100%" stopColor="#7f1d1d" />
          </radialGradient>
          <linearGradient id="dragonHorn" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#450a0a" />
            <stop offset="100%" stopColor="#18181b" />
          </linearGradient>
          <linearGradient id="magmaGlow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="70%" stopColor="#ea580c" />
            <stop offset="100%" stopColor="#991b1b" />
          </linearGradient>
        </defs>

        {/* 召喚の赤い魔法陣・熱波のオーラ */}
        <ellipse cx="160" cy="290" rx="95" ry="20" fill="#dc2626" opacity="0.3" />
        <ellipse cx="160" cy="290" rx="65" ry="12" fill="#f59e0b" opacity="0.4" />

        {/* 巨大なドラゴンの翼（左翼） */}
        <path
          d="M125 150 Q50 60 15 75 Q45 115 50 145 Q75 125 90 170 Q110 160 125 150 Z"
          fill="url(#dragonFlame)"
          stroke="#450a0a"
          strokeWidth="3.5"
        />
        {/* 左翼の骨組み・爪 */}
        <path d="M120 155 Q50 70 20 75 L15 65" stroke="#450a0a" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M50 100 Q45 125 50 145" stroke="#7f1d1d" strokeWidth="2.5" fill="none" />

        {/* 巨大なドラゴンの翼（右翼） */}
        <path
          d="M195 150 Q270 60 305 75 Q275 115 270 145 Q245 125 230 170 Q210 160 195 150 Z"
          fill="url(#dragonFlame)"
          stroke="#450a0a"
          strokeWidth="3.5"
        />
        {/* 右翼の骨組み・爪 */}
        <path d="M200 155 Q270 70 300 75 L305 65" stroke="#450a0a" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M270 100 Q275 125 270 145" stroke="#7f1d1d" strokeWidth="2.5" fill="none" />

        {/* 太いトゲ付き尻尾 */}
        <path
          d="M125 250 Q60 280 40 230 Q60 215 95 240 Z"
          fill="#991b1b"
          stroke="#450a0a"
          strokeWidth="3.5"
        />
        <polygon points="40,230 25,225 35,245" fill="#f59e0b" stroke="#450a0a" strokeWidth="2" />
        <polygon points="65,250 55,268 78,260" fill="#f59e0b" stroke="#450a0a" strokeWidth="2" />

        {/* 強靭な後脚と鋭い爪 */}
        <rect x="100" y="235" width="34" height="42" rx="12" fill="#7f1d1d" stroke="#450a0a" strokeWidth="3.5" />
        <rect x="186" y="235" width="34" height="42" rx="12" fill="#7f1d1d" stroke="#450a0a" strokeWidth="3.5" />
        <polygon points="98,277 105,270 112,277" fill="#fbbf24" stroke="#450a0a" strokeWidth="1.5" />
        <polygon points="112,277 119,268 126,277" fill="#fbbf24" stroke="#450a0a" strokeWidth="1.5" />
        <polygon points="126,277 133,270 140,277" fill="#fbbf24" stroke="#450a0a" strokeWidth="1.5" />
        <polygon points="184,277 191,270 198,277" fill="#fbbf24" stroke="#450a0a" strokeWidth="1.5" />
        <polygon points="198,277 205,268 212,277" fill="#fbbf24" stroke="#450a0a" strokeWidth="1.5" />
        <polygon points="212,277 219,270 226,277" fill="#fbbf24" stroke="#450a0a" strokeWidth="1.5" />

        {/* ドラゴンの胴体（漆黒と暗赤色の鱗） */}
        <path
          d="M115 155 Q160 140 205 155 L215 245 Q160 260 105 245 Z"
          fill="#991b1b"
          stroke="#450a0a"
          strokeWidth="4"
        />

        {/* 胸のマグマ発光プレート（腹部） */}
        <path
          d="M135 170 Q160 162 185 170 L180 235 Q160 248 140 235 Z"
          fill="url(#magmaGlow)"
          stroke="#f59e0b"
          strokeWidth="2.5"
        />
        {/* 腹部の横リブ段差 */}
        <line x1="140" y1="188" x2="180" y2="188" stroke="#78350f" strokeWidth="2.5" />
        <line x1="142" y1="205" x2="178" y2="205" stroke="#78350f" strokeWidth="2.5" />
        <line x1="145" y1="222" x2="175" y2="222" stroke="#78350f" strokeWidth="2.5" />

        {/* 屈強な腕と燃える鉤爪 */}
        <path d="M115 185 Q90 195 85 215" stroke="#7f1d1d" strokeWidth="10" strokeLinecap="round" />
        <polygon points="82,215 75,225 88,222" fill="#fbbf24" stroke="#450a0a" strokeWidth="1.5" />
        <path d="M205 185 Q230 195 235 215" stroke="#7f1d1d" strokeWidth="10" strokeLinecap="round" />
        <polygon points="238,215 245,225 232,222" fill="#fbbf24" stroke="#450a0a" strokeWidth="1.5" />

        {/* 巨大な双角（頭部ホーン） */}
        <path d="M132 105 Q100 45 75 40 Q95 75 125 108" fill="url(#dragonHorn)" stroke="#09090b" strokeWidth="3" />
        <path d="M188 105 Q220 45 245 40 Q225 75 195 108" fill="url(#dragonHorn)" stroke="#09090b" strokeWidth="3" />

        {/* 頭部（凶悪なフェイス） */}
        <path
          d="M125 110 L160 85 L195 110 L200 155 Q160 170 120 155 Z"
          fill="#b91c1c"
          stroke="#450a0a"
          strokeWidth="4"
        />
        {/* 額のトサカ・ブレード */}
        <polygon points="160,70 152,100 168,100" fill="#f59e0b" stroke="#78350f" strokeWidth="2" />

        {/* 鋭い黄金の瞳（爬虫類のスリット目） */}
        <ellipse cx="145" cy="120" rx="9" ry="11" fill="#fef08a" stroke="#ca8a04" strokeWidth="2" />
        <ellipse cx="145" cy="120" rx="2.5" ry="9" fill="#09090b" />
        <ellipse cx="175" cy="120" rx="9" ry="11" fill="#fef08a" stroke="#ca8a04" strokeWidth="2" />
        <ellipse cx="175" cy="120" rx="2.5" ry="9" fill="#09090b" />

        {/* 牙の並ぶ凶悪な顎 */}
        <path d="M138 140 Q160 148 182 140" stroke="#450a0a" strokeWidth="3" fill="none" />
        <polygon points="144,140 147,148 150,140" fill="#ffffff" stroke="#450a0a" strokeWidth="1" />
        <polygon points="154,141 157,150 160,141" fill="#ffffff" stroke="#450a0a" strokeWidth="1" />
        <polygon points="160,141 163,150 166,141" fill="#ffffff" stroke="#450a0a" strokeWidth="1" />
        <polygon points="170,140 173,148 176,140" fill="#ffffff" stroke="#450a0a" strokeWidth="1" />

        {/* 鼻孔から噴き出す紅蓮の炎 */}
        <path d="M152 134 Q135 130 130 125" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M168 134 Q185 130 190 125" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    );
  }

  // =========================================================================
  // 👑 2. エンシェント・ゴーレム (BOSS 2: 古代遺跡の巨神)
  // =========================================================================
  if (type === 'ancient_golem') {
    return (
      <svg {...svgBaseProps}>
        <defs>
          <linearGradient id="golemStone" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#64748b" />
            <stop offset="50%" stopColor="#475569" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>
          <radialGradient id="runeCyanGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#a5f3fc" />
            <stop offset="40%" stopColor="#22d3ee" />
            <stop offset="80%" stopColor="#0891b2" />
            <stop offset="100%" stopColor="#164e63" />
          </radialGradient>
        </defs>

        {/* 古代の浮遊魔法陣 */}
        <ellipse cx="160" cy="290" rx="90" ry="18" fill="#0891b2" opacity="0.3" />
        <ellipse cx="160" cy="290" rx="60" ry="10" fill="#22d3ee" opacity="0.4" />

        {/* 浮遊する巨石の肩アーマー（左） */}
        <polygon
          points="60,95 105,75 110,135 55,145"
          fill="url(#golemStone)"
          stroke="#0f172a"
          strokeWidth="4"
        />
        {/* 左肩の古代ルーン発光ライン */}
        <line x1="75" y1="90" x2="95" y2="120" stroke="#22d3ee" strokeWidth="3.5" strokeLinecap="round" />
        <circle cx="85" cy="105" r="3" fill="#ffffff" />

        {/* 浮遊する巨石の肩アーマー（右） */}
        <polygon
          points="260,95 215,75 210,135 265,145"
          fill="url(#golemStone)"
          stroke="#0f172a"
          strokeWidth="4"
        />
        {/* 右肩の古代ルーン発光ライン */}
        <line x1="245" y1="90" x2="225" y2="120" stroke="#22d3ee" strokeWidth="3.5" strokeLinecap="round" />
        <circle cx="235" cy="105" r="3" fill="#ffffff" />

        {/* 巨大な浮遊する岩石の拳（左手） */}
        <g>
          <polygon points="35,175 75,160 85,210 40,225" fill="url(#golemStone)" stroke="#0f172a" strokeWidth="4" />
          <circle cx="60" cy="190" r="6" fill="url(#runeCyanGlow)" />
        </g>
        {/* 巨大な浮遊する岩石の拳（右手） */}
        <g>
          <polygon points="285,175 245,160 235,210 280,225" fill="url(#golemStone)" stroke="#0f172a" strokeWidth="4" />
          <circle cx="260" cy="190" r="6" fill="url(#runeCyanGlow)" />
        </g>

        {/* 重厚な石柱の下半身 */}
        <rect x="115" y="225" width="40" height="55" rx="8" fill="url(#golemStone)" stroke="#0f172a" strokeWidth="4" />
        <rect x="165" y="225" width="40" height="55" rx="8" fill="url(#golemStone)" stroke="#0f172a" strokeWidth="4" />
        <line x1="135" y1="240" x2="135" y2="265" stroke="#22d3ee" strokeWidth="3" strokeLinecap="round" />
        <line x1="185" y1="240" x2="185" y2="265" stroke="#22d3ee" strokeWidth="3" strokeLinecap="round" />

        {/* 巨石の胴体（マッシブな石造りの胸壁） */}
        <polygon
          points="100,120 220,120 205,235 115,235"
          fill="url(#golemStone)"
          stroke="#0f172a"
          strokeWidth="4.5"
        />

        {/* 胸の中央：巨大なルーン魔力コア（青き発光ジェム） */}
        <circle cx="160" cy="175" r="22" fill="#0891b2" stroke="#0f172a" strokeWidth="3" />
        <circle cx="160" cy="175" r="16" fill="url(#runeCyanGlow)" />
        <circle cx="160" cy="175" r="6" fill="#ffffff" />
        {/* コアから全身へ走るルーン回路 */}
        <path d="M160 153 L160 128 M160 197 L160 222 M138 175 L115 175 M182 175 L205 175" stroke="#22d3ee" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="145" y1="160" x2="125" y2="140" stroke="#06b6d4" strokeWidth="2.5" />
        <line x1="175" y1="160" x2="195" y2="140" stroke="#06b6d4" strokeWidth="2.5" />

        {/* 巨石の頭部（古代の鉄壁兜） */}
        <polygon
          points="125,70 195,70 185,125 135,125"
          fill="url(#golemStone)"
          stroke="#0f172a"
          strokeWidth="4"
        />
        {/* 頭頂部の古代の石冠 */}
        <polygon points="140,55 160,40 180,55 170,70 150,70" fill="#334155" stroke="#0f172a" strokeWidth="3" />

        {/* 横長の単眼モノアイスリット（光り輝く青い瞳） */}
        <rect x="135" y="92" width="50" height="12" rx="3" fill="#0f172a" />
        <ellipse cx="160" cy="98" rx="14" ry="4" fill="url(#runeCyanGlow)" />
        <circle cx="160" cy="98" r="3" fill="#ffffff" />

        {/* 浮遊するルーン結晶石（左右を漂う） */}
        <polygon points="80,50 90,65 80,80 70,65" fill="url(#runeCyanGlow)" stroke="#0f172a" strokeWidth="1.5" />
        <polygon points="240,50 250,65 240,80 230,65" fill="url(#runeCyanGlow)" stroke="#0f172a" strokeWidth="1.5" />
      </svg>
    );
  }

  // =========================================================================
  // 👑 3. 魔王 アークデーモン (BOSS 3: 深淵の支配者)
  // =========================================================================
  if (type === 'archdemon_lord') {
    return (
      <svg {...svgBaseProps}>
        <defs>
          <radialGradient id="demonVoid" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f43f5e" />
            <stop offset="35%" stopColor="#a855f7" />
            <stop offset="70%" stopColor="#4c1d95" />
            <stop offset="100%" stopColor="#09090b" />
          </radialGradient>
          <linearGradient id="demonArmor" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#312e81" />
            <stop offset="50%" stopColor="#1e1b4b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          <linearGradient id="capeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#991b1b" />
            <stop offset="100%" stopColor="#450a0a" />
          </linearGradient>
        </defs>

        {/* 暗黒の深淵オーラ */}
        <ellipse cx="160" cy="290" rx="90" ry="18" fill="#7e22ce" opacity="0.3" />
        <ellipse cx="160" cy="290" rx="60" ry="10" fill="#a855f7" opacity="0.4" />

        {/* 漆黒と深紅の翻る魔王マント（背面） */}
        <path
          d="M100 130 Q30 180 20 280 Q90 260 130 250 Z"
          fill="url(#capeGradient)"
          stroke="#09090b"
          strokeWidth="3.5"
        />
        <path
          d="M220 130 Q290 180 300 280 Q230 260 190 250 Z"
          fill="url(#capeGradient)"
          stroke="#09090b"
          strokeWidth="3.5"
        />

        {/* 巨大な悪魔の翼（左翼） */}
        <path
          d="M130 140 Q60 70 25 90 Q40 135 60 160 Q85 145 130 170 Z"
          fill="#1e1b4b"
          stroke="#09090b"
          strokeWidth="3.5"
        />
        <path d="M125 145 Q65 75 30 90" stroke="#a855f7" strokeWidth="2.5" fill="none" />

        {/* 巨大な悪魔の翼（右翼） */}
        <path
          d="M190 140 Q260 70 295 90 Q280 135 260 160 Q235 145 190 170 Z"
          fill="#1e1b4b"
          stroke="#09090b"
          strokeWidth="3.5"
        />
        <path d="M195 145 Q255 75 290 90" stroke="#a855f7" strokeWidth="2.5" fill="none" />

        {/* 漆黒の魔王甲冑の脚部 */}
        <rect x="120" y="235" width="30" height="48" rx="8" fill="url(#demonArmor)" stroke="#09090b" strokeWidth="3" />
        <rect x="170" y="235" width="30" height="48" rx="8" fill="url(#demonArmor)" stroke="#09090b" strokeWidth="3" />
        {/* 金の爪先 */}
        <polygon points="115,283 125,273 140,283" fill="#fbbf24" stroke="#09090b" strokeWidth="1.5" />
        <polygon points="165,283 175,273 190,283" fill="#fbbf24" stroke="#09090b" strokeWidth="1.5" />

        {/* 漆黒の鎧の胴体（金の縁取り） */}
        <path
          d="M115 135 Q160 125 205 135 L195 240 Q160 250 125 240 Z"
          fill="url(#demonArmor)"
          stroke="#fbbf24"
          strokeWidth="3.5"
        />

        {/* 胸の中央の魔眼ジュエル（深淵のコア） */}
        <polygon points="160,165 175,185 160,205 145,185" fill="url(#demonVoid)" stroke="#fbbf24" strokeWidth="2" />
        <circle cx="160" cy="185" r="4" fill="#ffffff" />

        {/* 魔王の腕と闇の魔剣 */}
        <path d="M115 160 Q85 180 75 210" stroke="url(#demonArmor)" strokeWidth="10" strokeLinecap="round" />
        <circle cx="75" cy="210" r="7" fill="#fbbf24" />

        {/* 右手に握る深淵の魔剣（大剣） */}
        <path d="M205 160 Q235 180 245 205" stroke="url(#demonArmor)" strokeWidth="10" strokeLinecap="round" />
        <g transform="translate(245, 170) rotate(25)">
          <rect x="-4" y="0" width="8" height="85" rx="3" fill="#4c1d95" stroke="#a855f7" strokeWidth="2" />
          <line x1="0" y1="0" x2="0" y2="85" stroke="#e11d48" strokeWidth="2" />
          <polygon points="-12,0 12,0 0,-15" fill="#fbbf24" stroke="#09090b" strokeWidth="2" />
          <circle cx="0" cy="-6" r="3" fill="#ef4444" />
        </g>

        {/* 雄大で凶悪な悪魔の角（ダークホーン） */}
        <path d="M130 95 Q90 50 65 35 Q85 65 118 100" fill="#09090b" stroke="#7e22ce" strokeWidth="2.5" />
        <path d="M190 95 Q230 50 255 35 Q235 65 202 100" fill="#09090b" stroke="#7e22ce" strokeWidth="2.5" />

        {/* 魔王の頭部兜と黄金の冠 */}
        <polygon
          points="130,85 160,65 190,85 180,135 140,135"
          fill="url(#demonArmor)"
          stroke="#09090b"
          strokeWidth="3.5"
        />
        {/* 黄金の三叉魔王冠 */}
        <polygon points="140,75 145,55 152,70 160,48 168,70 175,55 180,75" fill="#fbbf24" stroke="#09090b" strokeWidth="2" />

        {/* 兜の闇から光る真紅の邪眼 */}
        <ellipse cx="148" cy="105" rx="7" ry="4" fill="#ef4444" />
        <circle cx="148" cy="105" r="2" fill="#ffffff" />
        <ellipse cx="172" cy="105" rx="7" ry="4" fill="#ef4444" />
        <circle cx="172" cy="105" r="2" fill="#ffffff" />

        {/* 不敵な嘲笑の口元 */}
        <path d="M150 122 Q160 128 170 122" stroke="#fbbf24" strokeWidth="2" fill="none" />
      </svg>
    );
  }

  // 4. 👑 メタルいもむし・ボー （全身メタルの巨大いもむし・肩にオレンジの丸いマーク・足元からジェット炎で空中飛行）
  if (type === 'metal_caterpillar_bo') {
    return (
      <svg {...svgBaseProps}>
        <defs>
          {/* メタリック鋼鉄グラデーション */}
          <linearGradient id="metalChrome" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="25%" stopColor="#e2e8f0" />
            <stop offset="50%" stopColor="#94a3b8" />
            <stop offset="75%" stopColor="#475569" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>

          <linearGradient id="metalDark" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#64748b" />
            <stop offset="50%" stopColor="#334155" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>

          <linearGradient id="metalHighlight" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#94a3b8" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.9" />
          </linearGradient>

          {/* 肩のオレンジ色の丸いマーク専用グラデーション */}
          <radialGradient id="orangeEmblem" cx="40%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#ffedd5" />
            <stop offset="25%" stopColor="#fb923c" />
            <stop offset="70%" stopColor="#ea580c" />
            <stop offset="100%" stopColor="#9a3412" />
          </radialGradient>

          {/* ジェット噴射の火炎グラデーション */}
          <linearGradient id="boosterFlame" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="20%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#f97316" />
            <stop offset="80%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#b91c1c" stopOpacity="0" />
          </linearGradient>

          <radialGradient id="heatGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f97316" stopOpacity="0.6" />
            <stop offset="60%" stopColor="#ef4444" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#ea580c" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* --- 1. 地面のジェット火炎熱風シャドウ（空を飛んでいる浮遊感を演出） --- */}
        <ellipse cx="160" cy="296" rx="90" ry="14" fill="url(#heatGlow)" />
        <ellipse cx="160" cy="296" rx="55" ry="8" fill="#facc15" opacity="0.3" />

        {/* --- 2. 体の下部（足元・接地部）から激しく噴射されるジェット炎（空を飛ぶ） --- */}
        {/* 後部ジェット炎（セグメント4下部） */}
        <g transform="translate(68, 205)">
          <path d="M-10,0 Q-15,35 0,65 Q15,35 10,0 Z" fill="url(#boosterFlame)" />
          <path d="M-5,0 Q-8,25 0,45 Q8,25 5,0 Z" fill="#ffffff" opacity="0.85" />
        </g>
        {/* 中央後部ジェット炎（セグメント3下部） */}
        <g transform="translate(120, 218)">
          <path d="M-13,0 Q-18,45 0,78 Q18,45 13,0 Z" fill="url(#boosterFlame)" />
          <path d="M-7,0 Q-10,30 0,55 Q10,30 7,0 Z" fill="#ffffff" opacity="0.9" />
        </g>
        {/* 中央前部ジェット炎（セグメント2下部） */}
        <g transform="translate(178, 218)">
          <path d="M-14,0 Q-20,48 0,82 Q20,48 14,0 Z" fill="url(#boosterFlame)" />
          <path d="M-8,0 Q-11,32 0,58 Q11,32 8,0 Z" fill="#ffffff" opacity="0.9" />
        </g>
        {/* 前部ジェット炎（頭部直下） */}
        <g transform="translate(232, 205)">
          <path d="M-11,0 Q-16,38 0,68 Q16,38 11,0 Z" fill="url(#boosterFlame)" />
          <path d="M-6,0 Q-9,26 0,48 Q9,26 6,0 Z" fill="#ffffff" opacity="0.85" />
        </g>

        {/* 火の粉・エネルギーパーティクル */}
        <circle cx="85" cy="265" r="3" fill="#fef08a" />
        <circle cx="145" cy="285" r="4" fill="#fb923c" />
        <circle cx="205" cy="275" r="3.5" fill="#fef08a" />
        <circle cx="255" cy="255" r="2.5" fill="#ef4444" />

        {/* --- 3. ジェットブースター噴射ノズル（各節の足元に装着） --- */}
        <rect x="58" y="196" width="20" height="12" rx="3" fill="url(#metalDark)" stroke="#0f172a" strokeWidth="2" />
        <line x1="59" y1="202" x2="77" y2="202" stroke="#f97316" strokeWidth="1.5" />
        <rect x="108" y="208" width="24" height="14" rx="4" fill="url(#metalDark)" stroke="#0f172a" strokeWidth="2" />
        <line x1="109" y1="215" x2="131" y2="215" stroke="#f97316" strokeWidth="1.5" />
        <rect x="166" y="208" width="24" height="14" rx="4" fill="url(#metalDark)" stroke="#0f172a" strokeWidth="2" />
        <line x1="167" y1="215" x2="189" y2="215" stroke="#f97316" strokeWidth="1.5" />
        <rect x="222" y="196" width="20" height="12" rx="3" fill="url(#metalDark)" stroke="#0f172a" strokeWidth="2" />
        <line x1="223" y1="202" x2="241" y2="202" stroke="#f97316" strokeWidth="1.5" />

        {/* --- 4. 全身メタルの巨大いもむし本体（後部から前部へ重なる波打つ節々） --- */}

        {/* 第5節（お尻の尾部）：球体スチール装甲 */}
        <ellipse cx="48" cy="175" rx="26" ry="24" fill="url(#metalChrome)" stroke="#1e293b" strokeWidth="3" />
        <ellipse cx="42" cy="168" rx="12" ry="7" fill="#ffffff" opacity="0.6" />
        {/* 尾部のリベット（鋲） */}
        <circle cx="32" cy="175" r="2.5" fill="#334155" />
        <circle cx="42" cy="188" r="2.5" fill="#334155" />

        {/* 第4節（胴体後部） */}
        <ellipse cx="88" cy="165" rx="34" ry="38" fill="url(#metalChrome)" stroke="#1e293b" strokeWidth="3.5" />
        {/* 節のアーマープレート分割線 */}
        <path d="M72 135 Q88 165 76 195" stroke="#475569" strokeWidth="2" fill="none" />
        <ellipse cx="82" cy="142" rx="14" ry="8" fill="#ffffff" opacity="0.5" />
        <circle cx="78" cy="132" r="2" fill="#334155" />
        <circle cx="72" cy="165" r="2" fill="#334155" />

        {/* 第3節（胴体中央部） */}
        <ellipse cx="140" cy="155" rx="40" ry="44" fill="url(#metalChrome)" stroke="#1e293b" strokeWidth="3.5" />
        <path d="M122 120 Q142 155 128 190" stroke="#475569" strokeWidth="2.5" fill="none" />
        <ellipse cx="132" cy="130" rx="18" ry="9" fill="#ffffff" opacity="0.55" />
        {/* メタル排気スリット */}
        <line x1="130" y1="180" x2="148" y2="180" stroke="#1e293b" strokeWidth="2.5" />
        <line x1="132" y1="185" x2="146" y2="185" stroke="#1e293b" strokeWidth="2.5" />

        {/* 第2節（胴体前部・肩あたり）：★オレンジ色の丸いマークがある重要パーツ！ */}
        <ellipse cx="198" cy="150" rx="42" ry="46" fill="url(#metalChrome)" stroke="#1e293b" strokeWidth="3.5" />
        <ellipse cx="190" cy="122" rx="20" ry="10" fill="#ffffff" opacity="0.6" />

        {/* ★★★ 要望の核心：側面（人でいう肩あたり）の「オレンジ色の丸いマーク」 ★★★ */}
        <g id="shoulder-orange-emblem">
          {/* 外側の機械マウントリング（チタンシルバー） */}
          <circle cx="188" cy="142" r="19" fill="#1e293b" stroke="#94a3b8" strokeWidth="2" />
          {/* オレンジ色の発光オーラ */}
          <circle cx="188" cy="142" r="16" fill="url(#orangeEmblem)" stroke="#ffffff" strokeWidth="2.5" />
          {/* 内側のメカニカルコア紋章 */}
          <circle cx="188" cy="142" r="10" fill="#c2410c" stroke="#fdba74" strokeWidth="1.5" />
          <circle cx="188" cy="142" r="5" fill="#facc15" />
          {/* マーク表面のガラス光沢ハイライト */}
          <ellipse cx="184" cy="136" rx="5" ry="2.5" fill="#ffffff" opacity="0.8" />
        </g>

        {/* 第1節（頭部）：巨大メタルいもむしの頭 */}
        <ellipse cx="248" cy="145" rx="42" ry="44" fill="url(#metalChrome)" stroke="#1e293b" strokeWidth="3.5" />
        {/* ヘルメット風トッププレート */}
        <path d="M220 115 Q255 102 282 125" stroke="#ffffff" strokeWidth="3" fill="none" opacity="0.8" />

        {/* 触角（アンテナ：メカニカルセンサー） */}
        {/* 左触角 */}
        <path d="M235 106 Q230 70 215 50" stroke="#475569" strokeWidth="4" fill="none" strokeLinecap="round" />
        <circle cx="215" cy="50" r="7" fill="url(#orangeEmblem)" stroke="#ffffff" strokeWidth="1.5" />
        {/* 右触角 */}
        <path d="M260 108 Q275 72 290 52" stroke="#475569" strokeWidth="4" fill="none" strokeLinecap="round" />
        <circle cx="290" cy="52" r="7" fill="url(#orangeEmblem)" stroke="#ffffff" strokeWidth="1.5" />

        {/* メタルバイザー＆目（サイバーで知的な強い瞳） */}
        <ellipse cx="258" cy="138" rx="14" ry="12" fill="#09090b" stroke="#38bdf8" strokeWidth="2.5" />
        {/* 青く光るツインセンサー眼球 */}
        <ellipse cx="258" cy="138" rx="10" ry="8" fill="#0284c7" />
        <circle cx="256" cy="136" r="4" fill="#38bdf8" />
        <circle cx="259" cy="134" r="1.5" fill="#ffffff" />

        {/* 右側の小カメラアイ */}
        <circle cx="278" cy="146" r="5" fill="#09090b" stroke="#38bdf8" strokeWidth="1.5" />
        <circle cx="278" cy="146" r="3" fill="#38bdf8" />

        {/* ロボットいもむしの口元・大あご（チタン製メカニカルマンディブル） */}
        <path d="M272 165 Q290 175 278 185" fill="#334155" stroke="#0f172a" strokeWidth="2.5" />
        <path d="M255 174 Q270 185 260 192" fill="#334155" stroke="#0f172a" strokeWidth="2.5" />
        {/* クールな口元スリット */}
        <line x1="262" y1="168" x2="274" y2="172" stroke="#f97316" strokeWidth="2" />

        {/* --- 5. メタルのキラリとした反射光（星型ハイライト） --- */}
        <g fill="#ffffff" opacity="0.85">
          {/* 頭部の輝き */}
          <polygon points="275,108 277,114 283,116 277,118 275,124 273,118 267,116 273,114" />
          {/* 背中の輝き */}
          <polygon points="140,115 141,120 146,121 141,122 140,127 139,122 134,121 139,120" />
        </g>
      </svg>
    );
  }

  // デフォルトフォールバック
  return (
    <svg {...svgBaseProps}>
      <circle cx="160" cy="160" r="70" fill="#dc2626" opacity="0.8" />
      <text x="160" y="165" textAnchor="middle" fill="#ffffff" fontSize="24" fontWeight="bold">BOSS</text>
    </svg>
  );
};
