const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  conn.exec("sed -i '1s/^/import { MeganodesModule } from \"\\.\\/meganodes\\/meganodes\\.module\";\\n/' /var/www/gaming-app/backend/src/app.module.ts && sed -i 's/SlotegratorModule,/SlotegratorModule,\\n    MeganodesModule,/g' /var/www/gaming-app/backend/src/app.module.ts && cd /var/www/gaming-app/backend && npm run build && pm2 restart gaming-backend", (err, stream) => {
    stream.on('data', d => process.stdout.write(d.toString()));
    stream.stderr.on('data', d => process.stderr.write(d.toString()));
    stream.on('close', () => conn.end());
  });
}).connect({host:'169.58.50.184',port:22,username:'root',password:'Iftkharzaman'});
