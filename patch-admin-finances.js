const fs = require('fs');
let code = fs.readFileSync('backend/src/admin/admin-finances/admin-finances.service.ts', 'utf8');

// Insert the create notification logic in approveWithdrawal
code = code.replace(
  /await this\.prisma\.payment\.update\(\{\s*where: \{ id \},\s*data: \{ status: 'COMPLETED' \}\s*\}\);/g,
  `await this.prisma.payment.update({
        where: { id },
        data: { status: 'COMPLETED' }
      });

      // Notify User
      await this.prisma.notification.create({
        data: {
          user_id: payment.user_id,
          title: 'Withdrawal Approved',
          message: \`Your withdrawal of RS \${payment.amount.toNumber()} has been successfully processed.\`,
          type: 'Withdrawal'
        }
      });`
);

// Insert the create notification logic in rejectWithdrawal
code = code.replace(
  /await this\.prisma\.payment\.update\(\{\s*where: \{ id \},\s*data: \{ status: 'REJECTED' \}\s*\}\);/g,
  `await this.prisma.payment.update({
        where: { id },
        data: { status: 'REJECTED' }
      });

      // Notify User
      await this.prisma.notification.create({
        data: {
          user_id: payment.user_id,
          title: 'Withdrawal Rejected',
          message: \`Your withdrawal of RS \${payment.amount.toNumber()} was rejected and the amount has been refunded to your wallet.\`,
          type: 'Withdrawal'
        }
      });`
);

fs.writeFileSync('backend/src/admin/admin-finances/admin-finances.service.ts', code);
console.log("Patched admin-finances.service.ts for automated withdrawal notifications!");
