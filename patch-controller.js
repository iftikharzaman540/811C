const fs = require('fs');
let code = fs.readFileSync('backend/src/payments/payments.controller.ts', 'utf8');

const newRoute = `
  @Get('records')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get unified payment records' })
  async getRecords(@CurrentUser() user: any) {
    return this.service.getRecords(user.userId);
  }
`;

// Insert after getWithdrawalHistory
code = code.replace(/(@Get\('withdrawal-history'\)[\s\S]*?}[\r\n]+)/, `$1\n${newRoute}\n`);
fs.writeFileSync('backend/src/payments/payments.controller.ts', code);
