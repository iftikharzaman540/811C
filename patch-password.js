const fs = require('fs');
const file = 'backend/src/gregmorn/gregmorn.service.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  "private password = process.env.GREGMORN_PASSWORD || 'h3PwROwNb-Il';",
  "private password = process.env.GREGMORN_PASSWORD || '9!J!k<Qh{)AZD)q';"
);

fs.writeFileSync(file, code);
console.log("Patched gregmorn service password");
