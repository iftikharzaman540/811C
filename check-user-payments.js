const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  const nodeScript = `
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkUser() {
  const payments = await prisma.payment.findMany({
    where: { user_id: '3741c49b-9f47-40a9-ab6d-db7e98d473c3' }
  });
  console.log('Payments count:', payments.length);
}

checkUser()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
`;
  conn.exec(`cat << 'EOF' > /var/www/gaming-app/backend/check-user-payments.js\n${nodeScript}\nEOF\ncd /var/www/gaming-app/backend && node check-user-payments.js`, (err, stream) => {
    stream.on('data', d => process.stdout.write(d.toString()));
    stream.stderr.on('data', d => process.stderr.write(d.toString()));
    stream.on('close', () => conn.end());
  });
}).connect({host:'169.58.50.184',port:22,username:'root',password:'Iftkharzaman'});
