fetch('https://8111c.com/api/v1/games/gregmorn/list', {
  headers: {
    'Origin': 'https://office-dev.gamble-hub.net'
  }
}).then(r => {
  console.log(r.status);
  console.log(Object.fromEntries(r.headers.entries()));
}).catch(console.error);
