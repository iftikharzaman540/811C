const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  conn.exec("cd /var/www/gaming-app/backend && node -e \"const { PrismaClient } = require('@prisma/client'); const prisma = new PrismaClient(); prisma.ticket.findUnique({ where: { id: '4215d420-b9a9-4a64-864e-72cf71709d10' } }).then(t => { console.log(t); process.exit(0); }).catch(e=>console.log(e));\"", (err, stream) => {
    stream.on('data', d => process.stdout.write(d.toString()));
    stream.stderr.on('data', d => process.stderr.write(d.toString()));
    stream.on('close', () => conn.end());
  });
}).connect({host:'169.58.50.184',port:22,username:'root',password:'Iftkharzaman'});
