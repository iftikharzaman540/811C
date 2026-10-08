const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  conn.exec(`
    sed -i 's/if (decoded.GameSiteUrl) {/const gameUrl = decoded.GamesSiteUrl || decoded.GameSiteUrl; if (gameUrl) {/g' /var/www/gaming-app/backend/src/gregmorn/gregmorn.service.ts
    sed -i "s/const baseUrl = decoded.GameSiteUrl.endsWith('\\/') ? decoded.GameSiteUrl.slice(0, -1) : decoded.GameSiteUrl;/const baseUrl = gameUrl.endsWith('\\/') ? gameUrl.slice(0, -1) : gameUrl;/g" /var/www/gaming-app/backend/src/gregmorn/gregmorn.service.ts
    echo "Patched gregmorn.service.ts on the VPS!"
  `, (err, stream) => {
    stream.on('data', d => process.stdout.write(d.toString()));
    stream.stderr.on('data', d => process.stderr.write(d.toString()));
    stream.on('close', () => conn.end());
  });
}).connect({host:'169.58.50.184',port:22,username:'root',password:'Iftkharzaman'});
