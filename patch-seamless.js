const fs = require('fs');
const file = 'src/components/HomeScreen.tsx';
let code = fs.readFileSync(file, 'utf8');

// 1. Replace arrays being mapped with the combined arrays
const lists = ['gamesList', 'miniGamesList', 'slotGamesList', 'fishingGamesList', 'cardsGamesList', 'liveGamesList', 'sportsGamesList'];
let offset = 0;
for (const list of lists) {
    const searchStr = `${list}.map((game, gIdx) => (`;
    let sliceEnd = offset + 6;
    if (list === 'gamesList') sliceEnd = offset + 21;
    if (list === 'miniGamesList') sliceEnd = offset + 12;
    if (list === 'slotGamesList') sliceEnd = offset + 9;
    
    // There are multiple `.map` instances for slotGamesList due to the ternary
    code = code.replace(new RegExp(`${list}\\.map\\(\\(game, gIdx\\) => \\(`, 'g'), `(realGames.length > 0 ? realGames.slice(${offset}, ${sliceEnd}) : ${list}).map((game: any, gIdx: number) => (`);
    
    // The slice map
    if (list === 'slotGamesList') {
        code = code.replace(/slotGamesList\.slice\(0,3\)\.map\(\(game, gIdx\) => \(/g, `(realGames.length > 0 ? realGames.slice(${offset}, ${offset+3}) : slotGamesList.slice(0,3)).map((game: any, gIdx: number) => (`);
    }
    
    offset = sliceEnd;
}

// 2. Inject image rendering over game.graphic
code = code.replace(/\{game\.graphic\}/g, "{game.imageUrl ? <img src={game.imageUrl} className=\"w-full h-full object-cover rounded-xl absolute inset-0 z-0\" /> : game.graphic}");
// slotGamesList has an array of graphics for collage: game.graphic[0] etc.
// We'll leave the collage alone. If it's a real game, game.collage will be undefined and it won't render the collage branch!
// Let's check the collage logic: `game.collage ? (...) : (...)`. Since realGames don't have `collage`, they will fall to the `else` branch, which uses `{game.graphic}`!

// 3. Inject game.title over game.name
code = code.replace(/\{game\.name\}/g, "{game.title || game.name}");

// 4. Update the onClick handlers to launch real games correctly
code = code.replace(/onClick=\{\(\) => \{\s*if \(typeof window !== 'undefined'.*?\s*\(window as any\).*?game\.name\);\s*\}\s*\}\}/gs, "onClick={() => { if (typeof window !== 'undefined' && (window as any).handleLaunchGame) { (window as any).handleLaunchGame(game.id || game.name); } }}");
code = code.replace(/onClick=\{\(\) => handleLaunchGame\(game\.name\)\}/g, "onClick={() => { if (typeof window !== 'undefined' && (window as any).handleLaunchGame) { (window as any).handleLaunchGame(game.id || game.name); } }}");
// Note: original code has `(window as any).handleLaunchGame(game.name)`

// 5. Add default background color for real games (which don't have game.img)
code = code.replace(/className=\{`aspect-\[3\/4\] \$\{game\.img\}/g, "className={`aspect-[3/4] ${game.img || 'bg-neutral-900'}");

// 6. Add realGames state
code = code.replace(
    "const [isMenuOpen, setIsMenuOpen] = useState(false);",
    "const [isMenuOpen, setIsMenuOpen] = useState(false);\n  const [realGames, setRealGames] = useState<any[]>([]);"
);

// 7. Update useEffect to fetch real games and redefine handleLaunchGame
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
console.log("Patched seamlessly!");
