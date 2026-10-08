const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  conn.exec("sed -i 's/reference:/referenceId:/g' /var/www/gaming-app/backend/src/slotegrator/slotegrator-webhook.controller.ts && sed -i 's/newWallet.balance/newWallet.balance_after/g' /var/www/gaming-app/backend/src/slotegrator/slotegrator-webhook.controller.ts && cd /var/www/gaming-app/backend && npm run build && pm2 restart gaming-backend", (err, stream) => {
    stream.on('data', d => process.stdout.write(d.toString()));
    stream.stderr.on('data', d => process.stderr.write(d.toString()));
    stream.on('close', () => conn.end());
  });
}).connect({host:'169.58.50.184',port:22,username:'root',password:'Iftkharzaman'});
