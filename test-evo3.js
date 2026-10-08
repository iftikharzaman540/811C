const crypto = require("crypto");

const secretKey = "!@{R>{bed{(6+XO";
const userId = "dd684b6f-2c8e-41b0-a6dd-742bd956920a";
const playerLogin = "TESTUSER_123";

const getGames = async () => {
  const loginRes = await fetch("https://office-api.helcenac.com/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: "login=8111C&password=pK3l<V9Db*3]yE8"
  });
  const loginData = await loginRes.json();
  const token = loginData.accessToken;

  const gamesRes = await fetch(`https://office-api.helcenac.com/users/${userId}/getUserGames/PKR`, {
    headers: { "Authorization": `Bearer ${token}` }
  });
  const games = await gamesRes.json();
  console.log("GAMES RESPONSE TYPE:", typeof games, Array.isArray(games), Object.keys(games));
  if(!Array.isArray(games)) console.log("GAMES RESPONSE:", JSON.stringify(games).substring(0, 500));
};
getGames();
