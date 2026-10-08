const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  conn.exec(`node -e "
async function run() {
  const res = await fetch('https://8111c.com/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier: 'testadmin', password: 'password123' })
  });
  const data = await res.json();
  if (!data.accessToken) return console.log('Login failed', data);

  const launchRes = await fetch('https://8111c.com/api/v1/games/gregmorn/launch', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + data.accessToken },
    body: JSON.stringify({ gameId: 'magic-firekirin:fishing:510001', isDemo: false })
  });
  console.log(await launchRes.json());
}
run();
"`, (err, stream) => {
    stream.on('data', d => process.stdout.write(d.toString()));
    stream.stderr.on('data', d => process.stderr.write(d.toString()));
    stream.on('close', () => conn.end());
  });
}).connect({host:'169.58.50.184',port:22,username:'root',password:'Iftkharzaman'});
