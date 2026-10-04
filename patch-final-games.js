const fs = require("fs");
let content = fs.readFileSync("src/components/HomeScreen.tsx", "utf8");

const replacement = `            if(Array.isArray(data)) { 
              // Deduplicate by name to prevent multiple Fortune Gems
              const seen = new Set();
              data = data.filter(g => {
                 const name = (g.title || g.name || "").toLowerCase().trim();
                 if (seen.has(name)) return false;
                 seen.add(name);
                 return true;
              });

              // Reorder games
              const getRank = (game: any) => {
                  const t = (game.title || game.name || "").toLowerCase();
                  if (t === "aviator" || t.includes("aviator")) return 1;
                  if (t === "plinko" || t.includes("plinko")) return 2;
                  if (t.includes("chicken road 2")) return 4;
                  if (t.includes("chicken road")) return 3;
                  if (t.includes("dragon tiger luck") || t.includes("dragon tiger (pg soft)")) return 5;
                  if (t.includes("money coming")) return 6;
                  if (t.includes("super dragon tiger")) return 9;
                  if (t.includes("dragon tiger fortune")) return 10;
                  if (t === "mines" || t.includes("mines")) return 12;
                  if (t.includes("fortune gems 3")) return 13;
                  if (t.includes("fortune gems 2")) return 11;
                  if (t.includes("super ace joker")) return 8;
                  if (t === "fortune gems" || t.includes("fortune gems")) return 7;
                  return 999;
              };`;

content = content.replace(/if\(Array\.isArray\(data\)\) \{[\s\S]*?const getRank = \(game: any\) => \{[\s\S]*?return 999;\s*\};/m, replacement);

fs.writeFileSync("src/components/HomeScreen.tsx", content);
console.log("Updated HomeScreen with Dragon Tiger Fortune at 10 and Mines at 12");
