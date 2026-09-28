const fs = require('fs');
let code = fs.readFileSync('src/payments/providers/xpresspay.provider.ts', 'utf8');

code = code.replace(
  /private readonly appId = process\.env\.XPRESSPAY_APP_ID;/g,
  "private readonly appId = process.env.XPRESSPAY_APP_ID || 'mock-app-id';"
);

code = code.replace(
  /private readonly appSecret = process\.env\.XPRESSPAY_APP_SECRET;/g,
  "private readonly appSecret = process.env.XPRESSPAY_APP_SECRET || 'mock-app-secret';"
);

fs.writeFileSync('src/payments/providers/xpresspay.provider.ts', code);
