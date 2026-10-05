const fs = require('fs');
let code = fs.readFileSync('backend/src/payments/providers/xpresspay.provider.ts', 'utf8');

const cleanMethod = `
  async checkOrderStatus(merOrderNo: string): Promise<boolean> {
    try {
      const payload: Record<string, any> = { appId: this.appId, merOrderNo };
      payload['sign'] = this.generateSignature(payload);
      const response = await axios.post('https://xpresspay.cloud/api/v2/payment/order/query', payload, {
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        timeout: 10000,
      });
      const data = response.data;
      if (data && (data.code == 0 || data.code == '0') && data.data && String(data.data.orderStatus) === '2') {
        return true;
      }
      return false;
    } catch (e: any) {
      this.logger.error('Failed to query XpressPay status ' + e.message);
      return false;
    }
  }
}
`;

code = code.replace(/}\s*$/, cleanMethod);
fs.writeFileSync('backend/src/payments/providers/xpresspay.provider.ts', code);
