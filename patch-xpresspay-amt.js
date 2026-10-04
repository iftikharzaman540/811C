const fs = require('fs');
let code = fs.readFileSync('backend/src/payments/providers/xpresspay.provider.ts', 'utf8');

code = code.replace(
  /amount: Number\(amount\)\.toFixed\(2\),/g,
  "amount: Number(amount),"
);

fs.writeFileSync('backend/src/payments/providers/xpresspay.provider.ts', code);
console.log("Patched xpresspay provider amount format");
