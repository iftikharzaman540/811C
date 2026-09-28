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
    
    code = code.replace(searchStr, `(realGames.length > 0 ? realGames.slice(${offset}, ${sliceEnd}) : ${list}).map((game, gIdx) => (`);
    offset = sliceEnd;
}

let lines = code.split('\n');
let insideTargetMap = false;
let mapNesting = 0;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(".map((game, gIdx) => (")) {
        insideTargetMap = true;
        mapNesting = 0;
    }
    
    if (insideTargetMap) {
        if (lines[i].includes("<motion.div")) {
            mapNesting++;
            if (mapNesting === 1) {
                let j = i;
                while (!lines[j].includes(">")) {
                    j++;
                }
                lines[j] = lines[j].replace(/>/, '> {game.imageUrl ? (<> <div className="absolute inset-0"><img src={game.imageUrl} alt={game.title} className="w-full h-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div></div><div className="absolute top-0 right-0 px-2 py-0.5 bg-[#cc0000] text-white text-[9px] font-bold rounded-bl-lg shadow-md z-10">{game.provider}</div><div className="mt-auto p-2 relative z-10"><h3 className="text-white text-[11px] font-bold leading-tight line-clamp-2 drop-shadow-md">{game.title}</h3></div> </>) : (');
                i = j;
            }
        }
        
        if (lines[i].includes("</motion.div>")) {
            if (mapNesting === 1) {
                lines[i] = lines[i].replace("</motion.div>", ")}</motion.div>");
                insideTargetMap = false;
            }
            mapNesting--;
        }
    }
}

code = lines.join('\n');

code = code.replace(
    "const [isMenuOpen, setIsMenuOpen] = useState(false);",
    "const [isMenuOpen, setIsMenuOpen] = useState(false);\n  const [realGames, setRealGames] = useState<any[]>([]);"
);

code = code.replace(/onClick=\{.*?handleLaunchGame\(game\.name\).*?\}/g, "onClick={() => handleLaunchGame(game.id || game.name)}");
code = code.replace(/onClick=\{\(\) => \{\s*if \(typeof window !== 'undefined'.*?\s*\(window as any\).*?game\.name\);\s*\}\s*\}\}/gs, "onClick={() => handleLaunchGame(game.id || game.name)}");


// Fix the useEffect block correctly
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
console.log("Patched safely 2!");
