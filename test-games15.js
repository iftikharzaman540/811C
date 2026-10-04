const https = require("https");
https.get("https://8111c.com/api/v1/games/gregmorn/list", (res) => {
  let data = "";
  res.on("data", chunk => data += chunk);
  res.on("end", () => {
    let parsed = JSON.parse(data);
    if (!Array.isArray(parsed)) parsed = parsed.games || parsed.data || [];
    const bj = parsed.filter(g => (g.name || g.title).toLowerCase().includes("blackjack"));
    const rou = parsed.filter(g => (g.name || g.title).toLowerCase().includes("roulette"));
    const ocean = parsed.filter(g => (g.name || g.title).toLowerCase().includes("ocean monster"));
    console.log("Blackjack:", bj.map(g => g.name || g.title));
    console.log("Roulette:", rou.map(g => g.name || g.title));
    console.log("Ocean:", ocean.map(g => g.name || g.title));
  });
});
