const fs = require("fs");
let content = fs.readFileSync("src/components/HomeScreen.tsx", "utf8");

content = content.replace(/\{\/\* Fixed Left Global Popups \*\/\}[\s\S]*?(?=\{\/\* Fixed Right Global Popups \*\/\}|<Footer \/>)/g, "");
content = content.replace(/\{\/\* Fixed Right Global Popups \*\/\}[\s\S]*?(?=<Footer \/>)/g, "");

fs.writeFileSync("src/components/HomeScreen.tsx", content);
console.log("Removed left and right global popups");
