const { Client } = require('ssh2'); 
const conn = new Client(); 
conn.on('ready', () => { 
  conn.exec(`node -e "fetch('http://127.0.0.1:3000/api/v1/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ identifier: 'test', password: 'test' }) }).then(res => res.text()).then(console.log)"`, (err, stream) => { 
    stream.on('data', d => process.stdout.write(d.toString())); 
    stream.stderr.on('data', d => process.stderr.write(d.toString())); 
    stream.on('close', () => conn.end()); 
  }); 
}).connect({host:'169.58.50.184',port:22,username:'root',password:'Iftkharzaman'});
