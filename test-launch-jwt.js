const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
  conn.exec(`cat << 'EOF' > /root/test-jwt.js
const jwt = require('/var/www/gaming-app/backend/node_modules/jsonwebtoken');
const token = jwt.sign(
  { sub: 'cd32db12-418a-4ea7-b957-b772ed503f47', email: 'admin@8111c.com', role: 'User' },
  'super-secret-production-key',
  { expiresIn: '1h' }
);
console.log('TOKEN:', token);
fetch('http://localhost:4000/api/v1/games/gregmorn/launch', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token
  },
  body: JSON.stringify({ gameId: 'Crash', demo: false })
}).then(async r => {
  console.log('STATUS:', r.status);
  console.log('HEADERS:', Object.fromEntries(r.headers.entries()));
  console.log('BODY:', await r.text());
}).catch(console.error);
EOF
node /root/test-jwt.js
`, (err, stream) => {
    if (err) throw err;
    let data = '';
    stream.on('data', d => data += d);
    stream.stderr.on('data', d => data += 'ERR: ' + d);
    stream.on('close', () => {
      console.log('OUTPUT:', data);
      conn.end();
    });
  });
}).connect({
  host: '169.58.50.184',
  port: 22,
  username: 'root',
  password: 'Iftkharzaman'
});
