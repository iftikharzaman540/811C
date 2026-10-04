const fs = require('fs');
let code = fs.readFileSync('src/components/HomeScreen.tsx', 'utf8');

const target = `            if (res.ok && data.url) {
              setGameUrl(data.url);
            } else {
              toast.error("Failed to launch game");
            }`;

const replacement = `            if (res.ok && data.url) {
              setGameUrl(data.url);
            } else {
              toast.error(data.message || data.error || "Failed to launch game");
            }`;

code = code.replace(target, replacement);
fs.writeFileSync('src/components/HomeScreen.tsx', code);
