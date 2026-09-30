const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
  conn.exec("tail -n 5000 /var/log/nginx/access.log | grep '/api/v1/games/gregmorn/launch' | grep ' 500 '", (err, stream) => {
    if (err) throw err;
    let data = '';
    stream.on('data', d => data += d);
    stream.on('close', () => {
      console.log('500 LOGS:', data);
      conn.end();
    });
  });
}).connect({
  host: '169.58.50.184',
  port: 22,
  username: 'root',
  password: 'Iftkharzaman'
});
