const fs = require('fs');
let code = fs.readFileSync('backend/src/payments/payments.service.ts', 'utf8');

const newMethod = `
  async getPaymentMethods() {
    const defaultMethods = [
      { id: 'easypaisa', name: 'EasyPaisa', enabled: true, min_deposit: 100, max_deposit: 50000, fee_percentage: 0 },
      { id: 'jazzcash', name: 'JazzCash', enabled: true, min_deposit: 100, max_deposit: 50000, fee_percentage: 0 },
      { id: 'bank_transfer', name: 'Bank Transfer', enabled: true, min_deposit: 500, max_deposit: 1000000, fee_percentage: 0 }
    ];

    const setting = await this.prisma.systemSetting.findUnique({
      where: { key: 'payment_methods_config' }
    });

    if (setting) {
      return JSON.parse(setting.value).filter(m => m.enabled === true);
    }
    return defaultMethods.filter(m => m.enabled === true);
  }
`;

code = code.replace(/export class PaymentsService \{[\s\S]*?constructor\([\s\S]*?\) \{\}/, match => match + newMethod);

fs.writeFileSync('backend/src/payments/payments.service.ts', code);
console.log("Added getPaymentMethods to PaymentsService");
