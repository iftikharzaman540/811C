const fs = require('fs');
let code = fs.readFileSync('backend/src/payments/payments.service.ts', 'utf8');

// Add notification for autoApprove createDeposit
code = code.replace(
  /await this\.vipService\.processDepositForVip\(userId, amount, reference\);\s*\}/,
  `await this.vipService.processDepositForVip(userId, amount, reference);
      // Auto-Deposit Notification
      await this.prisma.notification.create({
        data: {
          user_id: userId,
          title: 'Deposit Approved',
          message: \`Your deposit of RS \${amount} has been successfully processed.\`,
          type: 'Deposit'
        }
      });
    }`
);

// Add notification for handleWebhook SUCCESS
code = code.replace(
  /await this\.vipService\.processDepositForVip\(payment\.user_id, payment\.amount\.toNumber\(\), reference\);\s*return 'SUCCESS';/,
  `await this.vipService.processDepositForVip(payment.user_id, payment.amount.toNumber(), reference);
      // Webhook Deposit Success Notification
      await this.prisma.notification.create({
        data: {
          user_id: payment.user_id,
          title: 'Deposit Approved',
          message: \`Your deposit of RS \${payment.amount.toNumber()} has been successfully processed.\`,
          type: 'Deposit'
        }
      });
      return 'SUCCESS';`
);

// Add notification for handleWebhook FAILED
code = code.replace(
  /data: \{ status: 'REJECTED' \}\s*\}\);\s*return 'SUCCESS';/,
  `data: { status: 'REJECTED' }
      });
      // Webhook Deposit Rejected Notification
      await this.prisma.notification.create({
        data: {
          user_id: payment.user_id,
          title: 'Deposit Rejected',
          message: \`Your deposit of RS \${payment.amount.toNumber()} has failed or was rejected.\`,
          type: 'Deposit'
        }
      });
      return 'SUCCESS';`
);

fs.writeFileSync('backend/src/payments/payments.service.ts', code);
console.log("Added Deposit notifications!");
