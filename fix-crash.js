const fs = require("fs");
let content = fs.readFileSync("src/components/HomeScreen.tsx", "utf8");

content = content.replace(
  /\[\.\.\.gamesList, \.\.\.miniGamesList, \.\.\.realGames\]\.filter\(\(g: any\) => \{ const s = sidebarSearch\.toLowerCase\(\); return \(\(g\.title \|\| g\.name\) \|\| ''\)\.toLowerCase\(\)\.includes\(s\) \|\| \(\(g\.provider \|\| g\.logo\) \|\| ''\)\.toLowerCase\(\)\.includes\(s\) \|\| \(g\.hot && s === 'hot'\) \|\| \(\(g\.category\) \|\| ''\)\.toLowerCase\(\)\.includes\(s\); \}\)/g,
  "[...gamesList, ...miniGamesList, ...realGames].filter((g: any) => { const s = sidebarSearch.toLowerCase(); const n = g.title || g.name; const p = g.provider || g.logo; const c = g.category; return (typeof n === 'string' && n.toLowerCase().includes(s)) || (typeof p === 'string' && p.toLowerCase().includes(s)) || (g.hot && s === 'hot') || (typeof c === 'string' && c.toLowerCase().includes(s)); })"
);

fs.writeFileSync("src/components/HomeScreen.tsx", content, "utf8");
console.log("Fixed JSX object crash in search");
