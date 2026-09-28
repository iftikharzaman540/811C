const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
  conn.exec("sed -i \"s/origin: \\['https:\\/\\/8111c.com', 'https:\\/\\/www.8111c.com'\\]/origin: '*'/g\" /root/gaming-backend/src/main.ts && cd /root/gaming-backend && npm run build && pm2 restart gaming-backend", (err, stream) => {
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
