const fs = require("fs");
let content = fs.readFileSync("src/components/HomeScreen.tsx", "utf8");

content = content.replace(
  /\[\.\.\.gamesList, \.\.\.miniGamesList, \.\.\.realGames\]\.filter\(\(g: any\) => \(\(g\.title \|\| g\.name\) \|\| ""\)\.toLowerCase\(\)\.includes\(sidebarSearch\.toLowerCase\(\)\)\)/g,
  "[...gamesList, ...miniGamesList, ...realGames].filter((g: any) => { const s = sidebarSearch.toLowerCase(); return ((g.title || g.name) || '').toLowerCase().includes(s) || ((g.provider || g.logo) || '').toLowerCase().includes(s) || (g.hot && s === 'hot') || ((g.category) || '').toLowerCase().includes(s); })"
);

fs.writeFileSync("src/components/HomeScreen.tsx", content, "utf8");
console.log("Updated HomeScreen.tsx search filter");
