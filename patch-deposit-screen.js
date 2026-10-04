const fs = require("fs");
let content = fs.readFileSync("src/components/DepositScreen.tsx", "utf8");

content = content.replace(/#1fdf1f/g, "#ffdf00"); // Replace neon green with gold
content = content.replace(/rgba\(31,223,31/g, "rgba(255,223,0"); // Replace green shadow with gold
content = content.replace(/#0d4026/g, "#332a00"); // Replace dark green background with dark gold
content = content.replace(/#26a17b/g, "#ffdf00"); // Replace another green with gold
content = content.replace(/bg-\[\#1fdf1f\] text-black/g, "bg-[#ffdf00] text-black");

fs.writeFileSync("src/components/DepositScreen.tsx", content);
console.log("Updated deposit screen colors");
