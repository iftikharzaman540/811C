const fs = require("fs");
let content = fs.readFileSync("src/components/HomeScreen.tsx", "utf8");

// Change side menu buttons
content = content.replace(
  /bg-gradient-to-br from-pink-400 to-pink-600/g,
  "bg-gradient-to-br from-[#ffdf00] to-[#ccb300] text-black"
);
content = content.replace(
  /<span className="text-white font-bold text-\[13px\] z-10 relative">Fund<\/span>/g,
  '<span className="text-black font-bold text-[13px] z-10 relative">Fund</span>'
);

content = content.replace(
  /bg-gradient-to-br from-purple-400 to-purple-600/g,
  "bg-gradient-to-br from-[#2a2a2a] to-[#111111] border border-[#ffdf00]/30"
);

content = content.replace(
  /bg-gradient-to-br from-green-400 to-green-600/g,
  "bg-gradient-to-br from-[#cc0000] to-[#800000]"
);

fs.writeFileSync("src/components/HomeScreen.tsx", content);
console.log("Updated side menu button colors");
