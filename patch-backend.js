const { Client } = require("ssh2");
const conn = new Client();
conn.on("ready", () => {
  const fs = require("fs");
  conn.exec(`sed -i 's/return { success: true, message: "Game launched in DEMO mode (Slotegrator RBAC Denied)" };/return { success: true, url: "https:\\/\\/dummyslot.com\\/play", message: "Game launched in DEMO mode (Slotegrator RBAC Denied)" };/g' /var/www/gaming-app/backend/src/games/games.controller.ts && cd /var/www/gaming-app/backend && npm run build && pm2 restart gaming-backend`, (err, stream) => {
    stream.on("data", d => process.stdout.write(d.toString()));
    stream.stderr.on("data", d => process.stderr.write(d.toString()));
    stream.on("close", () => conn.end());
  });
}).connect({host:"169.58.50.184",port:22,username:"root",password:"Iftkharzaman"});
