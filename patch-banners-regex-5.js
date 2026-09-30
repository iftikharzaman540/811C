const fs = require('fs');
let code = fs.readFileSync('src/components/HomeScreen.tsx', 'utf8');

const newBanners = `const heroBanners = [
  { imageUrl: "/banners/banner1.jpg" },
  { imageUrl: "/banners/banner2.jpg" },
  { imageUrl: "/banners/banner3.jpg" },
  { imageUrl: "/banners/banner4.jpg" },
  { imageUrl: "/banners/banner5.jpg" }
];`;

let match = code.match(/const heroBanners = \[\s*\{[\s\S]*?\}\s*\];/);
if (match) {
  code = code.replace(match[0], newBanners);
  fs.writeFileSync('src/components/HomeScreen.tsx', code);
  console.log("Successfully replaced heroBanners with 5 images!");
} else {
  console.log("Could not find heroBanners using regex");
}
