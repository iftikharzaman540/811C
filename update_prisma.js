const { Client } = require('ssh2'); 
const conn = new Client(); 
conn.on('ready', () => { 
  conn.exec(`cat /var/www/gaming-app/backend/prisma/schema.prisma`, (err, stream) => { 
    let content = '';
    stream.on('data', d => content += d.toString()); 
    stream.on('close', () => {
       if (!content.includes('session_token String?')) {
           content = content.replace(/date_of_birth\s+DateTime\?/, "date_of_birth DateTime?\n  session_token String?");
           conn.exec(`cat > /var/www/gaming-app/backend/prisma/schema.prisma`, (err2, stream2) => {
             stream2.write(content);
             stream2.end();
             
             // Run prisma commands
             conn.exec('cd /var/www/gaming-app/backend && npx prisma db push && npx prisma generate', (e, s) => {
                s.on('data', d => process.stdout.write(d.toString()));
                s.stderr.on('data', d => process.stderr.write(d.toString()));
                s.on('close', () => {
                   console.log("Schema updated and generated");
                   conn.end();
                });
             });
           });
       } else {
           console.log("Already has session_token");
           conn.end();
       }
    }); 
  }); 
}).connect({host:'169.58.50.184',port:22,username:'root',password:'Iftkharzaman'});
