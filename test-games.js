fetch("https://8111c.com/api/v1/games")
.then(res => res.json())
.then(data => console.log(JSON.stringify(data.slice(0,2), null, 2)))
.catch(err => console.error(err));
