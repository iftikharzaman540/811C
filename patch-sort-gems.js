const fs = require("fs");
let content = fs.readFileSync("src/components/HomeScreen.tsx", "utf8");

content = content.replace(
  /if \(t\.includes\("chicken road"\)\) return 3;\s*return 999;/g,
  `if (t.includes("chicken road")) return 3;
                if (t.includes("fortune gems 3")) return 7;
                if (t.includes("fortune gems 2")) return 6;
                if (t.includes("fortune gems")) return 5;
                return 999;`
);

fs.writeFileSync("src/components/HomeScreen.tsx", content);
console.log("Updated sorting logic");
