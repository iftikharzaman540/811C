const https = require('https');
https.get('https://8111c.com/api/v1/games/gregmorn/list', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const games = JSON.parse(data);
    const roulettes = games.filter(g => g.name && g.name.includes('Roulette'));
    console.log(roulettes.slice(0, 5).map(g => ({id: g.id, name: g.name, provider: g.provider})));
  });
});
