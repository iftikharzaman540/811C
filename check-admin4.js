const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  conn.exec("ls -l /var/www/gaming-app/backend/src/admin", (err, stream) => {
    stream.on('data', d => process.stdout.write(d.toString()));
    stream.stderr.on('data', d => process.stderr.write(d.toString()));
    stream.on('close', () => conn.end());
  });
}).connect({host:'169.58.50.184',port:22,username:'root',password:'Iftkharzaman'});
