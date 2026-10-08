const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  const nodeScript = `
async function test() {
  const params = new URLSearchParams();
  params.append('login', '8111C');
  params.append('password', 'pK3l<V9Db*3]yE8');
  const res = await fetch("https://office-api.helcenac.com/auth/login", {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString()
  });
  console.log(await res.json());
}
test();
`;
  conn.exec(`cat << 'EOF' > /tmp/test-login.js\n${nodeScript}\nEOF\nnode /tmp/test-login.js`, (err, stream) => {
    stream.on('data', d => process.stdout.write(d.toString()));
    stream.stderr.on('data', d => process.stderr.write(d.toString()));
    stream.on('close', () => conn.end());
  });
}).connect({host:'169.58.50.184',port:22,username:'root',password:'Iftkharzaman'});
