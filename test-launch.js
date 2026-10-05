const https = require('https');
const data = JSON.stringify({ gameId: 'magic-firekirin:fishing:510001', isDemo: false });
const req = https.request('https://8111c.com/api/v1/games/gregmorn/launch', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
}, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => console.log(res.statusCode, body));
});
req.on('error', console.error);
req.write(data);
req.end();
