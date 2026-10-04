const fs = require('fs');
let code = fs.readFileSync('src/components/DepositScreen.tsx', 'utf8');

// Remove Trx ID validation
code = code.replace(
  /if \(trxId\.length < 5\) \{\s+toast\.error\("Please enter a valid Payment Code \/ Trx ID"\);\s+return;\s+\}/,
  ''
);

// Remove Trx ID UI section
code = code.replace(
  /\{\s*tab === "online" && \(\s*<div className="mb-6">\s*<h2 className="text-sm font-bold mb-3 text-\[\#ffdf00\]">Payment Code \(Trx ID\)<\/h2>[\s\S]*?<\/div>\s*\)\s*\}/,
  ''
);

// Change transactionId to EXEMPT so backend still accepts it if required
code = code.replace(
  /transactionId: trxId/g,
  'transactionId: "TRX_EXEMPT"'
);

fs.writeFileSync('src/components/DepositScreen.tsx', code);
console.log("Patched DepositScreen.tsx successfully");
