const fs = require("fs");
let content = fs.readFileSync("/var/www/gaming-app/backend/src/games/games.controller.ts", "utf8");

content = content.replace(
  'return { success: true, url: "https://dummyslot.com/play", message: "Game launched in DEMO mode (Slotegrator RBAC Denied)" };',
  'return { success: false, message: "Failed to launch game: API Error" };'
);

fs.writeFileSync("/var/www/gaming-app/backend/src/games/games.controller.ts", content);
console.log("Removed dummyslot fallback");
