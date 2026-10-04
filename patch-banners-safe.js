const fs = require('fs');
let code = fs.readFileSync('src/components/HomeScreen.tsx', 'utf8');

// 1. Replace the heroBanners array
const oldBannersStart = code.indexOf('const heroBanners = [');
const oldBannersEnd = code.indexOf('];\n\nexport default function HomeScreen');
const newBanners = `const heroBanners = [
  { imageUrl: "/banners/banner1.jpg" },
  { imageUrl: "/banners/banner2.jpg" }
];\n\nexport default function HomeScreen`;

if (oldBannersStart !== -1 && oldBannersEnd !== -1) {
  code = code.substring(0, oldBannersStart) + newBanners + code.substring(oldBannersEnd + 35);
} else {
  console.log("Could not find heroBanners");
}

// 2. Safely replace the specific AnimatePresence block for Main Banner
const bannerComment = '{/* Main Banner (Animated Carousel) */}';
const blockStart = code.indexOf(bannerComment);

if (blockStart !== -1) {
  const presenceStart = code.indexOf('<AnimatePresence mode="wait">', blockStart);
  const presenceEnd = code.indexOf('</AnimatePresence>', presenceStart);
  
  if (presenceStart !== -1 && presenceEnd !== -1) {
    const oldPresence = code.substring(presenceStart, presenceEnd + 18);
    
    const newPresence = `<AnimatePresence mode="wait">
            <motion.div
              key={heroIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full rounded-xl absolute inset-0 mx-3 overflow-hidden shadow-[0_0_15px_rgba(255,11,11,0.3)] border border-[#ff0b0b]"
              style={{ width: 'calc(100% - 24px)' }}
            >
              <img src={heroBanners[heroIndex].imageUrl} className="w-full h-full object-cover" alt="Promotion Banner" />
            </motion.div>
          </AnimatePresence>`;

    code = code.substring(0, presenceStart) + newPresence + code.substring(presenceEnd + 18);
    fs.writeFileSync('src/components/HomeScreen.tsx', code);
    console.log("Successfully replaced banners safely!");
  } else {
    console.log("Could not find AnimatePresence");
  }
} else {
  console.log("Could not find Main Banner comment");
}
