const fs = require('fs');
const file = 'src/components/HomeScreen.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  "const [realGames, setRealGames] = useState<any[]>([]);",
  "const [realGames, setRealGames] = useState<any[]>([]);\n    const [loadingGames, setLoadingGames] = useState(true);"
);

code = code.replace(
  ".catch(e => console.error(\"Error fetching games\", e));",
  ".catch(e => console.error(\"Error fetching games\", e)).finally(() => setLoadingGames(false));"
);

// We should also make sure the `.then(data => {` sets loadingGames to false
code = code.replace(
  "if(Array.isArray(data)) setRealGames(data.slice(0, 250));",
  "if(Array.isArray(data)) setRealGames(data.slice(0, 250));\n        setLoadingGames(false);"
);

fs.writeFileSync(file, code);
console.log("Patched loadingGames");
