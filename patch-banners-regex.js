const fs = require('fs');
let code = fs.readFileSync('src/components/HomeScreen.tsx', 'utf8');

// Replace the heroBanners array
const oldBannersStart = code.indexOf('const heroBanners = [');
const newBanners = `const heroBanners = [
  { imageUrl: "/banners/banner1.jpg" },
  { imageUrl: "/banners/banner2.jpg" }
];`;

let match = code.match(/const heroBanners = \[\s*\{[\s\S]*?\}\s*\];/);
if (match) {
  code = code.replace(match[0], newBanners);
  fs.writeFileSync('src/components/HomeScreen.tsx', code);
  console.log("Successfully replaced heroBanners!");
} else {
  console.log("Could not find heroBanners using regex");
}
