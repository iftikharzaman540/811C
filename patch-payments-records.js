const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  const patchScript = `
const fs = require('fs');
const path = '/var/www/gaming-app/backend/src/payments/payments.service.ts';
let content = fs.readFileSync(path, 'utf8');

const targetStr = \`  async getRecords(userId: string) {
    const payments = await this.prisma.payment.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
      take: 100
    });
    return payments.map(p => ({
      id: p.id,
      record_type: p.type,
      amount: Number(p.amount),
      status: p.status,
      created_at: p.created_at,
      provider: p.provider
    }));
  }\`;

const replaceStr = \`  async getRecords(userId: string) {
    const payments = await this.prisma.payment.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
      take: 100
    });
    
    const wallet = await this.prisma.wallet.findUnique({ where: { user_id: userId } });
    const adjustments = wallet ? await this.prisma.walletTransaction.findMany({
      where: { wallet_id: wallet.id, type: 'ADJUSTMENT' },
      orderBy: { created_at: 'desc' },
      take: 100
    }) : [];

    const result = [
      ...payments.map(p => ({
        id: p.id,
        record_type: p.type,
        amount: Number(p.amount),
        status: p.status,
        created_at: p.created_at,
        provider: p.provider
      })),
      ...adjustments.map(a => {
        const isCredit = Number(a.balance_after) > Number(a.balance_before);
        return {
          id: a.id,
          record_type: isCredit ? 'DEPOSIT' : 'WITHDRAWAL',
          amount: Number(a.amount),
          status: 'COMPLETED',
          created_at: a.created_at,
          provider: a.description || 'MANUAL ADJUSTMENT'
        };
      })
    ];

    result.sort((a, b) => b.created_at.getTime() - a.created_at.getTime());
    return result.slice(0, 100);
  }\`;

if (content.includes("async getRecords(userId: string) {")) {
  content = content.replace(targetStr, replaceStr);
  fs.writeFileSync(path, content);
  console.log('Patched payments.service.ts successfully');
} else {
  console.log('Could not find target string in payments.service.ts');
}
`;
  conn.exec(`cat << 'EOF' > /tmp/patch-payments-records.js\n${patchScript}\nEOF\nnode /tmp/patch-payments-records.js`, (err, stream) => {
    stream.on('data', d => process.stdout.write(d.toString()));
    stream.stderr.on('data', d => process.stderr.write(d.toString()));
    stream.on('close', () => conn.end());
  });
}).connect({host:'169.58.50.184',port:22,username:'root',password:'Iftkharzaman'});
