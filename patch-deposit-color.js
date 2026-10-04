const fs = require("fs");
let content = fs.readFileSync("src/components/HomeScreen.tsx", "utf8");

content = content.replace(
  /bg-\[\#66df2f\] hover:bg-\[\#55cc25\] text-black rounded-lg shadow-\[0_2px_10px_rgba\(102,223,47,0\.3\)\]/g,
  "bg-[#ffdf00] hover:bg-[#e6c800] text-black rounded-lg shadow-[0_2px_10px_rgba(255,223,0,0.3)]"
);

fs.writeFileSync("src/components/HomeScreen.tsx", content);
console.log("Updated deposit button color in HomeScreen");
