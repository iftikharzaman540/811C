const { Client } = require('ssh2'); 
const conn = new Client(); 
conn.on('ready', () => { 
  conn.exec(`curl -s -X POST http://127.0.0.1:4000/api/v1/auth/login -H "Content-Type: application/json" -d '{"identifier":"test12345", "password":"Password123!"}'`, (err, stream) => { 
    let out = '';
    stream.on('data', d => out += d.toString()); 
    stream.on('close', () => {
      const data = JSON.parse(out);
      const token = data.access_token;
      
      const payload = {
          amount: 100,
          provider: "EASYPAISA",
          transaction_reference: "TEST-TRX-1234",
          currency: "PKR"
      };

      conn.exec(`curl -s -v -X POST http://127.0.0.1:4000/api/v1/payments/deposit -H "Authorization: Bearer ${token}" -H "Content-Type: application/json" -d '${JSON.stringify(payload)}'`, (e, s) => {
           let r = '';
           s.on('data', d => r += d.toString());
           s.stderr.on('data', d => process.stderr.write(d.toString()));
           s.on('close', () => {
              console.log('Result:', r);
              conn.end();
           });
        });
    }); 
  }); 
}).connect({host:'169.58.50.184',port:22,username:'root',password:'Iftkharzaman'});
