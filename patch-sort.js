const fs = require("fs");
let content = fs.readFileSync("src/components/HomeScreen.tsx", "utf8");

const replacement = `.then(data => { 
          if(Array.isArray(data)) { 
            // Reorder games: 1. Aviator 2. Plinko 3. Chicken Road 4. Chicken Road 2.0
            const getRank = (game) => {
              const t = (game.title || game.name || "").toLowerCase();
              if (t.includes("aviator")) return 1;
              if (t.includes("plinko")) return 2;
              if (t.includes("chicken road 2")) return 4;
              if (t.includes("chicken road")) return 3;
              return 999;
            };
            data.sort((a, b) => getRank(a) - getRank(b));
            
            setRealGames(data); 
            localStorage.setItem("cachedRealGames", JSON.stringify(data)); 
          } 
        })`;

content = content.replace(
  '.then(data => { if(Array.isArray(data)) { setRealGames(data); localStorage.setItem("cachedRealGames", JSON.stringify(data)); } })',
  replacement
);

fs.writeFileSync("src/components/HomeScreen.tsx", content);
console.log("Patched HomeScreen.tsx with custom sort");
