const fs = require("fs");
let content = fs.readFileSync("src/components/HomeScreen.tsx", "utf8");

content = content.replace(
  'const getRank = (game) => {',
  'const getRank = (game: any) => {'
);

fs.writeFileSync("src/components/HomeScreen.tsx", content);
console.log("Fixed TypeScript error");
