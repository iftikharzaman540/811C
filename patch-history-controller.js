const fs = require('fs');
let code = fs.readFileSync('backend/src/payments/payments.controller.ts', 'utf8');

const historyRoutes = `
  @Get('deposit-history')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get deposit history' })
  async getDepositHistory(@CurrentUser() user: any, @Query('range') range: string) {
    return this.service.getDepositHistory(user.userId, range);
  }

  @Get('withdrawal-history')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get withdrawal history' })
  async getWithdrawalHistory(@CurrentUser() user: any, @Query('range') range: string) {
    return this.service.getWithdrawalHistory(user.userId, range);
  }
`;

// Also import Query if not imported
if (!code.includes('Query,')) {
    code = code.replace(/import \{ Controller, Post, Get, Body, Param, UseGuards, Res \}/, 'import { Controller, Post, Get, Body, Param, UseGuards, Res, Query }');
}

code = code.replace(/export class PaymentsController \{[\s\S]*?constructor\([^)]*\) \{\}/, match => match + historyRoutes);

fs.writeFileSync('backend/src/payments/payments.controller.ts', code);
console.log("Added history routes to PaymentsController");
