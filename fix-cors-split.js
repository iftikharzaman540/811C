const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
  conn.exec("sed -i \"s/origin: process.env.CORS_ORIGIN || 'http:\\/\\/localhost:3000',/origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : 'http:\\/\\/localhost:3000',/\" /var/www/gaming-app/backend/src/main.ts && cd /var/www/gaming-app/backend && npm run build && pm2 restart gaming-backend", (err, stream) => {
    if (err) throw err;
    let data = '';
    stream.on('data', d => data += d);
    stream.on('close', () => {
      console.log('DONE:', data);
      conn.end();
    });
  });
}).connect({
  host: '169.58.50.184',
  port: 22,
  username: 'root',
  password: 'Iftkharzaman'
});
