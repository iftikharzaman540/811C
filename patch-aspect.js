const fs = require("fs");
let content = fs.readFileSync("src/components/HomeScreen.tsx", "utf8");

content = content.replace(/aspect-\[3\/4\]/g, "aspect-square");

fs.writeFileSync("src/components/HomeScreen.tsx", content);
console.log("Changed to aspect-square");
