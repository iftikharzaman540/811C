const fs = require('fs');
let homeCode = fs.readFileSync('src/components/HomeScreen.tsx', 'utf8');

// 1. Inject the handleLaunchGame function
if (!homeCode.includes('handleLaunchGame = async')) {
  homeCode = homeCode.replace('  useEffect(() => {', `
  useEffect(() => {
    (window as any).handleLaunchGame = async (gameName: string) => {
      if (!user) {
        toast.error("Please login to play games!");
        if (onLoginClick) onLoginClick();
        return;
      }
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";
        toast.loading(\`Launching \${gameName}...\`);
        const res = await fetch(\`\${API_URL}/games/launch/\${encodeURIComponent(gameName)}\`, {
          method: "POST",
          headers: { Authorization: \`Bearer \${token}\` }
        });
        toast.dismiss();
        if (res.ok) {
          const data = await res.json();
          if (data && data.url) {
            setGameUrl(data.url);
          } else {
            toast.success(\`Game \${gameName} launched!\`);
          }
        } else {
          const error = await res.json();
          toast.error(error.message || "Failed to launch game");
        }
      } catch (e) {
        toast.dismiss();
        toast.error("Error launching game");
      }
    };
`);
}

// 2. Inject onClick into the game cards
homeCode = homeCode.replace(/className=\{\`aspect-\[3\/4\] \$\{game\.img\} rounded-xl relative overflow-hidden flex flex-col shadow-\[0_0_10px_rgba\(255,11,11,0\.4\)\] group cursor-pointer border border-\[\#ff0b0b\]\`\}/g, 
  `onClick={() => {
                  if (typeof window !== 'undefined' && (window as any).handleLaunchGame) {
                    (window as any).handleLaunchGame(game.name);
                  }
                }}
                className={\`aspect-[3/4] \${game.img} rounded-xl relative overflow-hidden flex flex-col shadow-[0_0_10px_rgba(255,11,11,0.4)] group cursor-pointer border border-[#ff0b0b]\`}`);

fs.writeFileSync('src/components/HomeScreen.tsx', homeCode);
console.log('HomeScreen patched successfully');
