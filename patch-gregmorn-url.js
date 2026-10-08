const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  const patchScript = `
const fs = require('fs');
const path = '/var/www/gaming-app/backend/src/gregmorn/gregmorn.service.ts';
let content = fs.readFileSync(path, 'utf8');

const targetStr = \`      if (!response.ok || data.status === 'fail') {
        throw new Error(data.message || data.error || 'Failed to open game');
      }

      return data.content.game.url;\`;

const replacement = \`      if (!response.ok || data.status === 'fail') {
        throw new Error(data.message || data.error || 'Failed to open game');
      }

      let url = data.content.game && data.content.game.url;
      
      // Fallback: Some providers like Evolution return empty url but provide sessionId JWT
      if (!url && data.content.gameRes && data.content.gameRes.sessionId) {
        try {
          const token = data.content.gameRes.sessionId;
          const parts = token.split('.');
          if (parts.length >= 2) {
            const decodedStr = Buffer.from(parts[1], 'base64').toString('utf8');
            const decoded = JSON.parse(decodedStr);
            if (decoded.GameSiteUrl) {
              // Ensure no double slashes when joining
              const baseUrl = decoded.GameSiteUrl.endsWith('/') ? decoded.GameSiteUrl.slice(0, -1) : decoded.GameSiteUrl;
              url = \`\${baseUrl}/?token=\${token}\`;
            }
          }
        } catch (e) {
          this.logger.error('Failed to decode gameRes sessionId', e);
        }
      }

      return url || '';\`;

if (content.includes("return data.content.game.url;")) {
  content = content.replace(targetStr, replacement);
  fs.writeFileSync(path, content);
  console.log('Patched gregmorn.service.ts successfully');
} else {
  console.log('Target string not found in gregmorn.service.ts');
}
`;
  conn.exec(`node -e "${patchScript.replace(/"/g, '\\"')}"`, (err, stream) => {
    stream.on('data', d => process.stdout.write(d.toString()));
    stream.stderr.on('data', d => process.stderr.write(d.toString()));
    stream.on('close', () => conn.end());
  });
}).connect({host:'169.58.50.184',port:22,username:'root',password:'Iftkharzaman'});
