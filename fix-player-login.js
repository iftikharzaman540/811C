const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
  conn.exec("sed -i 's/const playerLogin = user.userId;/const playerLogin = `Player_${user.userId.substring(0,8)}`;/' /var/www/gaming-app/backend/src/gregmorn/gregmorn.controller.ts && cd /var/www/gaming-app/backend && npm run build && pm2 restart gaming-backend", (err, stream) => {
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
