const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  console.log('Connected');
  conn.exec('curl -s -H "Authorization: Bearer <TOKEN>" http://localhost:8111/api/v1/admin/users/8067fc6d-790b-4127-ae2a-bf444042cb40', (err, stream) => {
    stream.on('data', d => console.log(d.toString()));
    stream.stderr.on('data', d => console.error(d.toString()));
    stream.on('close', () => conn.end());
  });
}).connect({host:'169.58.50.184',port:22,username:'root',password:'Iftkharzaman'});
