const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  conn.exec('cd /var/www/gaming-app/backend && cat test-launch.js', (err, stream) => {
    stream.on('data', d => process.stdout.write(d.toString()));
    stream.stderr.on('data', d => process.stderr.write(d.toString()));
    stream.on('close', () => {
      conn.exec('cd /var/www/gaming-app/backend && node -e \"const crypto = require(\"crypto\"); require(\"dotenv\").config(); const fetch = require(\"node-fetch\"); const apiKey = process.env.GREGMORN_API_KEY; const apiUrl = process.env.GREGMORN_API_URL; const uid = process.env.GREGMORN_USER_ID; const bodyString = JSON.stringify({ currency: \"PKR\", demo: \"1\", exitUrl: \"https://8111c.com/\", callbackUrl: \"https://8111c.com/api/v1/webhooks/gregmorn\", gameId: \"nova:amusnet:5170\", language: \"en\", player_login: \"testuser\", user_id: uid }); const signature = crypto.createHmac(\"sha256\", apiKey).update(bodyString).digest(\"hex\"); fetch(apiUrl + \"/games/openGame\", { method: \"POST\", headers: { \"Content-Type\": \"application/json\", \"X-Signature\": signature }, body: bodyString }).then(r=>r.text()).then(console.log).catch(console.error);\"', (e,s) => {
        s.on('data', d => process.stdout.write(d.toString()));
        s.stderr.on('data', d => process.stderr.write(d.toString()));
        s.on('close', () => conn.end());
      });
    });
  });
}).connect({host:'169.58.50.184',port:22,username:'root',password:'Iftkharzaman'});
