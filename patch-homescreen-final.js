const fs = require('fs');
const file = 'src/components/HomeScreen.tsx';
let code = fs.readFileSync(file, 'utf8');

const startTag = '{/* Single Main Grid Section (Hot) */}';
const endTag = '{/* Game Categories Grid */}';

const startIndex = code.indexOf(startTag);
const endIndex = code.indexOf(endTag);

if (startIndex === -1 || endIndex === -1) {
  console.log("Could not find blocks");
  process.exit(1);
}

const replacement = `{/* Real Games Grid */}
          <div className="mb-8 px-4">
            
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-1.5">
                <span className="text-[20px] drop-shadow-[0_2px_4px_rgba(255,100,0,0.8)] -ml-1">🎰</span>
                <h2 className="text-[17px] font-bold text-white tracking-tight">Real Games</h2>
              </div>
            </div>

            {loadingGames ? (
              <div className="w-full flex items-center justify-center p-12">
                <div className="w-8 h-8 border-4 border-[#ff0b0b] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : realGames.length > 0 ? (
              <div className="grid grid-cols-3 gap-2.5">
                {realGames.map((game, gIdx) => (
                  <motion.div 
                    key={game.id || gIdx}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleLaunchGame(game.id)}
                    className="aspect-[3/4] bg-neutral-900 rounded-xl relative overflow-hidden flex flex-col shadow-[0_0_10px_rgba(255,11,11,0.4)] group cursor-pointer border border-[#ff0b0b]"
                  >
                    <div className="absolute inset-0">
                      <img src={game.imageUrl} alt={game.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                    </div>
                    <div className="absolute top-0 right-0 px-2 py-0.5 bg-[#cc0000] text-white text-[9px] font-bold rounded-bl-lg shadow-md z-10">
                      {game.provider}
                    </div>
                    <div className="mt-auto p-2 relative z-10">
                      <h3 className="text-white text-[11px] font-bold leading-tight line-clamp-2 drop-shadow-md">{game.title}</h3>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="w-full text-center text-neutral-400 p-8">No games found.</div>
            )}
          </div>

          `;

code = code.substring(0, startIndex) + replacement + code.substring(endIndex);

// Update fetch to fetch top 150 games
code = code.replace(
  "if(Array.isArray(data)) setRealGames(data.slice(0, 30));",
  "if(Array.isArray(data)) setRealGames(data.slice(0, 150));"
);

fs.writeFileSync(file, code);
console.log("Successfully replaced ALL mock game grids with ONE real games grid!");
