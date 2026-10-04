const { Client } = require('ssh2'); 
const fs = require('fs');
const conn = new Client(); 
conn.on('ready', () => { 
  conn.exec('cat /var/www/gaming-app/backend/prisma/schema.prisma', (err, stream) => { 
    let schema = '';
    stream.on('data', d => schema += d.toString()); 
    stream.on('close', () => {
      if (!schema.includes('nickname')) {
        schema = schema.replace('avatar        String?', 'avatar        String?\n  nickname      String?\n  whatsapp      String?\n  facebook      String?\n  telegram      String?\n  twitter       String?\n  date_of_birth DateTime?');
        conn.sftp((err, sftp) => {
          sftp.writeFile('/var/www/gaming-app/backend/prisma/schema.prisma', schema, () => {
            conn.exec('cd /var/www/gaming-app/backend && npx prisma db push && npx prisma generate && npm run build && pm2 restart gaming-backend', (err, stream2) => {
              stream2.on('data', d => process.stdout.write(d.toString()));
              stream2.stderr.on('data', d => process.stderr.write(d.toString()));
              stream2.on('close', () => conn.end());
            });
          });
        });
      } else {
        console.log("Already updated");
        conn.end();
      }
    }); 
  }); 
}).connect({host:'169.58.50.184',port:22,username:'root',password:'Iftkharzaman'});
