const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  const patchScript = `
const fs = require('fs');
const path = '/var/www/gaming-app/backend/src/wallet/wallet.service.ts';
let content = fs.readFileSync(path, 'utf8');

const targetStr = \`if (data.type === 'WITHDRAWAL') {
        await tx.user.update({
          where: { id: wallet.user_id },
          data: { total_withdrawn: { increment: data.amount } }
        });
      }
      if (balanceAfter < 0) {\`;
const replaceStr = \`if (balanceAfter < 0) {\`;

if (content.includes(targetStr)) {
  content = content.replace(targetStr, replaceStr);
  fs.writeFileSync(path, content);
  console.log('Reverted total_withdrawn patch successfully');
} else {
  console.log('Could not find total_withdrawn patch in wallet.service.ts');
}
`;
  conn.exec(`cat << 'EOF' > /tmp/revert-wallet.js\n${patchScript}\nEOF\nnode /tmp/revert-wallet.js`, (err, stream) => {
    stream.on('data', d => process.stdout.write(d.toString()));
    stream.stderr.on('data', d => process.stderr.write(d.toString()));
    stream.on('close', () => conn.end());
  });
}).connect({host:'169.58.50.184',port:22,username:'root',password:'Iftkharzaman'});
