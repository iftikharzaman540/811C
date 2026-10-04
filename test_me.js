const { Client } = require('ssh2'); 
const conn = new Client(); 
conn.on('ready', () => { 
  conn.exec(`curl -s -X POST http://127.0.0.1:4000/api/v1/auth/register -H "Content-Type: application/json" -d '{"username":"test12345", "password":"Password123!"}'`, (err, stream) => { 
    let out = '';
    stream.on('data', d => out += d.toString()); 
    stream.stderr.on('data', d => process.stderr.write(d.toString())); 
    stream.on('close', () => {
      console.log(out);
      const data = JSON.parse(out);
      if (data.access_token) {
        conn.exec(`curl -s -X GET http://127.0.0.1:4000/api/v1/auth/me -H "Authorization: Bearer ${data.access_token}"`, (err, s2) => {
          s2.on('data', d => process.stdout.write(d.toString()));
          s2.on('close', () => conn.end());
        });
      } else {
        conn.end();
      }
    }); 
  }); 
}).connect({host:'169.58.50.184',port:22,username:'root',password:'Iftkharzaman'});
