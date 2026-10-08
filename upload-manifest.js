const { Client } = require('ssh2');
const fs = require('fs');
const conn = new Client();
conn.on('ready', () => {
  const manifestContent = fs.readFileSync('public/manifest.json', 'utf8');
  const icon192 = fs.readFileSync('public/icon-192x192.png').toString('base64');
  const icon512 = fs.readFileSync('public/icon-512x512.png').toString('base64');
  
  const remoteCommands = `
    cat << 'EOF' > /var/www/gaming-app/frontend/public/manifest.json
${manifestContent}
EOF
    echo "${icon192}" | base64 -d > /var/www/gaming-app/frontend/public/icon-192x192.png
    echo "${icon512}" | base64 -d > /var/www/gaming-app/frontend/public/icon-512x512.png
    
    cd /var/www/gaming-app/frontend
    # Since layout.tsx was already modified on VPS? No, layout.tsx was modified LOCALLY here!
  `;
  
  conn.exec(remoteCommands, (err, stream) => {
    stream.on('data', d => process.stdout.write(d.toString()));
    stream.stderr.on('data', d => process.stderr.write(d.toString()));
    stream.on('close', () => conn.end());
  });
}).connect({host:'169.58.50.184',port:22,username:'root',password:'Iftkharzaman'});
