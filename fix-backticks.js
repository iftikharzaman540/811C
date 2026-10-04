const fs = require('fs');
let c = fs.readFileSync('backend/src/admin/admin-finances/admin-finances.service.ts', 'utf8');
c = c.replace(/\\`/g, '`');
fs.writeFileSync('backend/src/admin/admin-finances/admin-finances.service.ts', c);
