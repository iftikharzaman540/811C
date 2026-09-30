const fs = require('fs');
let code = fs.readFileSync('src/components/HomeScreen.tsx', 'utf8');

// 1. Replace the heroBanners array
const oldBannersStart = code.indexOf('const heroBanners = [');
const oldBannersEnd = code.indexOf('];\n\nexport default function HomeScreen');
const newBanners = `const heroBanners = [
  { imageUrl: "/banners/banner1.jpg" },
  { imageUrl: "/banners/banner2.jpg" }
];\n\nexport default function HomeScreen`;

code = code.substring(0, oldBannersStart) + newBanners + code.substring(oldBannersEnd + 35); // 35 is length of '];\n\nexport default function HomeScreen'

// 2. Replace the inside of AnimatePresence
const presenceStart = code.indexOf('<AnimatePresence mode="wait">');
const presenceEnd = code.indexOf('</AnimatePresence>');

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

code = code.replace(oldPresence, newPresence);

fs.writeFileSync('src/components/HomeScreen.tsx', code);
console.log("Successfully replaced banners!");
