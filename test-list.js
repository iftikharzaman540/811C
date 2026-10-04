const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  conn.exec(`curl -s "https://8111c.com/api/v1/games/gregmorn/list"`, (err, stream) => {
    let body = '';
    stream.on('data', d => body += d.toString());
    stream.on('close', () => {
       try {
         const data = JSON.parse(body);
         console.log(JSON.stringify(data.slice(0, 2), null, 2));
       } catch(e) {
         console.log(body);
       }
       conn.end();
    });
  });
}).connect({host:'169.58.50.184',port:22,username:'root',password:'Iftkharzaman'});
