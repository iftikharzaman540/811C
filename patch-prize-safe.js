const fs = require('fs');
let code = fs.readFileSync('src/components/HomeScreen.tsx', 'utf8');

// 1. Insert State & Effect
const stateInsertionPoint = code.indexOf('const [isLoadingGames, setIsLoadingGames] = useState(true);');
if (stateInsertionPoint !== -1) {
  const newState = `const [dynamicWinners, setDynamicWinners] = useState<any[]>([]);

  useEffect(() => {
    if (realGames.length > 0) {
      const winners = [];
      for (let i = 0; i < 20; i++) {
        const randomGame = realGames[Math.floor(Math.random() * realGames.length)];
        const randomUser = \`\${Math.floor(Math.random() * 9) + 1}***\${Math.floor(Math.random() * 90) + 10}\`;
        const randomAmount = (Math.random() * 200000 + 10000).toLocaleString('en-US', { maximumFractionDigits: 0 });
        winners.push({
          gameId: randomGame.id,
          provider: randomGame.provider || 'Slot',
          title: randomGame.title || randomGame.name || 'Game',
          img: randomGame.imageUrl,
          user: randomUser,
          amount: randomAmount
        });
      }
      setDynamicWinners([...winners, ...winners, ...winners]);
    }
  }, [realGames]);

  `;
  // check if dynamicWinners is already there from previous failed run
  if (code.indexOf('const [dynamicWinners') === -1) {
    code = code.substring(0, stateInsertionPoint) + newState + code.substring(stateInsertionPoint);
  }
}

// 2. Rewrite Grand Prize Record
const startStr = '{/* Grand Prize Record */}';
const endStr = '</>\n          )\n          }';

const startIdx = code.indexOf(startStr);
const endIdx = code.indexOf(endStr);

if (startIdx !== -1 && endIdx !== -1) {
  const newGrandPrize = `{/* Grand Prize Record */}
        <div className="mb-8 px-4 pb-4">
          <div className="bg-[#1c1c1c] rounded-xl py-3.5 overflow-hidden shadow-lg border border-neutral-800/50">
            {/* Title */}
            <h2 className="text-center text-[13px] text-white font-medium mb-3 flex items-center justify-center gap-1.5">
              <div className="flex gap-0.5 opacity-50">
                <div className="w-1.5 h-1.5 border border-white transform rotate-45"></div>
                <div className="w-1.5 h-1.5 bg-white transform rotate-45"></div>
              </div>
              Grand Prize Record
              <div className="flex gap-0.5 opacity-50">
                <div className="w-1.5 h-1.5 bg-white transform rotate-45"></div>
                <div className="w-1.5 h-1.5 border border-white transform rotate-45"></div>
              </div>
            </h2>
            
            {/* Left to Right Marquee Container */}
            <div className="w-full overflow-hidden relative">
              {/* Fade masks */}
              <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-[#1c1c1c] to-transparent z-10 pointer-events-none"></div>
              <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-[#1c1c1c] to-transparent z-10 pointer-events-none"></div>
              
              {/* Left-to-right animation */}
              <motion.div 
                animate={{ x: ["-50%", "0%"] }} 
                transition={{ repeat: Infinity, duration: 45, ease: "linear" }}
                className="flex gap-4 w-max px-2"
              >
                {(dynamicWinners.length > 0 ? dynamicWinners : marqueeWinners).map((winner, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => { if(winner.gameId) { const w = window as any; if(w.handleLaunchGame) w.handleLaunchGame(winner.gameId); else toast.error("Loading game..."); } else toast.error("Loading..."); }}
                    className="flex flex-col items-center w-[75px] shrink-0 cursor-pointer group"
                  >
                    {/* Game Icon */}
                    <div className={\`w-[75px] h-[75px] rounded-[14px] \${winner.img && winner.img.startsWith('http') ? 'bg-neutral-900 border border-neutral-800' : winner.img || 'bg-gradient-to-br from-green-400 to-emerald-600'} flex flex-col items-center justify-center mb-1.5 shadow-[0_0_10px_rgba(0,0,0,0.5)] relative overflow-hidden group-hover:scale-105 group-hover:shadow-[0_0_15px_rgba(255,223,0,0.4)] transition-all\`}>
                       {winner.img && winner.img.startsWith('http') ? (
                         <img src={winner.img} className="w-full h-full object-cover absolute inset-0 z-0" alt="game" />
                       ) : (
                         <span className="text-4xl drop-shadow-lg mt-2">{winner.icon || '🎰'}</span>
                       )}
                       <div className="absolute top-0 w-full bg-black/60 backdrop-blur-sm z-10 text-center py-[2px] border-b border-white/10">
                         <span className="text-white/90 text-[9px] font-black tracking-widest uppercase">{winner.provider ? winner.provider.substring(0, 8) : winner.game}</span>
                       </div>
                    </div>
                    {/* User */}
                    <div className="text-center w-full mt-0.5">
                       <span className="text-neutral-400 text-[10px] tracking-widest">{winner.user}</span>
                       <span className="text-[#ff3333] text-[10px] ml-1 font-bold">win</span>
                    </div>
                    {/* Amount */}
                    <div className="flex items-center justify-center gap-0.5 mt-0.5 bg-neutral-900/50 px-1.5 py-0.5 rounded-full border border-neutral-800">
                       <span className="text-yellow-500 text-[8px] font-black border border-yellow-500 rounded-full w-[13px] h-[13px] flex items-center justify-center pt-[1px]">Rs</span>
                       <span className="text-yellow-500 text-[12px] font-black tracking-tighter leading-none">{winner.amount}</span>
                       <span className="text-neutral-500 text-[10px] leading-none ml-0.5">›</span>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
        
        `;
        
  code = code.substring(0, startIdx) + newGrandPrize + code.substring(endIdx);
  fs.writeFileSync('src/components/HomeScreen.tsx', code);
  console.log("Successfully patched Grand Prize Record without breaking JSX!");
} else {
  console.log("Could not find Grand Prize Record section correctly");
}
