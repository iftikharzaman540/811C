const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  const nodeScript = `
const crypto = require('crypto');
async function test() {
  const payload = {
    currency: "PKR",
    demo: "0",
    exitUrl: "https://8111c.com/",
    callbackUrl: "https://8111c.com/api/v1/webhooks/gregmorn",
    gameId: "ag:pg:PG_PinataWins",
    language: "en",
    player_login: "testuser123",
    user_id: "dd684b6f-2c8e-41b0-a6dd-742bd956920a"
  };
  const bodyString = JSON.stringify(payload);
  const secretKey = '!@{R>{bed{(6+XO';
  const signature = crypto.createHmac('sha256', secretKey).update(bodyString, 'utf8').digest('hex');
  
  const res = await fetch("https://client-api.helcenac.com/games/openGame", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Signature': signature
    },
    body: bodyString
  });
  console.log(await res.json());
}
test();
`;
  conn.exec(`cat << 'EOF' > /tmp/test-launch-pg.js\n${nodeScript}\nEOF\nnode /tmp/test-launch-pg.js`, (err, stream) => {
    stream.on('data', d => process.stdout.write(d.toString()));
    stream.stderr.on('data', d => process.stderr.write(d.toString()));
    stream.on('close', () => conn.end());
  });
}).connect({host:'169.58.50.184',port:22,username:'root',password:'Iftkharzaman'});
