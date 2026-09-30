const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
  conn.exec("curl -s -X POST http://localhost:4000/api/v1/auth/login -H 'Content-Type: application/json' -d '{\"identifier\":\"admin@8111c.com\",\"password\":\"Iftkharzaman\"}'", (err, stream) => {
    if (err) throw err;
    let data = '';
    stream.on('data', d => data += d);
    stream.on('close', () => {
      console.log(data);
      const res = JSON.parse(data);
      if (res.access_token) {
        conn.exec(`curl -s -v -X POST http://localhost:4000/api/v1/games/gregmorn/launch -H 'Content-Type: application/json' -H 'Authorization: Bearer ${res.access_token}' -d '{"gameId":"Crash","demo":false}'`, (err, stream2) => {
          stream2.on('data', d => console.log('LAUNCH:', d.toString()));
          stream2.stderr.on('data', d => console.log('LAUNCH_ERR:', d.toString()));
          stream2.on('close', () => conn.end());
        });
      } else {
        conn.end();
      }
    });
  });
}).connect({
  host: '169.58.50.184',
  port: 22,
  username: 'root',
  password: 'Iftkharzaman'
});
