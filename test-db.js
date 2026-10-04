const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'srv1455.hstgr.io',
  user: 'u632324167_gaminguser',
  password: 'Iftz@92071015',
  database: 'u632324167_gaming_app'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting: ' + err.stack);
    return;
  }
  console.log('Connected as id ' + connection.threadId);
});



