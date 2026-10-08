const { Client } = require('ssh2');
const fs = require('fs');
const conn = new Client();
conn.on('ready', () => {
  conn.sftp((err, sftp) => {
    if (err) throw err;
    const files = [
      'meganodes.service.ts',
      'meganodes-webhook.controller.ts',
      'meganodes.controller.ts',
      'meganodes.module.ts'
    ];
    let uploaded = 0;
    files.forEach(file => {
      sftp.fastPut(file, `/var/www/gaming-app/backend/src/meganodes/${file}`, (err) => {
        if (err) console.error("Error uploading", file, err);
        uploaded++;
        if (uploaded === files.length) {
          console.log("All files uploaded");
          conn.end();
        }
      });
    });
  });
}).connect({host:'169.58.50.184',port:22,username:'root',password:'Iftkharzaman'});
