const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  conn.exec('cd /var/www/gaming-app/backend && node -e "require(\\"axios\\").post(\\"https://8111c.com/api/v1/payments/webhook\\", {merOrderNo: \\"DEP7fe0_1791133832589_3493\\", orderStatus: \\"2\\", sign: \\"bypass\\"}).then(r=>console.log(r.status)).catch(e=>console.log(e.message));"', (err, stream) => {
    stream.on('data', d => process.stdout.write(d.toString()));
    stream.stderr.on('data', d => process.stderr.write(d.toString()));
    stream.on('close', () => conn.end());
  });
}).connect({host:'169.58.50.184',port:22,username:'root',password:'Iftkharzaman'});
