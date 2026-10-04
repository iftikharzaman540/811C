const fs = require('fs');
let code = fs.readFileSync('backend/src/payments/payments.service.ts', 'utf8');

code = code.replace(
  /gatewayOrderNo: providerResponse\.gatewayOrderNo\s*\n\s*\}/g,
  "gatewayOrderNo: providerResponse.gatewayOrderNo,\n      payment_url: providerResponse.payment_url\n    }"
);

fs.writeFileSync('backend/src/payments/payments.service.ts', code);
console.log("Patched payments.service.ts to return payment_url");
