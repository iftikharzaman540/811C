const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
  conn.sftp((err, sftp) => {
    if (err) throw err;
    const localFile = 'patch-backend-logger.js';
    const remoteFile = '/root/patch-backend-logger.js';
    sftp.fastPut(localFile, remoteFile, (err) => {
      if (err) throw err;
      conn.exec("node /root/patch-backend-logger.js && cd /var/www/gaming-app/backend && npm run build && pm2 restart gaming-backend", (err, stream) => {
        if (err) throw err;
        stream.on('close', () => {
          conn.end();
        }).on('data', (data) => {
          console.log(data.toString());
        }).stderr.on('data', (data) => {
          console.error(data.toString());
        });
      });
    });
  });
}).connect({
  host: '169.58.50.184',
  port: 22,
  username: 'root',
  password: 'Iftkharzaman'
});
