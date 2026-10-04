const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  conn.exec(`curl -X GET "https://office-api.helcenac.com/users/dd684b6f-2c8e-41b0-a6dd-742bd956920a/getUserGames/PKR" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3OTEwNTE5NjEsInR2Ijo4MDQsInR5cGUiOiJhY2Nlc3MiLCJ1c2VyX2lkIjoiY2QzMmRiMTItNDE4YS00ZWE3LWI5NTctYjc3MmVkNTAzZjQ3In0.SMUYNYy5CSRpFr8zKjmNTU9FCMQoAGcgABp4WVwTaqA"`, (err, stream) => {
    stream.on('data', d => process.stdout.write(d.toString()));
    stream.stderr.on('data', d => process.stderr.write(d.toString()));
    stream.on('close', () => conn.end());
  });
}).connect({host:'169.58.50.184',port:22,username:'root',password:'Iftkharzaman'});
