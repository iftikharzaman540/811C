const fs = require('fs');
const file = 'src/components/HomeScreen.tsx';
let code = fs.readFileSync(file, 'utf8');

const lists = ['gamesList', 'miniGamesList', 'slotGamesList', 'fishingGamesList', 'cardsGamesList', 'liveGamesList', 'sportsGamesList'];

let offset = 0;
for (const list of lists) {
    const searchStr = `${list}.map((game, gIdx) => (`;
    let sliceEnd = offset + 6;
    if (list === 'gamesList') sliceEnd = offset + 21;
    if (list === 'miniGamesList') sliceEnd = offset + 12;
    if (list === 'slotGamesList') sliceEnd = offset + 9;
    
    code = code.replace(searchStr, `(realGames.length > 0 ? realGames.slice(${offset}, ${sliceEnd}) : ${list}).map((game: any, gIdx: number) => (`);
    offset = sliceEnd;
}

// 2. Inject the true branch right after the motion.div opening tag.
// The regex finds the className definition for the game cards and the closing `>`
code = code.replace(/className=\{`aspect-\[3\/4\].*?`\}\s*>/g, (match) => {
    return match + `
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
                  ) : (
                    <>`;
});

// 3. Close the true branch before the closing motion.div
// Look for </motion.div> followed by ))
code = code.replace(/<\/motion\.div>\r?\n\s*\)\)/g, "</>)}</motion.div>\n              ))");
code = code.replace(/<\/motion\.div>\r?\n\s*\)\) :/g, "</>)}</motion.div>\n              )) :"); // For the ternary

// 4. Update the onClick handlers to launch real games correctly
code = code.replace(/onClick=\{\(\) => \{\s*if \(typeof window !== 'undefined'.*?\s*\(window as any\).*?game\.name\);\s*\}\s*\}\}/gs, "onClick={() => { if (typeof window !== 'undefined' && (window as any).handleLaunchGame) { (window as any).handleLaunchGame(game.id || game.name); } }}");
code = code.replace(/onClick=\{\(\) => handleLaunchGame\(game\.name\)\}/g, "onClick={() => { if (typeof window !== 'undefined' && (window as any).handleLaunchGame) { (window as any).handleLaunchGame(game.id || game.name); } }}");

// 5. Add realGames state
code = code.replace(
    "const [isMenuOpen, setIsMenuOpen] = useState(false);",
    "const [isMenuOpen, setIsMenuOpen] = useState(false);\n  const [realGames, setRealGames] = useState<any[]>([]);"
);

// 6. Update useEffect to fetch real games and redefine handleLaunchGame
const launchReplacement = `
    useEffect(() => {
      fetch('/api/v1/games/gregmorn/list?t=' + Date.now())
        .then(r => r.json())
        .then(data => {
          if(Array.isArray(data)) setRealGames(data);
        })
        .catch(e => console.error("Error fetching games", e));
        
      (window as any).handleLaunchGame = async (gameIdOrName: string) => {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Please login to play games!");
          if (onLoginClick) onLoginClick();
          return;
        }
        
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
    /useEffect\(\(\) => \{\s*\(window as any\)\.handleLaunchGame = async \(gameName: string\) => \{[\s\S]*?duration: 4000 \}\);\s*\};/g,
    launchReplacement
);

fs.writeFileSync(file, code);
console.log("Patched hybrid regex robustly!");
