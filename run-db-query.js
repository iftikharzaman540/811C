const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  conn.exec('cd /var/www/gaming-app/backend && node -e "const { PrismaClient } = require(\\"@prisma/client\\"); const prisma = new PrismaClient(); prisma.payment.findMany({orderBy: {created_at: \\"desc\\"}, take: 10, select: {transaction_reference: true, amount: true}}).then(console.log).finally(()=>prisma.\\());"', (err, stream) => {
    stream.on('data', d => process.stdout.write(d.toString()));
    stream.stderr.on('data', d => process.stderr.write(d.toString()));
    stream.on('close', () => conn.end());
  });
}).connect({host:'169.58.50.184',port:22,username:'root',password:'Iftkharzaman'});
