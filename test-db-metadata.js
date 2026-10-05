const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  conn.exec("cd /var/www/gaming-app/backend && node -e \"const { PrismaClient } = require('@prisma/client'); const prisma = new PrismaClient(); prisma.payment.findFirst({ where: { type: 'DEPOSIT', status: 'COMPLETED' }, orderBy: { created_at: 'desc' } }).then(p => { console.log(JSON.stringify(p?.metadata || {})); process.exit(0); });\"", (err, stream) => {
    stream.on('data', d => process.stdout.write(d.toString()));
    stream.stderr.on('data', d => process.stderr.write(d.toString()));
    stream.on('close', () => conn.end());
  });
}).connect({host:'169.58.50.184',port:22,username:'root',password:'Iftkharzaman'});
