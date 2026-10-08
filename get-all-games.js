const https = require('https');
https.get('https://8111c.com/api/v1/games/gregmorn/list', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const games = JSON.parse(data);
      console.log(`Total games: ${games.length}`);
      console.log(games.slice(0, 2));
    } catch(e) {
      console.log("Error parsing:", data);
    }
  });
});
