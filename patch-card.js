const fs = require("fs");
let content = fs.readFileSync("src/components/HomeScreen.tsx", "utf8");

content = content.replace(
  /className=\{`aspect-square \$\{game\.img \|\| 'bg-neutral-900'\} rounded-xl relative overflow-hidden flex flex-col shadow-\[0_0_10px_rgba\(255,11,11,0\.4\)\] group cursor-pointer border border-\[\#ff0b0b\]`\}/g,
  "className={`aspect-square bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] rounded-xl relative overflow-hidden flex flex-col shadow-[0_4px_12px_rgba(0,0,0,0.5)] group cursor-pointer border border-neutral-800 hover:border-[#ffdf00] transition-colors`}"
);

fs.writeFileSync("src/components/HomeScreen.tsx", content);
console.log("Updated card styling");
