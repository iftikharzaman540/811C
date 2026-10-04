const fs = require('fs');
let code = fs.readFileSync('backend/src/payments/payments.service.ts', 'utf8');

code = code.replace(
  /const providerResponse = await this\.xpressPay\.initiateDeposit\(amount, reference, metadata\);/g,
  `let providerResponse;
    try {
      providerResponse = await this.xpressPay.initiateDeposit(amount, reference, metadata);
    } catch (error: any) {
      await this.prisma.payment.update({ where: { id: payment.id }, data: { status: 'REJECTED' } });
      await this.prisma.deposit.updateMany({ where: { transaction_ref: reference }, data: { status: 'REJECTED' } });
      throw new BadRequestException(error.message || 'Payment gateway rejected the request');
    }`
);

// We need to import BadRequestException if it's not imported.
if (!code.includes('BadRequestException')) {
    code = code.replace(/import \{ (.*) \} from '@nestjs\/common';/, "import { $1, BadRequestException } from '@nestjs/common';");
}

fs.writeFileSync('backend/src/payments/payments.service.ts', code);
console.log("Patched error handling in createAutoDeposit");
