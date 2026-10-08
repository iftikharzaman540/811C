const { Client } = require('ssh2');
const fs = require('fs');
const conn = new Client();
conn.on('ready', () => {
  conn.sftp((err, sftp) => {
    if (err) throw err;
    sftp.fastGet('/var/www/gaming-app/backend/src/wallet/wallet.service.ts', 'wallet.service.ts', (err) => {
      if (err) throw err;
      console.log('Downloaded wallet.service.ts');
      conn.end();
    });
  });
}).connect({host:'169.58.50.184',port:22,username:'root',password:'Iftkharzaman'});
