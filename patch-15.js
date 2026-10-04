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

              // Reorder games: Explicit 15 game sequence
              const getRank = (game: any) => {
                  const t = (game.title || game.name || "").toLowerCase();
                  if (t === "aviator" || t.includes("aviator")) return 1;
                  if (t.includes("dragon tiger luck") || t.includes("dragon tiger (pg soft)")) return 2;
                  if (t.includes("chicken road")) {
                      if (t.includes("2")) return 4;
                      return 3;
                  }
                  if (t === "plinko" || t.includes("plinko")) return 5;
                  if (t.includes("money coming")) return 6;
                  if (t.includes("fortune gems")) {
                      if (t.includes("3")) return 999; // We skip 3 if they only wanted 15
                      if (t.includes("2")) return 11;
                      return 7;
                  }
                  if (t.includes("super ace joker")) return 8;
                  if (t.includes("super dragon tiger")) return 9;
                  if (t.includes("dragon tiger fortune")) return 10;
                  if (t === "mines" || t.includes("mines")) return 12;
                  if (t === "blackjack" || t === "blackjack ") return 13;
                  if (t === "roulette" || t === "roulette ") return 14;
                  if (t === "ocean monster 3" || t.includes("ocean monster 3")) return 15;

                  return 999;
              };`;

content = content.replace(/if\(Array\.isArray\(data\)\) \{[\s\S]*?const getRank = \(game: any\) => \{[\s\S]*?return 999;\s*\};/m, replacement);

fs.writeFileSync("src/components/HomeScreen.tsx", content);
console.log("Updated HomeScreen with explicit 15 game sequence");
