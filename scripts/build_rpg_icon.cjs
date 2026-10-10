const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function buildRpgIcon() {
  const publicDir = path.resolve(__dirname, '../public');
  const imagesDir = path.resolve(publicDir, 'images');
  const swordImgPath = path.resolve(__dirname, '../src/assets/images/diamond_sword_aura_1791373900931.jpg');

  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }

  console.log('Building brand-new circular RPG icon from scratch...');

  // 1. Prepare sword artwork from diamond_sword_aura_1791373900931.jpg
  // The sword is centered. We make it 920x920 and add a soft radial blend so it sits naturally inside the circle
  const swordRaw = sharp(swordImgPath);
  const swordResized = await swordRaw
    .resize(960, 960)
    .ensureAlpha()
    .png()
    .toBuffer();

  const swordMaskSvg = `<svg width="960" height="960" viewBox="0 0 960 960" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="sm" cx="50%" cy="48%" r="50%">
        <stop offset="65%" stop-color="#ffffff" stop-opacity="1" />
        <stop offset="92%" stop-color="#ffffff" stop-opacity="0.7" />
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
      </radialGradient>
      <filter id="sb">
        <feGaussianBlur stdDeviation="16" />
      </filter>
    </defs>
    <circle cx="480" cy="480" r="460" fill="url(#sm)" filter="url(#sb)" />
  </svg>`;
  const swordMaskBuf = await sharp(Buffer.from(swordMaskSvg)).resize(960, 960).png().toBuffer();
  const blendedSword = await sharp(swordResized)
    .composite([{ input: swordMaskBuf, blend: 'dest-in' }])
    .png()
    .toBuffer();

  // 2. Base Cosmic Circle Backdrop (正円: 1024x1024, center cx=512, cy=512, r=498)
  const baseCircleSvg = `<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="cosmicBg" cx="50%" cy="45%" r="65%">
        <stop offset="0%" stop-color="#152f68" />
        <stop offset="38%" stop-color="#0b1a3d" />
        <stop offset="72%" stop-color="#040b1e" />
        <stop offset="100%" stop-color="#01040f" />
      </radialGradient>
      <radialGradient id="centerGlow" cx="50%" cy="45%" r="40%">
        <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.35" />
        <stop offset="60%" stop-color="#0284c7" stop-opacity="0.15" />
        <stop offset="100%" stop-color="#0284c7" stop-opacity="0" />
      </radialGradient>
    </defs>
    <!-- Background Circle (正円) -->
    <circle cx="512" cy="512" r="498" fill="url(#cosmicBg)" />
    <!-- Center Magic Energy Aura Glow -->
    <circle cx="512" cy="480" r="380" fill="url(#centerGlow)" />
  </svg>`;
  const baseCircleBuf = Buffer.from(baseCircleSvg);

  // 3. Composite sword onto base circle
  const withSword = await sharp(baseCircleBuf)
    .composite([
      { input: blendedSword, top: 32, left: 32 }
    ])
    .png()
    .toBuffer();

  // 4. Foreground Overlay:
  // - RPG Title Plaque (semi-translucent crystal shield banner behind text for 100% legibility)
  // - Two-line Japanese RPG Typography:
  //     Line 1: 「ひらめき」 (y=735)
  //     Line 2: 「クエスト！」 (y=842)
  //   Both lines inside the circle, separate lines, no overlap!
  // - Perfect Circle Royal Golden & Cyan Frame (正円の豪華な外枠) with star gems
  const fgOverlaySvg = `<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- Gold Gradient -->
      <linearGradient id="goldRim" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ffffff" />
        <stop offset="20%" stop-color="#fef08a" />
        <stop offset="45%" stop-color="#eab308" />
        <stop offset="70%" stop-color="#ca8a04" />
        <stop offset="90%" stop-color="#854d0e" />
        <stop offset="100%" stop-color="#fef08a" />
      </linearGradient>

      <!-- Cyan/Diamond Gradient -->
      <linearGradient id="diamondRim" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ffffff" />
        <stop offset="30%" stop-color="#7dd3fc" />
        <stop offset="70%" stop-color="#0284c7" />
        <stop offset="100%" stop-color="#0369a1" />
      </linearGradient>

      <!-- Text Fill Gradient (Shining Gold to Warm Amber) -->
      <linearGradient id="textGold" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#ffffff" />
        <stop offset="25%" stop-color="#fef08a" />
        <stop offset="60%" stop-color="#facc15" />
        <stop offset="85%" stop-color="#eab308" />
        <stop offset="100%" stop-color="#c2410c" />
      </linearGradient>

      <!-- Text Fill Gradient (Diamond Cyan Highlight for Quest) -->
      <linearGradient id="textCyan" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#ffffff" />
        <stop offset="28%" stop-color="#e0f2fe" />
        <stop offset="60%" stop-color="#38bdf8" />
        <stop offset="100%" stop-color="#0369a1" />
      </linearGradient>

      <!-- Plaque Glass Gradient -->
      <linearGradient id="plaqueBg" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#07132e" stop-opacity="0.94" />
        <stop offset="50%" stop-color="#030919" stop-opacity="0.97" />
        <stop offset="100%" stop-color="#020612" stop-opacity="0.95" />
      </linearGradient>

      <filter id="plaqueGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="4" stdDeviation="10" flood-color="#000000" flood-opacity="0.9" />
        <feDropShadow dx="0" dy="0" stdDeviation="8" flood-color="#38bdf8" flood-opacity="0.4" />
      </filter>

      <filter id="textGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#000000" flood-opacity="0.95" />
        <feDropShadow dx="0" dy="0" stdDeviation="10" flood-color="#facc15" flood-opacity="0.5" />
      </filter>

      <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="8" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>

    <!-- 1. Magical Star Dust & Sparkles inside circle -->
    <g fill="#fef08a" opacity="0.95">
      <!-- Diamond Star top-left -->
      <polygon points="260,220 264,235 279,239 264,243 260,258 256,243 241,239 256,235" />
      <!-- Diamond Star top-right -->
      <polygon points="760,210 764,224 778,228 764,232 760,246 756,232 742,228 756,224" />
      <!-- Diamond Star mid-left -->
      <polygon points="175,440 178,450 188,453 178,456 175,466 172,456 162,453 172,450" />
      <!-- Diamond Star mid-right -->
      <polygon points="850,430 853,440 863,443 853,446 850,456 847,446 837,443 847,440" />
      <!-- Small Sparkles -->
      <circle cx="340" cy="180" r="3.5" fill="#38bdf8" />
      <circle cx="680" cy="170" r="3" fill="#ffffff" />
      <circle cx="210" cy="340" r="3" fill="#fef08a" />
      <circle cx="810" cy="330" r="3.5" fill="#38bdf8" />
      <circle cx="300" cy="530" r="2.5" fill="#ffffff" />
      <circle cx="720" cy="520" r="2.5" fill="#fef08a" />
    </g>

    <!-- 2. RPG Heroic Title Plaque / Ribbon Banner (fits 100% inside circle: width 580, height 210, y: 658..868) -->
    <g filter="url(#plaqueGlow)">
      <!-- Main Plaque Body -->
      <path d="M 230 670 
               L 794 670 
               Q 830 670, 834 706 
               L 818 840 
               Q 814 872, 780 872 
               L 244 872 
               Q 210 872, 206 840 
               L 190 706 
               Q 194 670, 230 670 Z" 
            fill="url(#plaqueBg)" 
            stroke="url(#goldRim)" 
            stroke-width="5" />
      <!-- Inner Diamond Accent Trim -->
      <path d="M 238 678 
               L 786 678 
               Q 820 678, 824 710 
               L 810 832 
               Q 806 864, 774 864 
               L 250 864 
               Q 218 864, 214 832 
               L 200 710 
               Q 204 678, 238 678 Z" 
            fill="none" 
            stroke="url(#diamondRim)" 
            stroke-width="2.5" 
            opacity="0.8" />
      <!-- Corner Jewels on Plaque -->
      <circle cx="220" cy="682" r="5" fill="#38bdf8" stroke="#fef08a" stroke-width="2" />
      <circle cx="804" cy="682" r="5" fill="#38bdf8" stroke="#fef08a" stroke-width="2" />
      <circle cx="230" cy="858" r="5" fill="#38bdf8" stroke="#fef08a" stroke-width="2" />
      <circle cx="794" cy="858" r="5" fill="#38bdf8" stroke="#fef08a" stroke-width="2" />
    </g>

    <!-- 3. Japanese RPG Typography: Two Lines, Non-overlapping, 100% inside circle -->
    <g filter="url(#textGlow)">
      <!-- LINE 1: 「ひらめき」 (y = 746, font-size = 64) -->
      <text x="512" y="746" 
            font-family="'M PLUS Rounded 1c', 'IPAPGothic', 'BIZ UDPGothic', sans-serif" 
            font-size="64" 
            font-weight="900" 
            text-anchor="middle" 
            letter-spacing="8" 
            stroke="#050c20" 
            stroke-width="16" 
            stroke-linejoin="round" 
            paint-order="stroke fill" 
            fill="url(#textGold)">ひらめき</text>

      <!-- LINE 2: 「クエスト！」 (y = 838, font-size = 78, larger & heroic) -->
      <text x="512" y="838" 
            font-family="'M PLUS Rounded 1c', 'IPAPGothic', 'BIZ UDPGothic', sans-serif" 
            font-size="78" 
            font-weight="900" 
            text-anchor="middle" 
            letter-spacing="5" 
            stroke="#050c20" 
            stroke-width="18" 
            stroke-linejoin="round" 
            paint-order="stroke fill" 
            fill="url(#textGold)">クエスト！</text>
    </g>

    <!-- 4. Royal Circular Golden & Diamond Rim (正円: r=496 & r=482) -->
    <!-- Outer Cyan Radiance Glow -->
    <circle cx="512" cy="512" r="496" fill="none" stroke="#38bdf8" stroke-width="14" opacity="0.4" filter="url(#goldGlow)" />
    <!-- Master Royal Golden Frame (正円) -->
    <circle cx="512" cy="512" r="496" fill="none" stroke="url(#goldRim)" stroke-width="14" />
    <!-- Inner Diamond Edge (正円) -->
    <circle cx="512" cy="512" r="484" fill="none" stroke="url(#diamondRim)" stroke-width="4.5" />
    <!-- Inset Fine Gold Thread (正円) -->
    <circle cx="512" cy="512" r="476" fill="none" stroke="url(#goldRim)" stroke-width="1.5" opacity="0.75" />

    <!-- Cardinal Jewel Studs on Rim (Top, Bottom, Left, Right) -->
    <g>
      <!-- Top Stud (0°) -->
      <polygon points="512,6 520,18 512,28 504,18" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5" />
      <circle cx="512" cy="18" r="4" fill="#38bdf8" />
      <!-- Bottom Stud (180°) -->
      <polygon points="512,1018 520,1006 512,996 504,1006" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5" />
      <circle cx="512" cy="1006" r="4" fill="#38bdf8" />
      <!-- Left Stud (270°) -->
      <polygon points="6,512 18,504 28,512 18,520" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5" />
      <circle cx="18" cy="512" r="4" fill="#38bdf8" />
      <!-- Right Stud (90°) -->
      <polygon points="1018,512 1006,504 996,512 1006,520" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5" />
      <circle cx="1006" cy="512" r="4" fill="#38bdf8" />
    </g>
  </svg>`;

  const fgOverlayBuf = Buffer.from(fgOverlaySvg);

  // 5. Composite everything into full 1024x1024 artwork
  const masterArtwork1024 = await sharp(withSword)
    .composite([
      { input: fgOverlayBuf, top: 0, left: 0 }
    ])
    .png()
    .toBuffer();

  // 6. Circular Masked version (purpose: "any", for iOS, desktop, web favicon)
  // Transparent outside the perfect circle at r=504
  const circleMaskSvg = `<svg width="1024" height="1024"><circle cx="512" cy="512" r="504" fill="#ffffff" /></svg>`;
  const circularEmblem1024 = await sharp(masterArtwork1024)
    .composite([{ input: Buffer.from(circleMaskSvg), blend: 'dest-in' }])
    .png()
    .toBuffer();

  // 7. Maskable version for Android Adaptive Icons (purpose: "maskable")
  // Android will crop to an 80% circle (radius 410px on 1024x1024).
  // Scale the circular emblem to ~82% (836x836) and center it on edge-to-edge dark space (#01040f).
  // This guarantees that 100% of the golden frame, sword, and text are inside Android's safe zone!
  const scaledEmblem = await sharp(circularEmblem1024)
    .resize(836, 836)
    .png()
    .toBuffer();

  const maskable1024 = await sharp({
    create: {
      width: 1024,
      height: 1024,
      channels: 4,
      background: { r: 1, g: 4, b: 15, alpha: 1 } // #01040f seamless background
    }
  })
    .composite([
      { input: scaledEmblem, top: Math.round((1024 - 836) / 2), left: Math.round((1024 - 836) / 2) }
    ])
    .png()
    .toBuffer();

  // 8. Generate all required PWA icon files
  // 512x512
  const png512 = await sharp(circularEmblem1024).resize(512, 512).png().toBuffer();
  const png512Maskable = await sharp(maskable1024).resize(512, 512).png().toBuffer();
  fs.writeFileSync(path.join(publicDir, 'icon.png'), png512);
  fs.writeFileSync(path.join(publicDir, 'icon-512.png'), png512Maskable);
  fs.writeFileSync(path.join(imagesDir, 'icon.png'), png512);
  fs.writeFileSync(path.join(imagesDir, 'icon-512.png'), png512Maskable);

  // 192x192
  const png192 = await sharp(circularEmblem1024).resize(192, 192).png().toBuffer();
  const png192Maskable = await sharp(maskable1024).resize(192, 192).png().toBuffer();
  fs.writeFileSync(path.join(publicDir, 'icon-192.png'), png192);
  fs.writeFileSync(path.join(imagesDir, 'icon-192.png'), png192);

  // 180x180 (Apple Touch Icon)
  const png180 = await sharp(circularEmblem1024).resize(180, 180).png().toBuffer();
  fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), png180);
  fs.writeFileSync(path.join(imagesDir, 'apple-touch-icon.png'), png180);

  // SVG wrapper with high-res PNG embedded
  const b64 = png512.toString('base64');
  const svgWrapper = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <image href="data:image/png;base64,${b64}" width="512" height="512" />
</svg>`;
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgWrapper, 'utf-8');
  fs.writeFileSync(path.join(imagesDir, 'icon.svg'), svgWrapper, 'utf-8');

  console.log('Successfully created brand-new circular RPG icon from scratch!');
}

buildRpgIcon().catch((err) => {
  console.error('Error building RPG icon:', err);
  process.exit(1);
});
