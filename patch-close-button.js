const fs = require('fs');
let code = fs.readFileSync('src/components/HomeScreen.tsx', 'utf8');

const closeButtonJSX = `
            <div className="h-10 bg-black flex items-center justify-between px-3 border-b border-[#333] shrink-0 shadow-md relative z-[10001]">
              <span className="text-[#ffdf00] font-bold text-xs uppercase tracking-wider">Playing Game</span>
              <button 
                onClick={() => {
                  if (window.location.hash === '#game') {
                    window.history.back();
                  } else {
                    setGameUrl(null);
                  }
                }}
                className="bg-[#ff0b0b] hover:bg-red-600 active:scale-95 text-white px-3 py-1 rounded-sm text-[11px] font-bold transition-all shadow-[0_0_8px_rgba(255,11,11,0.5)]"
              >
                Close Game
              </button>
            </div>
`;

code = code.replace(
  '<div className="flex-1 w-full relative bg-black"',
  closeButtonJSX + '\n            <div className="flex-1 w-full relative bg-black"'
);

fs.writeFileSync('src/components/HomeScreen.tsx', code);
console.log("Restored Close Game button for iPhone users!");
