const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  const nodeScript = `
async function test() {
  const tokenRes = await fetch("https://8111c.com/api/v1/auth/login", {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone: "03001234567", password: "password123" })
  });
  const tokenData = await tokenRes.json();
  const token = tokenData.access_token;
  
  if (!token) { console.log("Login failed", tokenData); return; }

  const res = await fetch("https://8111c.com/api/v1/games/gregmorn/launch", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': \`Bearer \${token}\`
    },
    body: JSON.stringify({ gameId: "greece:40020:52000259", demo: false })
  });
  console.log(await res.json());
}
test();
`;
  conn.exec(`cat << 'EOF' > /tmp/test-full-launch.js\n${nodeScript}\nEOF\nnode /tmp/test-full-launch.js`, (err, stream) => {
    stream.on('data', d => process.stdout.write(d.toString()));
    stream.stderr.on('data', d => process.stderr.write(d.toString()));
    stream.on('close', () => conn.end());
  });
}).connect({host:'169.58.50.184',port:22,username:'root',password:'Iftkharzaman'});
