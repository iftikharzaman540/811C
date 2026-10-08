const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  conn.exec("grep -q 'MEGANODES_API_TOKEN' /var/www/gaming-app/backend/.env && sed -i 's/^MEGANODES_API_TOKEN=.*/MEGANODES_API_TOKEN=294B4A89-A703-4020-A5C9-E7BE622E0C97/g' /var/www/gaming-app/backend/.env || echo 'MEGANODES_API_TOKEN=294B4A89-A703-4020-A5C9-E7BE622E0C97' >> /var/www/gaming-app/backend/.env && cd /var/www/gaming-app/backend && pm2 restart gaming-backend", (err, stream) => {
    stream.on('data', d => process.stdout.write(d.toString()));
    stream.stderr.on('data', d => process.stderr.write(d.toString()));
    stream.on('close', () => conn.end());
  });
}).connect({host:'169.58.50.184',port:22,username:'root',password:'Iftkharzaman'});
