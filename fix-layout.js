const fs = require('fs');
let c = fs.readFileSync('src/app/admin/layout.tsx', 'utf8');
c = c.replace(/\\`/g, '`');
fs.writeFileSync('src/app/admin/layout.tsx', c);
