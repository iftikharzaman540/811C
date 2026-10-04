const { Client } = require("ssh2");
const conn = new Client();
conn.on("ready", () => {
  conn.exec(`node -e "
    const token = 'MOCK_TOKEN'; 
    fetch('http://127.0.0.1:4000/api/v1/games/gregmorn/launch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gameId: 'nova:spribe:Aviator', demo: false })
    }).then(r => r.json()).then(console.log).catch(console.error);
  "`, (err, stream) => {
    stream.on("data", d => process.stdout.write(d.toString()));
    stream.stderr.on("data", d => process.stderr.write(d.toString()));
    stream.on("close", () => conn.end());
  });
}).connect({host:"169.58.50.184",port:22,username:"root",password:"Iftkharzaman"});
