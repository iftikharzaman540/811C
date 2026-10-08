const crypto = require("crypto");

const secretKey = "!@{R>{bed{(6+XO";
const playerLogin = "TESTUSER_123";

const getGames = async () => {
  const loginRes = await fetch("https://office-api.helcenac.com/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: "login=8111C&password=pK3l<V9Db*3]yE8"
  });
  const loginData = await loginRes.json();
  const token = loginData.accessToken;
  const userId = loginData.user.id;

  const gamesRes = await fetch(`https://office-api.helcenac.com/users/${userId}/getUserGames/PKR`, {
    headers: { "Authorization": `Bearer ${token}` }
  });
  const games = await gamesRes.json();
  const evoGames = games.filter(g => g.provider === "Evolution" && g.title.includes("Roulette"));
  console.log("Found Evolution Roulette Games:", evoGames.map(g => g.title + " | " + g.id));
  
  if(evoGames.length > 0) {
    // Let's test the specific "Auto Roulette" game
    const targetGame = evoGames.find(g => g.title === "Auto Roulette" || g.title.includes("Auto Roulette"));
    const gameId = targetGame ? targetGame.id : evoGames[0].id;
    console.log("Testing launch for:", gameId);
    
    const payload = {
      currency: "PKR",
      demo: "0",
      exitUrl: "https://8111c.com/",
      callbackUrl: "https://8111c.com/api/v1/webhooks/gregmorn",
      gameId,
      language: "en",
      player_login: playerLogin,
      user_id: userId
    };
    
    const bodyString = JSON.stringify(payload);
    const signature = crypto.createHmac('sha256', secretKey).update(bodyString, 'utf8').digest('hex');
    
    const openRes = await fetch("https://client-api.helcenac.com/games/openGame", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Signature": signature },
      body: bodyString
    });
    const openData = await openRes.text();
    console.log("RAW RESPONSE FROM GREGMORN:", openData);
  }
};
getGames();
