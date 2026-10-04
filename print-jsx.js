const fs = require("fs");
const lines = fs.readFileSync("src/components/DepositScreen.tsx", "utf8").split("\n");
const start = lines.findIndex(l => l.includes("return ("));
console.log(lines.slice(start, start + 30).join("\n"));
