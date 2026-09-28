const fs = require('fs');
const file = 'backend/src/gregmorn/gregmorn.service.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  "private officeApiUrl = process.env.GREGMORN_OFFICE_API || 'https://office-api-dev.helcenac.com';",
  "private officeApiUrl = 'https://office-api.helcenac.com';"
);
code = code.replace(
  "private clientApiUrl = process.env.GREGMORN_CLIENT_API || 'https://client-api-dev.helcenac.com';",
  "private clientApiUrl = 'https://client-api.helcenac.com';"
);
code = code.replace(
  "private password = process.env.GREGMORN_PASSWORD || '9!J!k<Qh{)AZD)q';",
  "private password = 'pK3l<V9Db*3]yE8';"
);
code = code.replace(
  "public secretKey = process.env.GREGMORN_SECRET_KEY || 'Q6NLPylw_Kzi';",
  "public secretKey = '!@{R>{bed{(6+XO';"
);

fs.writeFileSync(file, code);
console.log("Patched hardcoded URLs and secrets");
