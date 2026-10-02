const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  console.log('Connected');
  conn.exec('cd /var/www/gaming-app/backend && node -e \"const { PrismaClient } = require(\'' + './node_modules/@prisma/client' + '\'); const prisma = new PrismaClient(); prisma.user.findFirst({ select: { username: true, casino_enabled: true, deposits_enabled: true } }).then(x => console.log(JSON.stringify(x))).finally(() => process.exit(0));\"', (err, stream) => {
    stream.on('data', d => console.log(d.toString()));
    stream.stderr.on('data', d => console.error(d.toString()));
    stream.on('close', () => conn.end());
  });
}).connect({host:'169.58.50.184',port:22,username:'root',password:'Iftkharzaman'});
