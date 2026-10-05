const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  conn.exec('cd /var/www/gaming-app/backend && npx prisma studio', (err, stream) => {
    // Actually no, just run a node script
    conn.exec('cd /var/www/gaming-app/backend && node -e "const { PrismaClient } = require(\\"@prisma/client\\"); const prisma = new PrismaClient(); prisma.payment.findMany({orderBy: {created_at: \\"desc\\"}, take: 5}).then(console.log).catch(console.error).finally(()=>prisma.());"', (e,s) => {
        s.on('data', d => process.stdout.write(d.toString()));
        s.stderr.on('data', d => process.stderr.write(d.toString()));
        s.on('close', () => conn.end());
    });
  });
}).connect({host:'169.58.50.184',port:22,username:'root',password:'Iftkharzaman'});
