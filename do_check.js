const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  conn.sftp((err, sftp) => {
    if (err) throw err;
    const writeStream = sftp.createWriteStream('/var/www/gaming-app/backend/check_logs.js');
    writeStream.write(`
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const logs = await prisma.auditLog.findMany({
    where: { action: { startsWith: 'MANUAL_WALLET_' } },
    orderBy: { created_at: 'desc' },
    take: 5
  });
  console.log(logs.map(l => ({ action: l.action, old: l.old_value, new: l.new_value })));
}
main().catch(console.error).finally(() => prisma.$disconnect());
`);
    writeStream.end();
    writeStream.on('close', () => {
      conn.exec('cd /var/www/gaming-app/backend && node check_logs.js', (err, stream) => {
        stream.on('data', d => process.stdout.write(d.toString()));
        stream.stderr.on('data', d => process.stderr.write(d.toString()));
        stream.on('close', () => conn.end());
      });
    });
  });
}).connect({host:'169.58.50.184',port:22,username:'root',password:'Iftkharzaman'});
