const fs = require("fs");
const file = "/var/www/gaming-app/backend/src/gregmorn/gregmorn.service.ts";
let content = fs.readFileSync(file, "utf8");

content = content.replace(
  /if \(decoded\.GameSiteUrl\) \{/g,
  "const gameUrl = decoded.GamesSiteUrl || decoded.GameSiteUrl;\n            if (gameUrl) {"
);
content = content.replace(
  /const baseUrl = decoded\.GameSiteUrl\.endsWith\('\/'\) \? decoded\.GameSiteUrl\.slice\(0, -1\) : decoded\.GameSiteUrl;/g,
  "const baseUrl = gameUrl.endsWith('/') ? gameUrl.slice(0, -1) : gameUrl;"
);

fs.writeFileSync(file, content, "utf8");
console.log("Patched gregmorn.service.ts on the VPS!");
