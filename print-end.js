const fs = require("fs");
const lines = fs.readFileSync("src/components/DepositScreen.tsx", "utf8").split("\n");
console.log(lines.slice(-30).join("\n"));
