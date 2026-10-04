const fs = require('fs');
let code = fs.readFileSync('src/components/Footer.tsx', 'utf8');
code = code.replace(/Copyright/g, '\u00A9Copyright');
fs.writeFileSync('src/components/Footer.tsx', code);
