const sharp = require('sharp');

sharp('public/splash-logo.png')
  .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 1 } })
  .toFile('public/icon-512x512.png')
  .then(() => {
    return sharp('public/splash-logo.png')
      .resize(192, 192, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 1 } })
      .toFile('public/icon-192x192.png');
  })
  .then(() => console.log('Icons generated successfully!'))
  .catch(err => console.error(err));
