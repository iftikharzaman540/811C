const https = require("https");
https.get("https://8111c.com/api/v1/games/gregmorn/list", (res) => {
  let data = "";
  res.on("data", chunk => data += chunk);
  res.on("end", () => {
    let parsed = JSON.parse(data);
    if (!Array.isArray(parsed)) parsed = parsed.games || parsed.data || [];
    const superAce = parsed.filter(g => (g.name || g.title).toLowerCase().includes("super ace"));
    const joker = parsed.filter(g => (g.name || g.title).toLowerCase().includes("joker"));
    console.log("Super Ace:", superAce.map(g => g.name || g.title));
    console.log("Joker:", joker.map(g => g.name || g.title));
  });
});
