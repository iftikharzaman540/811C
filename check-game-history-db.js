const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  const nodeScript = `
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkUser() {
  const h = await prisma.gameHistory.findMany({
    where: { user_id: '3741c49b-9f47-40a9-ab6d-db7e98d473c3' }
  });
  console.log('Game history count:', h.length);
}

checkUser()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
`;
  conn.exec(`cat << 'EOF' > /var/www/gaming-app/backend/check-game-history.js\n${nodeScript}\nEOF\ncd /var/www/gaming-app/backend && node check-game-history.js`, (err, stream) => {
    stream.on('data', d => process.stdout.write(d.toString()));
    stream.stderr.on('data', d => process.stderr.write(d.toString()));
    stream.on('close', () => conn.end());
  });
}).connect({host:'169.58.50.184',port:22,username:'root',password:'Iftkharzaman'});
