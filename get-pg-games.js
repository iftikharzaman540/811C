const https = require('https');
https.get('https://8111c.com/api/v1/games/gregmorn/list', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const games = JSON.parse(data);
    const pg = games.filter(g => g.provider === 'PGSoft' || (g.title && g.title.includes('Pinata')));
    console.log(pg.slice(0, 3).map(g => ({id: g.id, title: g.title, provider: g.provider})));
  });
});
