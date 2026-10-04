const fs = require("fs");
let content = fs.readFileSync("src/components/DepositScreen.tsx", "utf8");

content = content.replace(
  /\{\/\* Bottom Button \*\/\}/g,
  `</div>\n      {/* Bottom Button */}`
);

fs.writeFileSync("src/components/DepositScreen.tsx", content);
console.log("Fixed DepositScreen missing closing div");
