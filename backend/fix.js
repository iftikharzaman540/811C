const fs = require('fs');
let c = fs.readFileSync('src/payments/payments.service.ts', 'utf8');

c = c.replace(
  "import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';",
  "import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';\nimport { VipService } from '../vip/vip.service';"
);

c = c.replace(
  "private xpressPay: XpressPayProvider",
  "private xpressPay: XpressPayProvider,\n    private vipService: VipService"
);

c = c.replace(
  "referenceId: payment.id,\n          });\n        }\n      }",
  "referenceId: payment.id,\n          });\n        }\n      }\n      if (autoApprove) await this.vipService.processDepositForVip(userId, amount, reference);"
);

c = c.replace(
  "this.logger.log(Deposit ${reference} COMPLETED successfully!);\n        return 'SUCCESS';",
  "this.logger.log(Deposit ${reference} COMPLETED successfully!);\n        await this.vipService.processDepositForVip(payment.user_id, payment.amount.toNumber(), reference);\n        return 'SUCCESS';"
);

fs.writeFileSync('src/payments/payments.service.ts', c);
console.log('done');
