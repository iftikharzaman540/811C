fetch("https://8111c.com/api/v1/games/gregmorn/list")
.then(res => res.json())
.then(data => {
  console.log("IsArray:", Array.isArray(data));
  if (!Array.isArray(data)) console.log("Keys:", Object.keys(data));
  console.log("Snippet:", JSON.stringify(data).substring(0, 300));
})
.catch(err => console.error(err));
