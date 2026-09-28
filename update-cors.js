const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
  const cmd = `
    cd /var/www/gaming-app/backend && 
    sed -i "s/origin: \\['https:\\/\\/8111c.com', 'https:\\/\\/www.8111c.com'\\]/origin: \\['https:\\/\\/8111c.com', 'https:\\/\\/www.8111c.com', 'https:\\/\\/office-dev.gamble-hub.net', 'https:\\/\\/office.gamble-hub.net'\\]/g" src/main.ts && 
    npm run build && 
    pm2 restart gaming-backend
  `;
  conn.exec(cmd, (err, stream) => {
    if (err) throw err;
    stream.on('close', () => {
      conn.end();
    }).on('data', (data) => {
      console.log(data.toString());
    }).stderr.on('data', (data) => {
      console.error(data.toString());
    });
  });
}).connect({
  host: '169.58.50.184',
  port: 22,
  username: 'root',
  password: 'Iftkharzaman'
});
