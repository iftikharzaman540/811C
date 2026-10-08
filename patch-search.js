const fs = require("fs");
let content = fs.readFileSync("src/components/HomeScreen.tsx", "utf8");

// We need to replace `realGames.filter` with `[...gamesList, ...miniGamesList, ...realGames].filter` inside the search dropdown logic.
// But we should only replace the ones that are related to `sidebarSearch`!

content = content.replace(
  /realGames\.filter\(\(g: any\) => \(\(g\.title \|\| g\.name\)/g,
  "[...gamesList, ...miniGamesList, ...realGames].filter((g: any) => ((g.title || g.name)"
);

fs.writeFileSync("src/components/HomeScreen.tsx", content, "utf8");
console.log("Updated HomeScreen.tsx");
