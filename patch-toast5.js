const fs = require('fs');
let code = fs.readFileSync('src/app/support/page.tsx', 'utf8');

// just force '"use client"' at the very beginning and remove the old ones
code = code.replace(/"use client";/g, '');
code = '"use client";\\n' + code;

fs.writeFileSync('src/app/support/page.tsx', code);
