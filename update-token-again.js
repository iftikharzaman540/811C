const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  conn.exec("sed -i 's/^MEGANODES_API_TOKEN=.*/MEGANODES_API_TOKEN=E8FC800F-9DC0-4B25-B1D6-E232974069F6/g' /var/www/gaming-app/backend/.env && cd /var/www/gaming-app/backend && pm2 restart gaming-backend", (err, stream) => {
    stream.on('data', d => process.stdout.write(d.toString()));
    stream.stderr.on('data', d => process.stderr.write(d.toString()));
    stream.on('close', () => conn.end());
  });
}).connect({host:'169.58.50.184',port:22,username:'root',password:'Iftkharzaman'});
