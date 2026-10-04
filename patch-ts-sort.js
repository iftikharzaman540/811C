const fs = require("fs");
let content = fs.readFileSync("src/components/HomeScreen.tsx", "utf8");

content = content.replace(
  /data\.sort\(\(a, b\) => getRank\(a\) - getRank\(b\)\);/g,
  "data.sort((a: any, b: any) => getRank(a) - getRank(b));"
);

fs.writeFileSync("src/components/HomeScreen.tsx", content);
console.log("Fixed typescript error in data.sort");
