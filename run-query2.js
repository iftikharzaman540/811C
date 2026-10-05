const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  conn.exec('cd /var/www/gaming-app/backend && echo "const crypto = require(\\"crypto\\"); const fetch = require(\\"node-fetch\\"); const appId = \\"bv9qmvpxw292192pt43itven\\"; const appSecret = \\"628ccd6f8af470cbc820c7743a45c1f0ca01b08f07f70a62\\"; const merOrderNo = \\"JC-EP998570985\\"; const payload = { appId, merOrderNo }; const stringToSign = \\"appId=\\" + appId + \\"&merOrderNo=\\" + merOrderNo + \\"&key=\\" + appSecret; const sign = crypto.createHash(\\"sha256\\").update(stringToSign).digest(\\"hex\\").toLowerCase(); payload.sign = sign; fetch(\\"https://xpresspay.cloud/api/v2/payment/order/query\\", { method: \\"POST\\", headers: { \\"Content-Type\\": \\"application/json\\" }, body: JSON.stringify(payload) }).then(r=>r.text()).then(console.log);" > testq.js && node testq.js', (err, stream) => {
    stream.on('data', d => process.stdout.write(d.toString()));
    stream.stderr.on('data', d => process.stderr.write(d.toString()));
    stream.on('close', () => conn.end());
  });
}).connect({host:'169.58.50.184',port:22,username:'root',password:'Iftkharzaman'});
