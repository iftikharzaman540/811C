const fs = require('fs');
let code = fs.readFileSync('src/app/support/page.tsx', 'utf8');
code = code.split('\\`').join('`');
code = code.split('\\${').join('${');
fs.writeFileSync('src/app/support/page.tsx', code);
