const fs = require('fs');
let code = fs.readFileSync('src/components/HomeScreen.tsx', 'utf8');

// 1. Replace the heroBanners array
const oldBannersStart = code.indexOf('const heroBanners = [');
const oldBannersEnd = code.indexOf('];\n\nimport toast from "react-hot-toast";');
const newBanners = `const heroBanners = [
  { imageUrl: "/banners/banner1.jpg" },
  { imageUrl: "/banners/banner2.jpg" }
];\n\nimport toast from "react-hot-toast";`;

if (oldBannersStart !== -1 && oldBannersEnd !== -1) {
  code = code.substring(0, oldBannersStart) + newBanners + code.substring(oldBannersEnd + 38);
} else {
  console.log("Could not find heroBanners");
}

fs.writeFileSync('src/components/HomeScreen.tsx', code);
console.log("Successfully replaced heroBanners!");
