const fs = require('fs');

const cPath = '/var/www/gaming-app/backend/src/payments/payments.controller.ts';
let cCode = fs.readFileSync(cPath, 'utf8');
// Fix the malformed code
cCode = cCode.replace(/return this\.service\.getUserRecords\(user\.userId\s*@Get\('deposit-history'\)[\s\S]*?\);\s*}\s*}/g, 'return this.service.getUserRecords(user.userId);\n  }\n}');
// Inject safely before the last }
const cInsertIdx = cCode.lastIndexOf('}');
const newControllerFn = `
  @Get('deposit-history')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get deposit history with date range filters' })
  async getDepositHistory(@CurrentUser() user: any, @Query('range') range: string = '1d') {
    return this.service.getDepositHistory(user.userId, range);
  }
`;
cCode = cCode.substring(0, cInsertIdx) + newControllerFn + cCode.substring(cInsertIdx);
fs.writeFileSync(cPath, cCode);

const sPath = '/var/www/gaming-app/backend/src/payments/payments.service.ts';
let sCode = fs.readFileSync(sPath, 'utf8');
// Fix the TypeScript TS2367 error with 'SUCCESS'
sCode = sCode.replace("|| d.status === 'SUCCESS'", "");
fs.writeFileSync(sPath, sCode);

console.log("Fixed files!");
