const { Client } = require('ssh2');
const fs = require('fs');
const conn = new Client();
conn.on('ready', () => {
  conn.sftp((err, sftp) => {
    if (err) throw err;
    const readStream = fs.createReadStream('schema-vps-updated2.prisma');
    const writeStream = sftp.createWriteStream('/var/www/gaming-app/backend/prisma/schema.prisma');
    writeStream.on('close', () => {
      console.log('Uploaded updated schema.');
      conn.exec("cd /var/www/gaming-app/backend && npx prisma generate && npx prisma db push", (err, stream) => {
        stream.on('data', d => process.stdout.write(d.toString()));
        stream.stderr.on('data', d => process.stderr.write(d.toString()));
        stream.on('close', () => conn.end());
      });
    });
    readStream.pipe(writeStream);
  });
}).connect({host:'169.58.50.184',port:22,username:'root',password:'Iftkharzaman'});
