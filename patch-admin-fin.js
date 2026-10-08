const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  const patchScript = `
const fs = require('fs');
const path = '/var/www/gaming-app/backend/src/admin/admin-finances/admin-finances.service.ts';
let content = fs.readFileSync(path, 'utf8');

const targetStr = "current_wagering_requirement: { increment: amount }";
const replaceStr = "current_wagering_requirement: { increment: amount },\\n            total_deposited: { increment: amount }";

if (content.includes(targetStr)) {
  content = content.replace(targetStr, replaceStr);
  fs.writeFileSync(path, content);
  console.log('Patched admin-finances.service.ts successfully');
} else {
  console.log('Could not find target string in admin-finances.service.ts');
}
`;
  conn.exec(`cat << 'EOF' > /tmp/patch-admin-fin.js\n${patchScript}\nEOF\nnode /tmp/patch-admin-fin.js`, (err, stream) => {
    stream.on('data', d => process.stdout.write(d.toString()));
    stream.stderr.on('data', d => process.stderr.write(d.toString()));
    stream.on('close', () => conn.end());
  });
}).connect({host:'169.58.50.184',port:22,username:'root',password:'Iftkharzaman'});
