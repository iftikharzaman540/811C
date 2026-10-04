const fs = require('fs');
const file = 'backend/src/gregmorn/gregmorn.service.ts';
let code = fs.readFileSync(file, 'utf8');

// Update URL
code = code.replace(
  "private officeApiUrl = process.env.GREGMORN_OFFICE_API || 'https://office-api-dev.helcenac.com';",
  "private officeApiUrl = process.env.GREGMORN_OFFICE_API || 'https://office-api.gamble-hub.net';"
);
code = code.replace(
  "private clientApiUrl = process.env.GREGMORN_CLIENT_API || 'https://client-api-dev.helcenac.com';",
  "private clientApiUrl = process.env.GREGMORN_CLIENT_API || 'https://client-api.gamble-hub.net';"
);

// Update Credentials
code = code.replace(
  "private loginId = process.env.GREGMORN_LOGIN || '8111C';",
  "private loginId = process.env.GREGMORN_LOGIN || '8111C';" // remains same
);
code = code.replace(
  "private password = process.env.GREGMORN_PASSWORD || '9!J!k<Qh{)AZD)q';",
  "private password = process.env.GREGMORN_PASSWORD || 'pK3l<V9Db*3]yE8';"
);
code = code.replace(
  "public userId = process.env.GREGMORN_USER_ID || 'dd684b6f-2c8e-41b0-a6dd-742bd956920a';",
  "public userId = process.env.GREGMORN_USER_ID || 'cd32db12-418a-4ea7-b957-b772ed503f47';"
);
code = code.replace(
  "public secretKey = process.env.GREGMORN_SECRET_KEY || 'Q6NLPylw_Kzi';",
  "public secretKey = process.env.GREGMORN_SECRET_KEY || '!@{R>{bed{(6+XO';"
);

fs.writeFileSync(file, code);
console.log("Patched gregmorn service to PROD");
