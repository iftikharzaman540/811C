const fs = require('fs');
let code = fs.readFileSync('src/components/DepositScreen.tsx', 'utf8');

code = code.replace(/const providerStr = method\.split\(\'_\'\)\[0\]\.toUpperCase\(\);/g, `let providerStr = method.split('_')[0].toUpperCase();
      if (providerStr === 'BANK') providerStr = 'BANK_TRANSFER';`);

fs.writeFileSync('src/components/DepositScreen.tsx', code);
console.log("Patched providerStr for BANK_TRANSFER");
