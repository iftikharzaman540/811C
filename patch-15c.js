const fs = require("fs");
let content = fs.readFileSync("src/components/HomeScreen.tsx", "utf8");

content = content.replace(
  /if \(t === "blackjack" \|\| t === "blackjack "\) return 13;/g,
  `if (t.replace(/\\s/g, "") === "blackjack") return 13;`
);

content = content.replace(
  /if \(t === "roulette" \|\| t === "roulette "\) return 14;/g,
  `if (t.replace(/\\s/g, "") === "roulette") return 14;`
);

fs.writeFileSync("src/components/HomeScreen.tsx", content);
console.log("Updated HomeScreen with robust Blackjack/Roulette matching");
