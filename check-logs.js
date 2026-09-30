const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
  conn.exec("grep -rn 'launch' /root/.pm2/logs/gaming-backend-out-9.log /root/.pm2/logs/gaming-backend-error-9.log /root/.pm2/logs/gaming-backend-out-10.log /root/.pm2/logs/gaming-backend-error-10.log", (err, stream) => {
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
