const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  const nodeScript = `
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixStats() {
  console.log('Starting stats fix...');
  const users = await prisma.user.findMany();
  for (const user of users) {
    // Calculate total deposited
    const deposits = await prisma.payment.aggregate({
      where: { user_id: user.id, type: 'DEPOSIT', status: 'COMPLETED' },
      _sum: { amount: true }
    });
    
    // Calculate manual credits
    const credits = await prisma.auditLog.findMany({
      where: { user_id: user.id, action: 'MANUAL_WALLET_CREDIT' }
    });
    
    let totalDep = Number(deposits._sum.amount || 0);
    for (const c of credits) {
      if (c.old_value && c.new_value) {
        totalDep += (Number(c.new_value.balance) - Number(c.old_value.balance));
      }
    }

    // Update if needed
    if (Number(user.total_deposited) !== totalDep) {
      console.log(\`Fixing user \${user.id}: Dep \${user.total_deposited} -> \${totalDep}\`);
      await prisma.user.update({
        where: { id: user.id },
        data: { total_deposited: totalDep }
      });
    }
  }
  console.log('Done!');
}

fixStats()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
`;
  conn.exec(`cat << 'EOF' > /var/www/gaming-app/backend/fix-stats-2.js\n${nodeScript}\nEOF\ncd /var/www/gaming-app/backend && node fix-stats-2.js`, (err, stream) => {
    stream.on('data', d => process.stdout.write(d.toString()));
    stream.stderr.on('data', d => process.stderr.write(d.toString()));
    stream.on('close', () => conn.end());
  });
}).connect({host:'169.58.50.184',port:22,username:'root',password:'Iftkharzaman'});
