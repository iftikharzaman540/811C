const fs = require('fs');
let code = fs.readFileSync('src/app/admin/finances/deposits/page.tsx', 'utf8');
code = code.replace(/colSpan=\{7\}/g, 'colSpan={8}');
fs.writeFileSync('src/app/admin/finances/deposits/page.tsx', code);
