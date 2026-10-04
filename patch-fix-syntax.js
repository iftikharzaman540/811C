const fs = require("fs");
let content = fs.readFileSync("src/components/DepositScreen.tsx", "utf8");

content = content.replace(
  /\{\s*tab === "online" && \(\s*<div className="mb-6">\s*<\/div>/g,
  ""
);

fs.writeFileSync("src/components/DepositScreen.tsx", content);
console.log("Fixed DepositScreen syntax error");
