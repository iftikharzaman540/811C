const fs = require('fs');
let code = fs.readFileSync('backend/src/promo/promo.service.ts', 'utf8');
code = code.replace(/\\`Promotion/g, '`Promotion');
code = code.replace(/\\`Successfully/g, '`Successfully');
code = code.replace(/\\\$\{currentPromo\}\\\`/g, '${currentPromo}`');
fs.writeFileSync('backend/src/promo/promo.service.ts', code);
