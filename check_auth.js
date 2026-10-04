const { Client } = require('ssh2'); 
const conn = new Client(); 
conn.on('ready', () => { 
  conn.exec('cat /var/www/gaming-app/backend/src/auth/auth.service.ts', (err, stream) => { 
    let res = "";
    stream.on('data', d => res += d.toString());
    stream.on('close', () => {
      console.log(res);
      conn.end();
    });
  }); 
}).connect({host:'169.58.50.184',port:22,username:'root',password:'Iftkharzaman'});
