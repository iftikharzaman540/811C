const https = require("https");
https.get("https://8111c.com/api/v1/games/gregmorn/list", (res) => {
  let data = "";
  res.on("data", chunk => data += chunk);
  res.on("end", () => {
    let parsed = JSON.parse(data);
    if (!Array.isArray(parsed)) parsed = parsed.games || parsed.data || [];
    const dt = parsed.filter(g => (g.name || g.title).toLowerCase() === "fortune gems");
    console.log(dt.map(g => `${g.title} (${g.provider}) - ${g.id}`));
  });
});
