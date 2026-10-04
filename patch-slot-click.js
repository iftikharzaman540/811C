const fs = require('fs');
let code = fs.readFileSync('src/components/HomeScreen.tsx', 'utf8');

const targetStr = `              {realGames.slice(33 + pages.slot * 9, 33 + (pages.slot + 1) * 9).map((game: any, gIdx: number) => (
                <motion.div 
                  key={gIdx}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className=\`aspect-[3/4] \${game.img || 'bg-neutral-900'} rounded-xl relative overflow-hidden flex flex-col shadow-[0_0_10px_rgba(255,11,11,0.4)] group cursor-pointer border border-[#ff0b0b]\`
                >`;

const replacementStr = `              {realGames.slice(33 + pages.slot * 9, 33 + (pages.slot + 1) * 9).map((game: any, gIdx: number) => (
                <motion.div 
                  key={gIdx}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => { if (typeof window !== 'undefined' && (window as any).handleLaunchGame) { (window as any).handleLaunchGame(game.id || game.name); } }}
                  className=\`aspect-[3/4] \${game.img || 'bg-neutral-900'} rounded-xl relative overflow-hidden flex flex-col shadow-[0_0_10px_rgba(255,11,11,0.4)] group cursor-pointer border border-[#ff0b0b]\`
                >`;

code = code.replace(targetStr, replacementStr);
fs.writeFileSync('src/components/HomeScreen.tsx', code);
console.log("Added onClick handler to Slot games!");
