const fs = require('fs');
let code = fs.readFileSync('src/components/DepositScreen.tsx', 'utf8');

code = code.replace(
  `const payload = {  amount: Number(amount), provider: method.split('_')[0].toUpperCase(), accountNo, transactionId: "TRX_EXEMPT", autoApprove: true  };`,
  `const payload = {  amount: Number(amount), provider: method.split('_')[0].toUpperCase(), accountNo, autoApprove: true  };`
);

fs.writeFileSync('src/components/DepositScreen.tsx', code);
console.log("Patched DepositScreen.tsx");
