const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');
const iconsDir = path.join(publicDir, 'icons');
const sourceLogo = path.join(publicDir, 'image-logo.png');

if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

async function generateIcons() {
  console.log('Generating PWA icons from:', sourceLogo);
  
  // 1. Standard 192x192 icon (Transparent background with high res logo)
  await sharp(sourceLogo)
    .resize(192, 192, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(path.join(iconsDir, 'icon-192x192.png'));
  console.log('Created icon-192x192.png');

  // 2. Standard 512x512 icon
  await sharp(sourceLogo)
    .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(path.join(iconsDir, 'icon-512x512.png'));
  console.log('Created icon-512x512.png');

  // 3. Maskable 192x192 icon (with solid dark navy #1A1A2E background & safe padding)
  const logo192Padded = await sharp(sourceLogo)
    .resize(136, 136, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  await sharp({
    create: {
      width: 192,
      height: 192,
      channels: 4,
      background: { r: 26, g: 26, b: 46, alpha: 1 } // #1A1A2E
    }
  })
    .composite([{ input: logo192Padded, gravity: 'center' }])
    .png()
    .toFile(path.join(iconsDir, 'icon-maskable-192x192.png'));
  console.log('Created icon-maskable-192x192.png');

  // 4. Maskable 512x512 icon (with solid dark navy #1A1A2E background & safe padding)
  const logo512Padded = await sharp(sourceLogo)
    .resize(360, 360, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 26, g: 26, b: 46, alpha: 1 } // #1A1A2E
    }
  })
    .composite([{ input: logo512Padded, gravity: 'center' }])
    .png()
    .toFile(path.join(iconsDir, 'icon-maskable-512x512.png'));
  console.log('Created icon-maskable-512x512.png');

  // 5. Apple Touch Icon 180x180 (solid #1A1A2E background)
  const logo180Padded = await sharp(sourceLogo)
    .resize(140, 140, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  await sharp({
    create: {
      width: 180,
      height: 180,
      channels: 4,
      background: { r: 26, g: 26, b: 46, alpha: 1 } // #1A1A2E
    }
  })
    .composite([{ input: logo180Padded, gravity: 'center' }])
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('Created apple-touch-icon.png');
}

generateIcons().catch(err => {
  console.error('Error generating PWA icons:', err);
  process.exit(1);
});
