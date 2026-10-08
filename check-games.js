const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  const nodeScript = `
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkGames() {
  const c = await prisma.game.count();
  console.log('Total games:', c);
}

checkGames()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
`;
  conn.exec(`cat << 'EOF' > /tmp/check-games.js\n${nodeScript}\nEOF\ncd /var/www/gaming-app/backend && node /tmp/check-games.js`, (err, stream) => {
    stream.on('data', d => process.stdout.write(d.toString()));
    stream.stderr.on('data', d => process.stderr.write(d.toString()));
    stream.on('close', () => conn.end());
  });
}).connect({host:'169.58.50.184',port:22,username:'root',password:'Iftkharzaman'});
