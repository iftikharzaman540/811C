const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  const patchScript = `
const fs = require('fs');
const path = '/var/www/gaming-app/backend/src/payments/payments.service.ts';
let content = fs.readFileSync(path, 'utf8');

const targetStr = "    if (orderStatus === '2' || statusText === 'PAID') {";
const replaceStr = "    if (orderStatus === '2' || statusText === 'PAID' || statusText === 'SUCCESS' || orderStatus.toUpperCase() === 'SUCCESS' || orderStatus.toUpperCase() === 'OK') {";

if (content.includes(targetStr)) {
  content = content.replace(targetStr, replaceStr);
  fs.writeFileSync(path, content);
  console.log('Patched payments.service.ts handleWebhook success condition');
} else {
  console.log('Could not find targetStr in payments.service.ts');
}
`;
  conn.exec(`cat << 'EOF' > /tmp/patch-webhook.js\n${patchScript}\nEOF\nnode /tmp/patch-webhook.js`, (err, stream) => {
    stream.on('data', d => process.stdout.write(d.toString()));
    stream.stderr.on('data', d => process.stderr.write(d.toString()));
    stream.on('close', () => conn.end());
  });
}).connect({host:'169.58.50.184',port:22,username:'root',password:'Iftkharzaman'});
