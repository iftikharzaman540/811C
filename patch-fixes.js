const fs = require('fs');

// --- 1. Fix Profile Page ---
let profileCode = fs.readFileSync('src/app/profile/page.tsx', 'utf8');
profileCode = profileCode.replace('onClick={() => toast.success("Feature coming soon: Integration in progress")}', 'onClick={() => window.location.href = "/withdraw"}');
profileCode = profileCode.replace('<div className="flex flex-col items-center gap-2 relative">', '<div onClick={() => window.location.href = "/deposit"} className="flex flex-col items-center gap-2 relative cursor-pointer hover:scale-105 transition-transform">');
fs.writeFileSync('src/app/profile/page.tsx', profileCode);

// --- 2. Fix In-App Game Iframe in HomeScreen ---
let homeCode = fs.readFileSync('src/components/HomeScreen.tsx', 'utf8');

// Add gameUrl state
if (!homeCode.includes('const [gameUrl, setGameUrl] = useState<string | null>(null);')) {
  homeCode = homeCode.replace('const [isDepositMenuOpen, setIsDepositMenuOpen] = useState(false);', 
    'const [isDepositMenuOpen, setIsDepositMenuOpen] = useState(false);\n  const [gameUrl, setGameUrl] = useState<string | null>(null);');
}

// Replace window.location.href with setGameUrl
homeCode = homeCode.replace('window.location.href = data.url;', 'setGameUrl(data.url);');

// Add the Iframe modal JSX at the very bottom before the closing tag of min-h-screen
const iframeModal = `
      {gameUrl && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex flex-col">
          <div className="p-3 flex justify-between items-center bg-[#0a0a0a] border-b border-neutral-800">
            <span className="text-[#ffdf00] font-bold text-sm">JJWin Game</span>
            <button onClick={() => setGameUrl(null)} className="bg-[#cc0000] text-white px-3 py-1 rounded-sm font-bold text-xs hover:bg-[#ff0000]">
              Close Game
            </button>
          </div>
          <iframe src={gameUrl} className="w-full flex-1 border-0" allowFullScreen></iframe>
        </div>
      )}
`;

if (!homeCode.includes('Close Game')) {
  homeCode = homeCode.replace('      <BottomNav activeTab="home" />\n    </div>', iframeModal + '\n      <BottomNav activeTab="home" />\n    </div>');
}

fs.writeFileSync('src/components/HomeScreen.tsx', homeCode);

console.log('Profile and Game Iframe fixed!');
