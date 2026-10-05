const fs = require('fs');
let code = fs.readFileSync('backend/src/payments/payments.controller.ts', 'utf8');

code = code.replace(
  '@Body() body: { amount: number; provider: PaymentProvider; transactionId?: string; autoApprove?: boolean }',
  '@Body() body: { amount: number; provider: PaymentProvider; transactionId?: string; autoApprove?: boolean; accountNo?: string }'
);

code = code.replace(
  'return this.service.createDeposit(user.userId, body.amount, body.provider, body.transactionId, body.autoApprove);',
  'return this.service.createDeposit(user.userId, body.amount, body.provider, body.transactionId, body.autoApprove, body.accountNo);'
);

fs.writeFileSync('backend/src/payments/payments.controller.ts', code);
