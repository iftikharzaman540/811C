const { Client } = require('ssh2'); 
const conn = new Client(); 
conn.on('ready', () => { 
  conn.exec('curl -s https://127.0.0.1:3000/profile', (err, stream) => { 
    let res = "";
    stream.on('data', d => res += d.toString()); 
    stream.stderr.on('data', d => process.stderr.write(d.toString())); 
    stream.on('close', () => {
      console.log(res.includes("JJWin") ? "YES" : "NO");
      conn.end();
    }); 
  }); 
}).connect({host:'169.58.50.184',port:22,username:'root',password:'Iftkharzaman'});
