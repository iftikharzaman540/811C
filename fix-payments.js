const fs = require('fs');
let paymentsService = fs.readFileSync('/var/www/gaming-app/backend/src/payments/payments.service.ts', 'utf8');

paymentsService = paymentsService.replace(/await this\.vipService\.processDepositForVip\([\s\S]*?\);/g, '// VIP upgrade now handled by turnover in wallet.service.ts');

fs.writeFileSync('/var/www/gaming-app/backend/src/payments/payments.service.ts', paymentsService);
console.log('Removed processDepositForVip from payments.service.ts');
