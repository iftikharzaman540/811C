const fs = require('fs');
let code = fs.readFileSync('src/components/HomeScreen.tsx', 'utf8');

// Add real games state
code = code.replace(
  'const [isMenuOpen, setIsMenuOpen] = useState(false);',
  `const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [realGames, setRealGames] = useState<any[]>([]);
  
  useEffect(() => {
    fetch('/api/v1/games/gregmorn/list')
      .then(r => r.json())
      .then(data => {
        if(Array.isArray(data)) setRealGames(data.slice(0, 30));
      })
      .catch(e => console.error("Error fetching games", e));
  }, []);

  const handleLaunchGame = async (gameId: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error("Please login to play");
      return;
    }
    try {
      toast.loading("Launching game...", { id: 'launch' });
      const res = await fetch('/api/v1/games/gregmorn/launch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': \`Bearer \${token}\`
        },
        body: JSON.stringify({ gameId, demo: false })
      });
      const data = await res.json();
      toast.dismiss('launch');
      if (res.ok && data.url) {
        window.location.href = data.url;
      } else {
        toast.error("Failed to launch game");
      }
    } catch (e) {
      toast.dismiss('launch');
      toast.error("Error launching game");
    }
  };
`
);

// Modify Slot games rendering to use real games if available, fallback to mock
code = code.replace(
  '{slotGamesList.map((game, gIdx) => (',
  `{realGames.length > 0 ? realGames.map((game, gIdx) => (
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
            )) : slotGamesList.map((game, gIdx) => (`
);

// We need to add the closing parenthesis and colon for the ternary condition
// Look for the end of the slotGamesList.map block:
//               </motion.div>
//            ))}
// We need to replace `))} ` with `))}`
code = code.replace(
  '</motion.div>\n            ))}',
  '</motion.div>\n            )))}'
);

fs.writeFileSync('src/components/HomeScreen.tsx', code);
console.log("Patched HomeScreen.tsx");
