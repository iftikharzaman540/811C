const https = require("https");
const data = JSON.stringify({ gameId: "ag:tada:AG_TADA_FortuneGems_109", demo: false });

const req = https.request("https://8111c.com/api/v1/games/gregmorn/launch", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Content-Length": data.length,
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3NzE0NjQ5OS1mMDIxLTQyODItYjBmMS1mNzc0OTI5YTMxOGIiLCJyb2xlIjoiVVNFUiIsImlhdCI6MTc5MTA0ODUwOSwiZXhwIjoxNzkxNjUzMzA5fQ.FkbRbiIT-h6aSwRHjREJuNwzxB7iXvK-8V18pLot4BA"
  }
}, (res) => {
  let body = "";
  res.on("data", chunk => body += chunk);
  res.on("end", () => console.log(res.statusCode, body));
});
req.write(data);
req.end();
