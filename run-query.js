const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  conn.exec('cd /var/www/gaming-app/backend && cat << \\"EOF\\" > test-query.js\nconst crypto = require("crypto");\nconst fetch = require("node-fetch");\nconst appId = "bv9qmvpxw292192pt43itven";\nconst appSecret = "628ccd6f8af470cbc820c7743a45c1f0ca01b08f07f70a62";\nconst merOrderNo = "DEP7fe0_1791131976077_4138"; // Example from screenshot\n\nconst payload = { appId, merOrderNo };\nconst stringToSign = "appId=" + appId + "&merOrderNo=" + merOrderNo + "&key=" + appSecret;\nconst sign = crypto.createHash("sha256").update(stringToSign).digest("hex").toLowerCase();\npayload.sign = sign;\n\nfetch("https://xpresspay.cloud/api/v2/payment/order/query", {\n  method: "POST",\n  headers: { "Content-Type": "application/json" },\n  body: JSON.stringify(payload)\n}).then(r=>r.text()).then(console.log);\nEOF\nnode test-query.js', (err, stream) => {
    stream.on('data', d => process.stdout.write(d.toString()));
    stream.stderr.on('data', d => process.stderr.write(d.toString()));
    stream.on('close', () => conn.end());
  });
}).connect({host:'169.58.50.184',port:22,username:'root',password:'Iftkharzaman'});
