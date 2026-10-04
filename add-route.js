const fs = require('fs');
let code = fs.readFileSync('backend/src/payments/payments.controller.ts', 'utf8');

const newRoute = `
  @Get('methods')
  @ApiOperation({ summary: 'Get available payment methods' })
  async getMethods() {
    return this.service.getPaymentMethods();
  }
`;

code = code.replace(/export class PaymentsController \{[\s\S]*?constructor\([^)]*\) \{\}/, match => match + newRoute);

fs.writeFileSync('backend/src/payments/payments.controller.ts', code);
console.log("Added /methods route to PaymentsController");
