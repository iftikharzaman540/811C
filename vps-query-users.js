const { Client } = require('ssh2'); 
const conn = new Client(); 
conn.on('ready', () => { 
  conn.exec(`sudo -u postgres psql -d gaming_db -c 'SELECT id, username FROM "User" LIMIT 5;'`, (err, stream) => { 
    stream.on('data', d => process.stdout.write(d)); 
    stream.stderr.on('data', d => process.stderr.write(d)); 
    stream.on('close', () => conn.end()); 
  }); 
}).connect({host:'169.58.50.184',port:22,username:'root',password:'Iftkharzaman'});
