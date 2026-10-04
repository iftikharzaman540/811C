const fs = require("fs");
let content = fs.readFileSync("src/components/HomeScreen.tsx", "utf8");

content = content.replace(/bg-green-500/g, "bg-[#cc0000]");

fs.writeFileSync("src/components/HomeScreen.tsx", content);
console.log("Updated HomeScreen green colors to theme");
