const fs = require('fs');
let code = fs.readFileSync('src/components/Footer.tsx', 'utf8');
code = code.replace(//g, '');
fs.writeFileSync('src/components/Footer.tsx', code);
