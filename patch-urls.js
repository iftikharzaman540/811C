const fs = require("fs");
let content = fs.readFileSync("src/components/HomeScreen.tsx", "utf8");

content = content.replace(
  /fetch\(`https:\/\/8111c\.com\/api\/v1\/games\/launch\/\$\{gameId\}`/g,
  "fetch('https://8111c.com/api/v1/games/gregmorn/launch'"
);

content = content.replace(
  /fetch\(`\$\{API_URL\}\/games\/launch\/\$\{gameIdOrName\}`/g,
  "fetch(`${API_URL}/games/gregmorn/launch`"
);

fs.writeFileSync("src/components/HomeScreen.tsx", content);
console.log("Restored gregmorn launch URLs");
