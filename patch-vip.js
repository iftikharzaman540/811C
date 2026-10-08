const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  const patchScript = `
const fs = require('fs');
const path = '/var/www/gaming-app/backend/src/vip/vip.service.ts';
let content = fs.readFileSync(path, 'utf8');

const targetStr = "const newTotal = user.total_deposited.add(depositAmount);";
const replaceStr = "const newTotal = user.total_deposited;"; // It is already updated by wallet.service.ts

if (content.includes(targetStr)) {
  content = content.replace(targetStr, replaceStr);
  fs.writeFileSync(path, content);
  console.log('Patched vip.service.ts successfully');
} else {
  console.log('Could not find target string in vip.service.ts');
}
`;
  conn.exec(`cat << 'EOF' > /tmp/patch-vip.js\n${patchScript}\nEOF\nnode /tmp/patch-vip.js`, (err, stream) => {
    stream.on('data', d => process.stdout.write(d.toString()));
    stream.stderr.on('data', d => process.stderr.write(d.toString()));
    stream.on('close', () => conn.end());
  });
}).connect({host:'169.58.50.184',port:22,username:'root',password:'Iftkharzaman'});
