const fs = require('fs');
const file = 'src/components/HomeScreen.tsx';
let code = fs.readFileSync(file, 'utf8');

// 1. Change handleLaunchGame
code = code.replace(
  /if \(res\.ok && data\.url\) \{\n\s*window\.location\.href = data\.url;\n\s*\} else \{/g,
  `if (res.ok && data.url) {\n          setGameUrl(data.url);\n        } else {`
);

// 2. Add Iframe Overlay
const searchStr = '<div className="min-h-screen w-full bg-[#111111]';
const iframeOverlay = `
      {/* Game Iframe Overlay */}
      <AnimatePresence>
        {gameUrl && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed inset-0 z-[500] bg-black flex flex-col"
          >
            <div className="h-12 bg-neutral-900 flex items-center justify-between px-4 border-b border-neutral-800 shrink-0">
              <span className="text-white font-bold text-sm">Playing Game</span>
              <button 
                onClick={() => setGameUrl(null)}
                className="bg-[#cc0000] hover:bg-[#ff0000] text-white px-4 py-1.5 rounded text-xs font-bold transition-colors"
              >
                Close Game
              </button>
            </div>
            <iframe 
              src={gameUrl} 
              className="w-full flex-1 border-0"
              allow="autoplay; fullscreen"
            />
          </motion.div>
        )}
      </AnimatePresence>
`;

if (code.includes(searchStr)) {
  code = code.replace(searchStr, iframeOverlay + '\n' + searchStr);
  fs.writeFileSync(file, code);
  console.log('Patched');
} else {
  console.log('Could not find search string');
}
