const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
  conn.exec('sudo -u postgres psql -d gaming_db -c "SELECT email, username FROM \\"User\\" LIMIT 5;"', (err, stream) => {
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
