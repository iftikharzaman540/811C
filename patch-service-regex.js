const fs = require('fs');
let code = fs.readFileSync('backend/src/payments/payments.service.ts', 'utf8');

code = code.replace(
  /transaction_reference: reference,\s*status: status,/,
  'transaction_reference: reference,\n        status: status,\n        metadata: accountNo ? { accountNo } : undefined,'
);

fs.writeFileSync('backend/src/payments/payments.service.ts', code);
