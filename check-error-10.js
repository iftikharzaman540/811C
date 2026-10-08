const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  conn.exec("tail -n 100 /root/.pm2/logs/gaming-backend-error-10.log", (err, stream) => {
    stream.on('data', d => process.stdout.write(d.toString()));
    stream.stderr.on('data', d => process.stderr.write(d.toString()));
    stream.on('close', () => conn.end());
  });
}).connect({host:'169.58.50.184',port:22,username:'root',password:'Iftkharzaman'});
