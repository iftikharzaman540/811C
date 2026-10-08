const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  const code = `
fetch("https://builder.pwabuilder.com/api/android/package", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    "url": "https://8111c.com/",
    "manifestUrl": "https://8111c.com/manifest.json",
    "manifest": {
      "name": "8111C - Play & Win",
      "short_name": "8111C",
      "start_url": "/",
      "display": "standalone",
      "background_color": "#000000",
      "theme_color": "#000000",
      "icons": [
        { "src": "/icon-192x192.png", "sizes": "192x192", "type": "image/png" },
        { "src": "/icon-512x512.png", "sizes": "512x512", "type": "image/png" }
      ]
    },
    "appVersion": "1.0.1",
    "iconUrl": "https://8111c.com/icon-512x512.png",
    "maskableIconUrl": "https://8111c.com/icon-512x512.png",
    "themeColor": "#000000",
    "backgroundColor": "#000000",
    "features": { "location": false, "camera": false, "microphone": false },
    "signingMode": "new",
    "name": "8111C - Play & Win",
    "shortName": "8111C",
    "packageId": "com.c8111.app",
    "host": "8111c.com",
    "startUrl": "/"
  })
})
.then(r => r.json())
.then(data => console.log(JSON.stringify(data, null, 2)))
.catch(e => console.error(e));
`;
  conn.exec(`cat << 'EOF' > /tmp/test-pwabuilder.js\n${code}\nEOF\nnode /tmp/test-pwabuilder.js`, (err, stream) => {
    stream.on('data', d => process.stdout.write(d.toString()));
    stream.stderr.on('data', d => process.stderr.write(d.toString()));
    stream.on('close', () => conn.end());
  });
}).connect({host:'169.58.50.184',port:22,username:'root',password:'Iftkharzaman'});
