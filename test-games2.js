fetch("https://8111c.com/api/v1/games")
.then(res => res.json())
.then(data => console.log(typeof data, Array.isArray(data) ? data.length : Object.keys(data), JSON.stringify(data).substring(0, 500)))
.catch(err => console.error(err));
