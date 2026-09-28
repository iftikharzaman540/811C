const fs = require('fs');
const file = 'backend/src/gregmorn/gregmorn-webhook.controller.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  /\/\/ Check idempotency could be added here, but skipping for brevity\n\s*await this\.walletService\.processTransaction\(\{/g,
  `const existingTx = await this.walletService.getTransactionByReference(transactionId);\n            if (existingTx) {\n              this.logger.warn(\`Duplicate transactionId detected: \${transactionId}\`);\n              return res.status(200).json({\n                balance: currentBalance,\n                currency: balanceData.currency || 'PKR',\n                error: '',\n                login,\n                status: 'success'\n              });\n            }\n\n            await this.walletService.processTransaction({`
);

code = code.replace(
  /if \(netAmount !== 0\) {\n\s*try {\n\s*await this.walletService.processTransaction\(\{/g,
  `if (netAmount !== 0) {\n            const rollbackRef = \`\${transactionId}_rollback\`;\n            const existingRollback = await this.walletService.getTransactionByReference(rollbackRef);\n            if (existingRollback) {\n              this.logger.warn(\`Duplicate rollback detected: \${rollbackRef}\`);\n              return res.status(200).json({ balance: currentBalance, currency: balanceData.currency || 'PKR', error: '', login, status: 'success' });\n            }\n            try {\n              await this.walletService.processTransaction({`
);

fs.writeFileSync(file, code);
console.log('Patched');
