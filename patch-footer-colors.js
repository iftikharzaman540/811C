const fs = require("fs");
let content = fs.readFileSync("src/components/Footer.tsx", "utf8");

content = content.replace(/bg-green-500 text-black/g, "bg-[#1a1a1a] border border-neutral-800 text-[#ffdf00] hover:bg-[#ff0000] hover:text-white");
content = content.replace(/bg-\[\#1877f2\] text-white/g, "bg-[#1a1a1a] border border-neutral-800 text-[#ffdf00] hover:bg-[#ff0000] hover:text-white");
content = content.replace(/bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 text-white/g, "bg-[#1a1a1a] border border-neutral-800 text-[#ffdf00] hover:bg-[#ff0000] hover:text-white");
content = content.replace(/bg-black border border-neutral-700 text-white/g, "bg-[#1a1a1a] border border-neutral-800 text-[#ffdf00] hover:bg-[#ff0000] hover:text-white");
content = content.replace(/bg-\[\#0088cc\] text-white/g, "bg-[#1a1a1a] border border-neutral-800 text-[#ffdf00] hover:bg-[#ff0000] hover:text-white");

content = content.replace(/hover:bg-green-400/g, "");
content = content.replace(/hover:opacity-80/g, "");
content = content.replace(/hover:bg-neutral-800/g, "");

fs.writeFileSync("src/components/Footer.tsx", content);
console.log("Updated Footer colors to theme");
