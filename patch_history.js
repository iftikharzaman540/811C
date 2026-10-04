const fs = require('fs');
const file = 'src/app/admin/finances/wallet-adjustments/page.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  "const isCredit = log.action === 'MANUAL_WALLET_CREDIT';",
  "const oldBalance = log.old_value?.balance;\n                  const isCredit = log.action === 'MANUAL_WALLET_CREDIT' || log.new_value?.balance > oldBalance;"
);

code = code.replace(
  "const diff = Math.abs(newBalance - log.old_value?.balance);",
  "const diff = Math.abs(newBalance - oldBalance);"
);

fs.writeFileSync(file, code);
console.log("Patched page.tsx successfully");
