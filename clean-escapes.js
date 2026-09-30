const fs = require('fs');

let backend = fs.readFileSync('backend/src/promo/promo.service.ts', 'utf8');
backend = backend.replace(/\\\`/g, '\`').replace(/\\\$/g, '$');
fs.writeFileSync('backend/src/promo/promo.service.ts', backend);

let frontend = fs.readFileSync('src/app/promo/page.tsx', 'utf8');
frontend = frontend.replace(/\\\`/g, '\`').replace(/\\\$/g, '$');
fs.writeFileSync('src/app/promo/page.tsx', frontend);

console.log("All escaping issues fixed.");
