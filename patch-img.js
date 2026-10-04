const fs = require("fs");
let content = fs.readFileSync("src/components/HomeScreen.tsx", "utf8");

content = content.replace(/className="w-full h-full object-cover rounded-xl absolute inset-0 z-0"/g, 'className="w-full h-full object-fill rounded-xl absolute inset-0 z-0"');

fs.writeFileSync("src/components/HomeScreen.tsx", content);
console.log("Changed object-cover to object-fill");
