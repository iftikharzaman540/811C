const { Client } = require('ssh2');
const conn = new Client();
const payload = `
const fs = require('fs');

let appModule = fs.readFileSync('/var/www/gaming-app/backend/src/app.module.ts', 'utf8');
appModule = appModule.replace('GregmornModule,', ''); 
appModule = appModule.replace('GameSessionsModule,', 'GregmornModule,\\n    GameSessionsModule,');

fs.writeFileSync('/var/www/gaming-app/backend/src/app.module.ts', appModule);
console.log("Patched app.module.ts order");
`;

conn.on('ready', () => {
  conn.exec(`node -e "${payload.replace(/"/g, '\\"').replace(/\n/g, '')}" && cd /var/www/gaming-app/backend && npm run build && pm2 restart gaming-backend`, (err, stream) => {
    stream.on('data', d => process.stdout.write(d.toString()));
    stream.stderr.on('data', d => process.stderr.write(d.toString()));
    stream.on('close', () => conn.end());
  });
}).connect({host:'169.58.50.184',port:22,username:'root',password:'Iftkharzaman'});
