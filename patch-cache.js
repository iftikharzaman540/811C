const fs = require("fs");
let content = fs.readFileSync("src/components/HomeScreen.tsx", "utf8");

content = content.replace(
  'const [realGames, setRealGames] = useState<any[]>([]);',
  `const [realGames, setRealGames] = useState<any[]>(() => {
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('cachedRealGames');
      if (cached) {
        try { return JSON.parse(cached); } catch(e){}
      }
    }
    return [];
  });`
);

content = content.replace(
  '.then(data => { if(Array.isArray(data)) setRealGames(data); })',
  '.then(data => { if(Array.isArray(data)) { setRealGames(data); localStorage.setItem("cachedRealGames", JSON.stringify(data)); } })'
);

fs.writeFileSync("src/components/HomeScreen.tsx", content);
console.log("Patched HomeScreen.tsx with caching");
