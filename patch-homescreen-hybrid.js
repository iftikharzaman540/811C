const fs = require('fs');
const file = 'src/components/HomeScreen.tsx';
let code = fs.readFileSync(file, 'utf8');

// We need to replace all instances of `(window as any).handleLaunchGame(game.name);` with `handleLaunchGame(game.id || game.name)`
code = code.replace(/if \(typeof window !== 'undefined' && \(window as any\)\.handleLaunchGame\) \{\s*\(window as any\)\.handleLaunchGame\(game\.name\);\s*\}/g, "handleLaunchGame(game.id || game.name)");
code = code.replace(/\(window as any\)\.handleLaunchGame\(game\.name\)/g, "handleLaunchGame(game.id || game.name)");

// Now, for every map function:
const lists = ['gamesList', 'miniGamesList', 'slotGamesList', 'fishingGamesList', 'cardsGamesList', 'liveGamesList', 'sportsGamesList'];

let offset = 0;
for (const list of lists) {
    const searchStr = `${list}.map((game, gIdx) => (`;
    // We want to replace it with realGames slice
    let sliceEnd = offset + 6;
    if (list === 'gamesList') sliceEnd = offset + 21; // Hot has 21 games originally
    if (list === 'miniGamesList') sliceEnd = offset + 12;
    if (list === 'slotGamesList') sliceEnd = offset + 9;
    
    // Replace the array being mapped
    code = code.replace(searchStr, `(realGames.length > 0 ? realGames.slice(${offset}, ${sliceEnd}) : ${list}).map((game, gIdx) => (`);
    offset = sliceEnd;
}

// Next, we need to inject the real game image renderer into the motion.div.
// The easiest way is to find `<motion.div` and its closing tag, but that's hard with regex.
// Instead, let's just insert a check right after the `className` of motion.div.
// In the original code, motion.div ends with `>` and then it has `{/* Main graphic placeholder */}` or something.

code = code.replace(/className=\{`aspect-\[3\/4\] \$\{game\.img(\s*\|\|\s*'bg-neutral-900')?\} rounded-xl relative overflow-hidden flex flex-col shadow-\[0_0_10px_rgba\(255,11,11,0\.4\)\] group cursor-pointer border border-\[#ff0b0b\]`\}\s*>/g, 
`className={\`aspect-[3/4] \${game.img || 'bg-neutral-900'} rounded-xl relative overflow-hidden flex flex-col shadow-[0_0_10px_rgba(255,11,11,0.4)] group cursor-pointer border border-[#ff0b0b]\`}
                >
                  {game.imageUrl ? (
                    <>
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
                    </>
                  ) : (`);

// And we must close the `)` at the end of the motion.div.
// Finding the closing `</motion.div>`
code = code.replace(/<\/motion\.div>/g, ")}</motion.div>");

// Wait, the first motion.div (for Hero banner) doesn't match the regex, so it won't have the `)` injected.
// Let's make sure! The hero banner has `className="w-full h-full rounded-xl absolute inset-0...` so it won't match.

// Let's also fix the fetch to use the native /api/v1
code = code.replace(
    /fetch\('\/api\/v1\/games\/gregmorn\/list\?t=' \+ Date\.now\(\)\)/g,
    "fetch('/api/v1/games/gregmorn/list?t=' + Date.now())" // Already uses /api/v1!
);

// Define realGames state
code = code.replace(
    "const [isMenuOpen, setIsMenuOpen] = useState(false);",
    "const [isMenuOpen, setIsMenuOpen] = useState(false);\n  const [realGames, setRealGames] = useState<any[]>([]);"
);

// Define handleLaunchGame correctly (it was defined in useEffect in the original, we'll keep it there but fix it if needed)
// Wait, the original had `(window as any).handleLaunchGame = async ...`. It used `toast.error` for dummy games.
// We need to modify `(window as any).handleLaunchGame` to ACTUALLY LAUNCH the game if it's a real game id!
const launchReplacement = `
      (window as any).handleLaunchGame = async (gameIdOrName: string) => {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Please login to play games!");
          if (onLoginClick) onLoginClick();
          return;
        }
        
        // If it's a dummy game name (like "Aviator"), it won't match a real UUID.
        if (gameIdOrName.length < 10) {
           toast.error(\`"\${gameIdOrName}" is a UI Demo. Please play real games from the 'Slot Game' section below!\`, { duration: 4000 });
           return;
        }

        try {
          toast.loading("Launching game...", { id: 'launch' });
          const API_URL = "/api/v1";
          const res = await fetch(\`\${API_URL}/games/gregmorn/launch\`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': \`Bearer \${token}\`
            },
            body: JSON.stringify({ gameId: gameIdOrName, demo: false })
          });
          const data = await res.json();
          toast.dismiss('launch');
          if (res.ok && data.url) {
            setGameUrl(data.url);
          } else {
            toast.error("Failed to launch game");
          }
        } catch (e) {
          toast.dismiss('launch');
          toast.error("An error occurred");
          console.error(e);
        }
      };
`;

code = code.replace(
    /\(window as any\)\.handleLaunchGame = async \(gameName: string\) => \{[\s\S]*?duration: 4000 \}\);\s*\};/g,
    launchReplacement
);

// Also we need to ADD the fetch for realGames inside useEffect!
// The original `92e5d2c` DID NOT have the fetch inside useEffect! I added it in a later commit!
const fetchInjection = `
    useEffect(() => {
      fetch('/api/v1/games/gregmorn/list?t=' + Date.now())
        .then(r => r.json())
        .then(data => {
          if(Array.isArray(data)) setRealGames(data);
        })
        .catch(e => console.error("Error fetching games", e));
        
      (window as any).handleLaunchGame = async
`;

code = code.replace(
    /useEffect\(\(\) => \{\s*\(window as any\)\.handleLaunchGame = async/g,
    fetchInjection
);

fs.writeFileSync(file, code);
console.log("Patched HomeScreen to use original design but real games!");
