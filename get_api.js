const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  conn.exec('cd /var/www/gaming-app/backend && node -e \"const { PrismaClient } = require(\'' + './node_modules/@prisma/client' + '\'); const jwt = require(\'' + 'jsonwebtoken' + '\'); const prisma = new PrismaClient(); prisma.user.findFirst({ where: { role: \'SUPER_ADMIN\' } }).then(admin => { const token = jwt.sign({ userId: admin.id, role: admin.role }, \'secret\', { expiresIn: \'1h\' }); console.log(token); }).finally(() => process.exit(0));\"', (err, stream) => {
    let output = '';
    stream.on('data', d => output += d.toString());
    stream.on('close', () => {
      const token = output.trim();
      conn.exec(curl -s -H "Authorization: Bearer " http://localhost:8111/api/v1/admin/users/8067fc6d-790b-4127-ae2a-bf444042cb40, (err2, stream2) => {
        stream2.on('data', d => console.log(d.toString()));
        stream2.on('close', () => conn.end());
      });
    });
  });
}).connect({host:'169.58.50.184',port:22,username:'root',password:'Iftkharzaman'});
