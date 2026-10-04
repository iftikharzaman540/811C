const fs = require('fs');
const file = 'src/components/HomeScreen.tsx';
let code = fs.readFileSync(file, 'utf8');

// We will replace the fetch logic to get 100 games
code = code.replace(
  "if(Array.isArray(data)) setRealGames(data.slice(0, 30));",
  "if(Array.isArray(data)) setRealGames(data.slice(0, 100));"
);

// We need to replace all instances of slotGamesList, originalGamesList, etc. with slices of realGames
// Hot Games (slice 0, 6)
code = code.replace(
  "slotGamesList.slice(0,6).map((game, i)",
  "realGames.slice(0,6).map((game, i)"
);
// Original Games (slice 6, 12)
code = code.replace(
  "originalGamesList.map((game, i)",
  "realGames.slice(6,12).map((game, i)"
);
// And the Slot Games Grid condition (remove dummy fallback)
code = code.replace(
  "{realGames.length > 0 ? realGames.map((game, gIdx) => (",
  "{realGames.slice(12, 100).map((game, gIdx) => ("
);
// Remove the dummy fallback entirely
// We need to find the exact block for the fallback
code = code.replace(
  /\)\) : slotGamesList\.map\(\(game, gIdx\) => \([\s\S]*?<\/motion\.div>\s*\)\)/,
  "))"
);

// We should also replace the `gameName` passing logic. 
// Wait, for Hot Games and Original Games, they use window.handleLaunchGame(game.name). We should change it to use real handleLaunchGame(game.id)
code = code.replace(
  "onClick={() => (window as any).handleLaunchGame(game.name)}",
  "onClick={() => handleLaunchGame(game.id)}"
);
// Second instance of onClick
code = code.replace(
  "onClick={() => (window as any).handleLaunchGame(game.name)}",
  "onClick={() => handleLaunchGame(game.id)}"
);

code = code.replace(
  "onClick={() => (window as any).handleLaunchGame(game.name)}",
  "onClick={() => handleLaunchGame(game.id)}"
);

// For original games, the title is in game.title, wait, the dummy uses game.name. The real games use game.title.
// So we must change game.name to game.title in the UI
code = code.replace(
  /{game\.name}/g,
  "{game.title || game.name}"
);
code = code.replace(
  /{game\.image}/g,
  "{game.imageUrl || game.image}"
);

// If the API call fails, `realGames` will be empty, so we won't show anything. But we should at least show a loading state if it's empty.
code = code.replace(
  "const [realGames, setRealGames] = useState<any[]>([]);",
  "const [realGames, setRealGames] = useState<any[]>([]);\n    const [loadingGames, setLoadingGames] = useState(true);"
);

code = code.replace(
  ".catch(e => console.error(\"Error fetching games\", e));",
  ".catch(e => console.error(\"Error fetching games\", e)).finally(() => setLoadingGames(false));"
);

fs.writeFileSync(file, code);
console.log("Patched HomeScreen UI");
