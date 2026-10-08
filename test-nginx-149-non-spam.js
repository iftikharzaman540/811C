const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  conn.exec("grep '149.40.167.205' /var/log/nginx/access.log | grep -v 'banners' | grep -v 'notifications' | tail -n 20", (err, stream) => {
    stream.on('data', d => process.stdout.write(d.toString()));
    stream.stderr.on('data', d => process.stderr.write(d.toString()));
    stream.on('close', () => conn.end());
  });
}).connect({host:'169.58.50.184',port:22,username:'root',password:'Iftkharzaman'});
