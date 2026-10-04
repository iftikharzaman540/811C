const fs = require('fs');
const file = 'backend/src/gregmorn/gregmorn.service.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  "private loginId = process.env.GREGMORN_LOGIN || '';",
  "private loginId = process.env.GREGMORN_LOGIN || '8111C';"
);
code = code.replace(
  "private password = process.env.GREGMORN_PASSWORD || '';",
  "private password = process.env.GREGMORN_PASSWORD || 'h3PwROwNb-Il';"
);
code = code.replace(
  "public userId = process.env.GREGMORN_USER_ID || '';",
  "public userId = process.env.GREGMORN_USER_ID || 'dd684b6f-2c8e-41b0-a6dd-742bd956920a';"
);
code = code.replace(
  "public secretKey = process.env.GREGMORN_SECRET_KEY || '';",
  "public secretKey = process.env.GREGMORN_SECRET_KEY || 'Q6NLPylw_Kzi';"
);

fs.writeFileSync(file, code);
console.log("Patched gregmorn service env defaults");
