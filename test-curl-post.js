const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
  conn.exec("curl -s -D - -X POST https://8111c.com/api/v1/games/gregmorn/launch -H 'Content-Type: application/json' -d '{\"gameId\":\"Crash\",\"demo\":false}'", (err, stream) => {
    if (err) throw err;
    let data = '';
    stream.on('data', d => data += d);
    stream.on('close', () => {
      console.log(data);
      conn.end();
    });
  });
}).connect({
  host: '169.58.50.184',
  port: 22,
  username: 'root',
  password: 'Iftkharzaman'
});
