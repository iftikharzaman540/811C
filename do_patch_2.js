const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  conn.sftp((err, sftp) => {
    if (err) throw err;
    const writeStream = sftp.createWriteStream('/var/www/gaming-app/backend/patch_admin_users2.js');
    writeStream.write(`
const fs = require('fs');
let code = fs.readFileSync('/var/www/gaming-app/backend/src/admin-users/admin-users.service.ts', 'utf8');

code = code.replace(
  "id: true, username: true, email: true, phone: true,",
  "id: true, player_id: true, username: true, email: true, phone: true,"
);

fs.writeFileSync('/var/www/gaming-app/backend/src/admin-users/admin-users.service.ts', code);
console.log("Patched admin-users.service.ts to add player_id to getUserDetails");
`);
    writeStream.end();
    writeStream.on('close', () => {
      conn.exec('cd /var/www/gaming-app/backend && node patch_admin_users2.js && npm run build && pm2 restart gaming-backend', (err, stream) => {
        stream.on('data', d => process.stdout.write(d.toString()));
        stream.stderr.on('data', d => process.stderr.write(d.toString()));
        stream.on('close', () => conn.end());
      });
    });
  });
}).connect({host:'169.58.50.184',port:22,username:'root',password:'Iftkharzaman'});
