const { Client } = require('ssh2');
const fs = require('fs');

const nodeScript = `
const fs = require('fs');
const path = '/var/www/gaming-app/backend/src/admin/admin-finances/admin-finances.service.ts';
let content = fs.readFileSync(path, 'utf8');

const targetStr = \`      if (type === 'CREDIT') {
        balanceAfter += amount;
      } else if (type === 'DEBIT') {\`;

const replacement = \`      if (type === 'CREDIT') {
        balanceAfter += amount;
        
        // Add to wagering requirement for CREDIT adjustments
        const user = await tx.user.findUnique({ where: { id: userId } });
        const currentReq = Number(user?.current_wagering_requirement || 0);
        const currentComp = Number(user?.current_wagering_completed || 0);
        
        if (currentComp >= currentReq) {
          await tx.user.update({
            where: { id: userId },
            data: {
              current_wagering_requirement: amount,
              current_wagering_completed: 0
            }
          });
        } else {
          await tx.user.update({
            where: { id: userId },
            data: {
              current_wagering_requirement: { increment: amount }
            }
          });
        }
      } else if (type === 'DEBIT') {\`;

if(content.includes(targetStr)) {
  content = content.replace(targetStr, replacement);
  fs.writeFileSync(path, content);
  console.log('Patched adjustWallet for wagering requirement');
} else {
  console.log('Target string not found!');
}
`;

const conn = new Client();
conn.on('ready', () => {
  conn.sftp((err, sftp) => {
    if (err) throw err;
    const writeStream = sftp.createWriteStream('/tmp/patch-wager.js');
    writeStream.write(nodeScript);
    writeStream.end(() => {
      conn.exec('node /tmp/patch-wager.js', (err, stream) => {
        if (err) throw err;
        stream.on('data', (d) => process.stdout.write(d.toString()));
        stream.stderr.on('data', (d) => process.stderr.write(d.toString()));
        stream.on('close', () => conn.end());
      });
    });
  });
}).connect({host:'169.58.50.184',port:22,username:'root',password:'Iftkharzaman'});
