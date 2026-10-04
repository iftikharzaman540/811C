const https = require("https");
const data = JSON.stringify({ phone: "03000000001", password: "password123", cnic: "3520200000001", accountTitle: "Test User" });

const req = https.request("https://8111c.com/api/v1/auth/register", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Content-Length": data.length
  }
}, (res) => {
  let body = "";
  res.on("data", chunk => body += chunk);
  res.on("end", () => console.log(res.statusCode, body));
});
req.write(data);
req.end();
