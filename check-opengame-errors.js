const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
  conn.exec("grep -i 'openGame error' /root/.pm2/logs/gaming-backend-error-*.log", (err, stream) => {
    if (err) throw err;
    let data = '';
    stream.on('data', d => data += d);
    stream.on('close', () => {
      console.log('LOGS:', data);
      conn.end();
    });
  });
}).connect({
  host: '169.58.50.184',
  port: 22,
  username: 'root',
  password: 'Iftkharzaman'
});
