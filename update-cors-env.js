const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
  conn.exec("sed -i 's/CORS_ORIGIN=\"https:\\/\\/8111c.com,https:\\/\\/www.8111c.com\"/CORS_ORIGIN=\"https:\\/\\/8111c.com,https:\\/\\/www.8111c.com,https:\\/\\/office-dev.gamble-hub.net,https:\\/\\/office.gamble-hub.net\"/g' /var/www/gaming-app/backend/.env && pm2 restart gaming-backend", (err, stream) => {
    if (err) throw err;
    stream.on('close', () => {
      conn.end();
    }).on('data', (data) => {
      console.log(data.toString());
    }).stderr.on('data', (data) => {
      console.error(data.toString());
    });
  });
}).connect({
  host: '169.58.50.184',
  port: 22,
  username: 'root',
  password: 'Iftkharzaman'
});
