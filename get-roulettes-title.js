const https = require('https');
https.get('https://8111c.com/api/v1/games/gregmorn/list', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const games = JSON.parse(data);
    const roulettes = games.filter(g => g.title && g.title.includes('Roulette'));
    console.log(roulettes.slice(0, 10).map(g => ({id: g.id, title: g.title, provider: g.provider})));
  });
});
