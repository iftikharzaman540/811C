const fs = require('fs');
const file = 'src/components/HomeScreen.tsx';
let code = fs.readFileSync(file, 'utf8');

// The best way is to find the <AnimatePresence mode="wait"> block and replace its contents.
const animateStart = code.indexOf('<AnimatePresence mode="wait">');
const animateEndStr = '</AnimatePresence>';
const animateEnd = code.indexOf(animateEndStr, animateStart) + animateEndStr.length;

if (animateStart === -1 || animateEnd === -1) {
  console.log("Could not find AnimatePresence block");
  process.exit(1);
}

const newAnimateBlock = `<AnimatePresence mode="wait">
  <motion.div
    key={activeTab}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    className="pb-24 pt-4"
  >
    {loadingGames ? (
      <div className="w-full flex items-center justify-center p-12">
        <div className="w-8 h-8 border-4 border-[#ff0b0b] border-t-transparent rounded-full animate-spin"></div>
      </div>
    ) : realGames.length > 0 ? (
      <div className="grid grid-cols-3 gap-2.5">
        {realGames
          .slice(
            activeTab === 'hot' ? 0 :
            activeTab === 'original' ? 30 :
            activeTab === 'slots' ? 60 :
            activeTab === 'fishing' ? 90 :
            activeTab === 'cards' ? 120 :
            activeTab === 'live' ? 150 :
            activeTab === 'sports' ? 180 : 0,

            activeTab === 'hot' ? 30 :
            activeTab === 'original' ? 60 :
            activeTab === 'slots' ? 90 :
            activeTab === 'fishing' ? 120 :
            activeTab === 'cards' ? 150 :
            activeTab === 'live' ? 180 :
            activeTab === 'sports' ? 210 : 30
          )
          .map((game, gIdx) => (
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
  </motion.div>
</AnimatePresence>`;

code = code.substring(0, animateStart) + newAnimateBlock + code.substring(animateEnd);

// Also we should fetch 250 games instead of 100 so all tabs have games!
code = code.replace(
  "if(Array.isArray(data)) setRealGames(data.slice(0, 100));",
  "if(Array.isArray(data)) setRealGames(data.slice(0, 250));"
);
code = code.replace(
  "if(Array.isArray(data)) setRealGames(data.slice(0, 30));",
  "if(Array.isArray(data)) setRealGames(data.slice(0, 250));"
);

fs.writeFileSync(file, code);
console.log("Successfully replaced AnimatePresence block to ONLY show REAL GAMES everywhere!");
