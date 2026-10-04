const fs = require('fs');
let code = fs.readFileSync('src/components/HomeScreen.tsx', 'utf8');

const regex = /<AnimatePresence mode="wait">[\s\S]*?<\/AnimatePresence>/;

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

code = code.replace(regex, newPresence);
fs.writeFileSync('src/components/HomeScreen.tsx', code);
console.log("Replaced AnimatePresence!");
