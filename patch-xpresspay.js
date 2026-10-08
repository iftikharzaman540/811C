const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  const patchScript = `
const fs = require('fs');
const path = '/var/www/gaming-app/backend/src/payments/providers/xpresspay.provider.ts';
let content = fs.readFileSync(path, 'utf8');

const targetStr = "      if (data && (data.code == 0 || data.code == '0') && data.data && String(data.data.orderStatus) === '2') {";
const replaceStr = "      const st = data?.data?.orderStatus ? String(data.data.orderStatus).toUpperCase() : '';\\n      const statusText = data?.data?.status ? String(data.data.status).toUpperCase() : '';\\n      if (data && (data.code == 0 || data.code == '0') && data.data && (st === '2' || st === 'SUCCESS' || st === 'OK' || statusText === 'SUCCESS')) {";

if (content.includes(targetStr)) {
  content = content.replace(targetStr, replaceStr);
  fs.writeFileSync(path, content);
  console.log('Patched xpresspay.provider.ts checkOrderStatus success condition');
} else {
  console.log('Could not find targetStr in xpresspay.provider.ts');
}
`;
  conn.exec(`cat << 'EOF' > /tmp/patch-xpresspay.js\n${patchScript}\nEOF\nnode /tmp/patch-xpresspay.js`, (err, stream) => {
    stream.on('data', d => process.stdout.write(d.toString()));
    stream.stderr.on('data', d => process.stderr.write(d.toString()));
    stream.on('close', () => conn.end());
  });
}).connect({host:'169.58.50.184',port:22,username:'root',password:'Iftkharzaman'});
