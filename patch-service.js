const fs = require('fs');
let code = fs.readFileSync('backend/src/payments/payments.service.ts', 'utf8');

code = code.replace(
  'async createDeposit(userId: string, amount: number, providerName: PaymentProvider, transactionId?: string, autoApprove?: boolean) {',
  'async createDeposit(userId: string, amount: number, providerName: PaymentProvider, transactionId?: string, autoApprove?: boolean, accountNo?: string) {'
);

code = code.replace(
  'transaction_reference: reference,\n        status: status,\n      },\n    });',
  'transaction_reference: reference,\n        status: status,\n        metadata: accountNo ? { accountNo } : undefined,\n      },\n    });'
);

fs.writeFileSync('backend/src/payments/payments.service.ts', code);
