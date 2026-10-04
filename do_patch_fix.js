const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  conn.sftp((err, sftp) => {
    if (err) throw err;
    const writeStream = sftp.createWriteStream('/var/www/gaming-app/backend/patch_admin_users_fix.js');
    writeStream.write(`
const fs = require('fs');
let code = fs.readFileSync('/var/www/gaming-app/backend/src/admin-users/admin-users.service.ts', 'utf8');

// Fix duplicate player_id
code = code.replace(/player_id: true,\\s*player_id: true,/g, 'player_id: true,');

fs.writeFileSync('/var/www/gaming-app/backend/src/admin-users/admin-users.service.ts', code);
console.log("Patched admin-users.service.ts to fix duplicates");
`);
    writeStream.end();
    writeStream.on('close', () => {
      conn.exec('cd /var/www/gaming-app/backend && node patch_admin_users_fix.js && npm run build && pm2 restart gaming-backend', (err, stream) => {
        stream.on('data', d => process.stdout.write(d.toString()));
        stream.stderr.on('data', d => process.stderr.write(d.toString()));
        stream.on('close', () => conn.end());
      });
    });
  });
}).connect({host:'169.58.50.184',port:22,username:'root',password:'Iftkharzaman'});
