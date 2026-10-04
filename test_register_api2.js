const https = require('https');

const data = JSON.stringify({
  email: 'nonexistent2@example.com',
  password: 'wrongpassword'
});

const options = {
  hostname: '8111c.com',
  port: 443,
  path: '/api/v1/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = https.request(options, res => {
  console.log(`STATUS: ${res.statusCode}`);
  res.on('data', d => {
    process.stdout.write(d);
  });
});

req.on('error', error => {
  console.error(error);
});

req.write(data);
req.end();
