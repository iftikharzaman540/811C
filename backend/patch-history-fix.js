const fs = require('fs');
let code = fs.readFileSync('src/payments/payments.service.ts', 'utf8');

code = code.replace(/r\.status === 'COMPLETED' \|\| r\.status === 'APPROVED' \|\| r\.status === 'SUCCESS'/g, "r.status === 'COMPLETED'");

fs.writeFileSync('src/payments/payments.service.ts', code);
console.log("Fixed status check!");
