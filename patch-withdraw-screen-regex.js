const fs = require('fs');
const path = 'src/components/WithdrawScreen.tsx';
let content = fs.readFileSync(path, 'utf8');

const regex = /if\s*\(refreshUser\)\s*refreshUser\(\);\s*\/\/\s*Refresh\s*balance\s*router\.push\("\/profile"\);/g;
content = content.replace(regex, `if (refreshUser) refreshUser(); // Refresh balance
          router.push("/withdrawal-history");`);
fs.writeFileSync(path, content);
console.log('Patched WithdrawScreen router push via regex');
