const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <!-- Deep Cosmic Radial Gradient -->
    <radialGradient id="spaceGrad" cx="50%" cy="38%" r="68%">
      <stop offset="0%" stop-color="#2e1065" />
      <stop offset="35%" stop-color="#1e1b4b" />
      <stop offset="70%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#020617" />
    </radialGradient>

    <!-- Diamond Blade Gradients -->
    <linearGradient id="diamondEdgeL" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#e0f2fe" />
      <stop offset="30%" stop-color="#38bdf8" />
      <stop offset="100%" stop-color="#0284c7" />
    </linearGradient>
    <linearGradient id="diamondEdgeR" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#bae6fd" />
      <stop offset="40%" stop-color="#0ea5e9" />
      <stop offset="100%" stop-color="#0369a1" />
    </linearGradient>

    <!-- Gold Gradients -->
    <linearGradient id="goldRim" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef08a" />
      <stop offset="25%" stop-color="#eab308" />
      <stop offset="50%" stop-color="#fef08a" />
      <stop offset="75%" stop-color="#ca8a04" />
      <stop offset="100%" stop-color="#854d0e" />
    </linearGradient>

    <linearGradient id="goldHilt" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef08a" />
      <stop offset="40%" stop-color="#eab308" />
      <stop offset="100%" stop-color="#a16207" />
    </linearGradient>

    <linearGradient id="textGold" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="35%" stop-color="#fef08a" />
      <stop offset="70%" stop-color="#facc15" />
      <stop offset="100%" stop-color="#d97706" />
    </linearGradient>

    <filter id="diamondGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="10" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>

    <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="6" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Seamless Dark Cosmic Background for Android Maskable Crop -->
  <rect width="512" height="512" fill="#020617" />

  <!-- Main Circular Emblem / Medallion -->
  <!-- Outer Gold Rim -->
  <circle cx="256" cy="256" r="236" fill="url(#spaceGrad)" stroke="url(#goldRim)" stroke-width="12" />
  
  <!-- Cyan Magic Accent Ring -->
  <circle cx="256" cy="256" r="222" fill="none" stroke="#38bdf8" stroke-width="3" opacity="0.85" />
  
  <!-- Subtle Inner Dotted Guide Ring -->
  <circle cx="256" cy="256" r="214" fill="none" stroke="#eab308" stroke-width="1.5" stroke-dasharray="6,6" opacity="0.6" />

  <!-- Magic Sparkles & Stars (Positioned safely inside circular emblem) -->
  <g fill="#fef08a" opacity="0.9">
    <polygon points="120,120 125,133 138,138 125,143 120,156 115,143 102,138 115,133" />
    <polygon points="390,125 394,136 405,140 394,144 390,155 386,144 375,140 386,136" />
    <polygon points="105,260 109,270 119,274 109,278 105,288 101,278 91,274 101,270" />
    <polygon points="408,260 412,270 422,274 412,278 408,288 404,278 394,274 404,270" />
  </g>
  <circle cx="180" cy="90" r="3.5" fill="#ffffff" opacity="0.9" />
  <circle cx="330" cy="95" r="4" fill="#38bdf8" opacity="0.9" />
  <circle cx="140" cy="200" r="3" fill="#38bdf8" opacity="0.8" />
  <circle cx="370" cy="205" r="3" fill="#ffffff" opacity="0.8" />

  <!-- Diamond Sword Aura / Glow -->
  <g transform="translate(256, 192) rotate(-42)" filter="url(#diamondGlow)">
    <ellipse cx="0" cy="-55" rx="42" ry="135" fill="#38bdf8" opacity="0.4" />
  </g>

  <!-- Diamond Sword -->
  <g transform="translate(256, 192) rotate(-42)">
    <!-- Blade Tip & Edges -->
    <path d="M0 -195 L-24 -172 L-20 30 L0 35 Z" fill="url(#diamondEdgeL)" />
    <path d="M0 -195 L24 -172 L20 30 L0 35 Z" fill="url(#diamondEdgeR)" />
    
    <!-- Central Crystal Facets & White Gleam -->
    <path d="M0 -195 L-10 -160 L0 -150 L10 -160 Z" fill="#ffffff" opacity="0.95" />
    <path d="M0 -150 L-9 -60 L0 -45 L9 -60 Z" fill="#e0f2fe" opacity="0.8" />
    <path d="M0 -45 L-7 18 L0 34 L7 18 Z" fill="#bae6fd" opacity="0.65" />
    <line x1="0" y1="-190" x2="0" y2="34" stroke="#ffffff" stroke-width="3" stroke-linecap="round" />
    <line x1="-10" y1="-150" x2="-7" y2="-60" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round" opacity="0.85" />

    <!-- Ornate Golden Crossguard with Ruby Gem -->
    <path
      d="M-52 30 C-49 15 -18 18 0 22 C18 18 49 15 52 30 C56 45 22 47 0 44 C-22 47 -56 45 -52 30 Z"
      fill="url(#goldHilt)"
      stroke="#78350f"
      stroke-width="2.5"
    />
    <circle cx="-50" cy="30" r="6" fill="url(#goldHilt)" stroke="#78350f" stroke-width="1.8" />
    <circle cx="50" cy="30" r="6" fill="url(#goldHilt)" stroke="#78350f" stroke-width="1.8" />
    <ellipse cx="0" cy="33" rx="9" ry="11" fill="#ef4444" stroke="#991b1b" stroke-width="2" />
    <ellipse cx="-2" cy="30" rx="3.5" ry="4.5" fill="#fca5a5" />

    <!-- Grip / Hilt with wrapped texture -->
    <rect x="-8" y="42" width="16" height="52" rx="3.5" fill="#0f172a" stroke="#78350f" stroke-width="1.8" />
    <line x1="-8" y1="52" x2="8" y2="52" stroke="#facc15" stroke-width="2.5" />
    <line x1="-8" y1="64" x2="8" y2="64" stroke="#facc15" stroke-width="2.5" />
    <line x1="-8" y1="76" x2="8" y2="76" stroke="#facc15" stroke-width="2.5" />

    <!-- Ornate Gold Pommel with Cyan Crystal Core -->
    <circle cx="0" cy="102" r="14" fill="url(#goldHilt)" stroke="#78350f" stroke-width="2.5" />
    <circle cx="0" cy="102" r="7" fill="#38bdf8" stroke="#0284c7" stroke-width="1.5" />
    <circle cx="-2" cy="100" r="2.5" fill="#ffffff" />
  </g>

  <!-- Big Diamond Sparkle on Blade Tip -->
  <polygon points="126,80 132,65 138,80 153,86 138,92 132,107 126,92 111,86" fill="#ffffff" filter="url(#diamondGlow)" />
  <circle cx="132" cy="86" r="3" fill="#fef08a" />

  <!-- Circular Safe-Zone App Title Plaque / Ribbon Badge -->
  <!-- Positioned strictly inside the inner circle: Center (256, 372), Width 264, Height 86 -->
  <!-- Max distance from center (256, 256): sqrt(132^2 + (415-256)^2) = sqrt(17424 + 25281) = 206px < 236px circle radius! -->
  <g transform="translate(256, 370)">
    <!-- Plaque Outer Shadow -->
    <rect x="-132" y="-40" width="264" height="80" rx="24" fill="#020617" opacity="0.9" filter="url(#goldGlow)" />
    
    <!-- Plaque Gold Border -->
    <rect x="-128" y="-36" width="256" height="72" rx="20" fill="#090d26" stroke="url(#goldRim)" stroke-width="3.5" />
    
    <!-- Plaque Inner Frame -->
    <rect x="-120" y="-28" width="240" height="56" rx="14" fill="#0f172a" stroke="#38bdf8" stroke-width="1.2" opacity="0.95" />

    <!-- Ribbon Side Gems -->
    <circle cx="-106" cy="0" r="4.5" fill="#facc15" stroke="#78350f" stroke-width="1.5" />
    <polygon points="-106,-8 -103,-4 -99,0 -103,4 -106,8 -109,4 -113,0 -109,-4" fill="#fef08a" opacity="0.8" />
    
    <circle cx="106" cy="0" r="4.5" fill="#facc15" stroke="#78350f" stroke-width="1.5" />
    <polygon points="106,-8 109,-4 113,0 109,4 106,8 103,4 99,0 103,-4" fill="#fef08a" opacity="0.8" />

    <!-- Two-Line Stacked Title: Ultra Legible on Mobile / Android Circle Mask -->
    <!-- Line 1: 「ひらめき」 -->
    <text
      x="0"
      y="-4"
      text-anchor="middle"
      font-family="'IPAPGothic', 'IPAGothic', 'M PLUS Rounded 1c', 'Zen Maru Gothic', 'Hiragino Maru Gothic ProN', sans-serif"
      font-weight="900"
      font-size="28"
      fill="#451a03"
      stroke="#451a03"
      stroke-width="5"
      stroke-linejoin="round"
      letter-spacing="2"
    >
      ひらめき
    </text>
    <text
      x="0"
      y="-4"
      text-anchor="middle"
      font-family="'IPAPGothic', 'IPAGothic', 'M PLUS Rounded 1c', 'Zen Maru Gothic', 'Hiragino Maru Gothic ProN', sans-serif"
      font-weight="900"
      font-size="28"
      fill="url(#textGold)"
      stroke="#713f12"
      stroke-width="1.2"
      letter-spacing="2"
    >
      ひらめき
    </text>

    <!-- Line 2: 「クエスト！」 -->
    <text
      x="0"
      y="22"
      text-anchor="middle"
      font-family="'IPAPGothic', 'IPAGothic', 'M PLUS Rounded 1c', 'Zen Maru Gothic', 'Hiragino Maru Gothic ProN', sans-serif"
      font-weight="900"
      font-size="24"
      fill="#451a03"
      stroke="#451a03"
      stroke-width="5"
      stroke-linejoin="round"
      letter-spacing="2"
    >
      クエスト！
    </text>
    <text
      x="0"
      y="22"
      text-anchor="middle"
      font-family="'IPAPGothic', 'IPAGothic', 'M PLUS Rounded 1c', 'Zen Maru Gothic', 'Hiragino Maru Gothic ProN', sans-serif"
      font-weight="900"
      font-size="24"
      fill="url(#textGold)"
      stroke="#713f12"
      stroke-width="1.2"
      letter-spacing="2"
    >
      クエスト！
    </text>
  </g>
</svg>`;

async function generateAll() {
  const publicDir = path.resolve(__dirname, '../public');
  const imagesDir = path.resolve(publicDir, 'images');

  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }

  // 1. Write SVG to public/icon.svg and public/images/icon.svg
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgContent, 'utf-8');
  fs.writeFileSync(path.join(imagesDir, 'icon.svg'), svgContent, 'utf-8');
  console.log('Saved SVG icon.');

  const svgBuffer = Buffer.from(svgContent);

  // 2. Render 512x512
  const png512 = await sharp(svgBuffer).resize(512, 512).png().toBuffer();
  fs.writeFileSync(path.join(publicDir, 'icon.png'), png512);
  fs.writeFileSync(path.join(publicDir, 'icon-512.png'), png512);
  fs.writeFileSync(path.join(imagesDir, 'icon.png'), png512);
  fs.writeFileSync(path.join(imagesDir, 'icon-512.png'), png512);
  console.log('Saved 512x512 PNG icons.');

  // 3. Render 192x192
  const png192 = await sharp(svgBuffer).resize(192, 192).png().toBuffer();
  fs.writeFileSync(path.join(publicDir, 'icon-192.png'), png192);
  fs.writeFileSync(path.join(imagesDir, 'icon-192.png'), png192);
  console.log('Saved 192x192 PNG icons.');

  // 4. Render 180x180 for iOS Apple Touch Icon
  const png180 = await sharp(svgBuffer).resize(180, 180).png().toBuffer();
  fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), png180);
  fs.writeFileSync(path.join(imagesDir, 'apple-touch-icon.png'), png180);
  console.log('Saved 180x180 Apple Touch Icons.');

  console.log('All circular PWA icons generated successfully!');
}

generateAll().catch((err) => {
  console.error('Failed to generate icons:', err);
  process.exit(1);
});
