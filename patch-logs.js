const { Client } = require('ssh2');
const conn = new Client();
const payload = `
const fs = require('fs');

let gregmorn = fs.readFileSync('/var/www/gaming-app/backend/src/gregmorn/gregmorn.controller.ts', 'utf8');
gregmorn = gregmorn.replace(
  /async launchGame\\([\\s\\S]*?\\{/,
  (match) => match + '\\n    console.log("HIT GregmornController.launchGame", { gameId, demo });'
);
fs.writeFileSync('/var/www/gaming-app/backend/src/gregmorn/gregmorn.controller.ts', gregmorn);

let games = fs.readFileSync('/var/www/gaming-app/backend/src/games/games.controller.ts', 'utf8');
games = games.replace(
  /async findOne\\(@Param\\('id'\\) id: string\\) \\{/,
  (match) => match + '\\n    console.log("HIT GamesController.findOne", { id });'
);
fs.writeFileSync('/var/www/gaming-app/backend/src/games/games.controller.ts', games);

console.log("Patched controllers");
`;

conn.on('ready', () => {
  conn.exec(`node -e "${payload.replace(/"/g, '\\"').replace(/\n/g, '')}" && cd /var/www/gaming-app/backend && npm run build && pm2 restart gaming-backend`, (err, stream) => {
    stream.on('data', d => process.stdout.write(d.toString()));
    stream.stderr.on('data', d => process.stderr.write(d.toString()));
    stream.on('close', () => conn.end());
  });
}).connect({host:'169.58.50.184',port:22,username:'root',password:'Iftkharzaman'});
