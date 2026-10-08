const sharp = require('sharp');

const inputFile = 'C:/Users/HP/.gemini/antigravity/brain/3132b4d5-0d69-43d4-93fb-e8a9ff66a870/.user_uploaded/media_1791279180361.jpg';

sharp(inputFile)
  .resize(512, 512, { fit: 'cover' })
  .png()
  .toFile('public/icon-512x512.png')
  .then(() => {
    return sharp(inputFile)
      .resize(192, 192, { fit: 'cover' })
      .png()
      .toFile('public/icon-192x192.png');
  })
  .then(() => {
    return sharp(inputFile)
      .resize(192, 192, { fit: 'cover' })
      .jpeg()
      .toFile('public/icon.jpg');
  })
  .then(() => {
    return sharp(inputFile)
      .resize(180, 180, { fit: 'cover' })
      .jpeg()
      .toFile('public/apple-icon.jpg');
  })
  .then(() => console.log('Icons generated successfully!'))
  .catch(err => console.error(err));
