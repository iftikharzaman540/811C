const { Client } = require('ssh2'); 
const fs = require('fs');
const conn = new Client(); 
conn.on('ready', () => { 
  conn.sftp((err, sftp) => {
    sftp.fastPut('repair_auth_ctrl.js', '/root/repair_auth_ctrl.js', {}, (err) => {
       conn.exec('node /root/repair_auth_ctrl.js && cd /var/www/gaming-app/backend && npm run build && pm2 restart gaming-backend', (err, stream) => { 
         stream.on('data', d => process.stdout.write(d.toString())); 
         stream.stderr.on('data', d => process.stderr.write(d.toString())); 
         stream.on('close', () => conn.end()); 
       });
    });
  });
}).connect({host:'169.58.50.184',port:22,username:'root',password:'Iftkharzaman'});
