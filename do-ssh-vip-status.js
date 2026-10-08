const { Client } = require('ssh2');
const fs = require('fs');
const conn = new Client();
conn.on('ready', () => {
  conn.sftp((err, sftp) => {
    if (err) throw err;
    const readStream = fs.createReadStream('patch-vip-status.js');
    const writeStream = sftp.createWriteStream('/tmp/patch-vip-status.js');
    writeStream.on('close', () => {
      conn.exec("node /tmp/patch-vip-status.js && cd /var/www/gaming-app/backend && npm run build && pm2 restart gaming-backend", (err, stream) => {
        stream.on('data', d => process.stdout.write(d.toString()));
        stream.stderr.on('data', d => process.stderr.write(d.toString()));
        stream.on('close', () => conn.end());
      });
    });
    readStream.pipe(writeStream);
  });
}).connect({host:'169.58.50.184',port:22,username:'root',password:'Iftkharzaman'});
