const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  const patchScript = `
const fs = require('fs');
const path = '/var/www/gaming-app/backend/src/wallet/wallet.service.ts';
let content = fs.readFileSync(path, 'utf8');

// Patch 1: increment total_deposited for DEPOSIT
const targetDepositReq = "current_wagering_requirement: { increment: data.amount }";
const replaceDepositReq = "current_wagering_requirement: { increment: data.amount },\\n                  total_deposited: { increment: data.amount }";

// Patch 2: increment total_deposited for Reset case
const targetDepositReset = "current_wagering_completed: 0";
const replaceDepositReset = "current_wagering_completed: 0,\\n                  total_deposited: { increment: data.amount }";

// Patch 3: increment total_withdrawn for WITHDRAWAL
const targetWithdrawal = "if (balanceAfter < 0) {";
const replaceWithdrawal = \`if (data.type === 'WITHDRAWAL') {
        await tx.user.update({
          where: { id: wallet.user_id },
          data: { total_withdrawn: { increment: data.amount } }
        });
      }
      if (balanceAfter < 0) {\`;

if (content.includes(targetDepositReq)) {
  content = content.replace(targetDepositReq, replaceDepositReq);
  content = content.replace(targetDepositReset, replaceDepositReset);
  content = content.replace(targetWithdrawal, replaceWithdrawal);
  fs.writeFileSync(path, content);
  console.log('Patched wallet.service.ts successfully');
} else {
  console.log('Could not find target strings in wallet.service.ts');
}
`;
  conn.exec(`cat << 'EOF' > /tmp/patch-wallet.js\n${patchScript}\nEOF\nnode /tmp/patch-wallet.js`, (err, stream) => {
    stream.on('data', d => process.stdout.write(d.toString()));
    stream.stderr.on('data', d => process.stderr.write(d.toString()));
    stream.on('close', () => conn.end());
  });
}).connect({host:'169.58.50.184',port:22,username:'root',password:'Iftkharzaman'});
