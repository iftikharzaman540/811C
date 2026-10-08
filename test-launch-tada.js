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
    gameId: "ag:tada:AG_TADA_FortuneGems_109",
    language: "en",
    player_login: "testuser123",
    user_id: "cd32db12-418a-4ea7-b957-b772ed503f47"
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
  conn.exec(`cat << 'EOF' > /tmp/test-launch-tada.js\n${nodeScript}\nEOF\nnode /tmp/test-launch-tada.js`, (err, stream) => {
    stream.on('data', d => process.stdout.write(d.toString()));
    stream.stderr.on('data', d => process.stderr.write(d.toString()));
    stream.on('close', () => conn.end());
  });
}).connect({host:'169.58.50.184',port:22,username:'root',password:'Iftkharzaman'});
