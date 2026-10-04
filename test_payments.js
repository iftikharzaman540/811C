const { Client } = require('ssh2'); 
const conn = new Client(); 
conn.on('ready', () => { 
  conn.exec(`curl -s -X POST http://127.0.0.1:4000/api/v1/auth/login -H "Content-Type: application/json" -d '{"identifier":"test12345", "password":"Password123!"}'`, (err, stream) => { 
    let out = '';
    stream.on('data', d => out += d.toString()); 
    stream.on('close', () => {
      const data = JSON.parse(out);
      const token = data.access_token;
      
      const tests = [
        '/api/v1/payments/records',
        '/api/v1/payments/deposit-history?range=7d',
        '/api/v1/payments/withdrawal-history?range=7d'
      ];
      
      let completed = 0;
      for (const t of tests) {
        conn.exec(`curl -s -X GET http://127.0.0.1:4000${t} -H "Authorization: Bearer ${token}"`, (e, s) => {
           let r = '';
           s.on('data', d => r += d.toString());
           s.on('close', () => {
              console.log(t, ':', r.substring(0, 100));
              completed++;
              if (completed === tests.length) conn.end();
           });
        });
      }
    }); 
  }); 
}).connect({host:'169.58.50.184',port:22,username:'root',password:'Iftkharzaman'});
