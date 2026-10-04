const fs = require('fs');

const servicePath = '/var/www/gaming-app/backend/src/payments/payments.service.ts';
let serviceCode = fs.readFileSync(servicePath, 'utf8');

if (!serviceCode.includes('getWithdrawalHistory')) {
    const insertIdx = serviceCode.lastIndexOf('}');
    const fn = `
  async getWithdrawalHistory(userId: string, range: string) {
    const now = new Date();
    let startDate = new Date();
    if (range === '1d') {
      startDate.setHours(0, 0, 0, 0);
    } else if (range === '7d') {
      startDate.setDate(startDate.getDate() - 7);
      startDate.setHours(0, 0, 0, 0);
    } else if (range === '30d') {
      startDate.setDate(startDate.getDate() - 30);
      startDate.setHours(0, 0, 0, 0);
    } else {
      startDate.setHours(0, 0, 0, 0); // default 1d
    }

    const withdrawals = await this.prisma.withdrawal.findMany({
      where: { 
        user_id: userId,
        created_at: { gte: startDate }
      },
      orderBy: { created_at: 'desc' }
    });

    const total = withdrawals
      .filter(w => w.status === 'COMPLETED' || w.status === 'APPROVED')
      .reduce((sum, w) => sum + Number(w.amount), 0);

    return {
      range_start: startDate.toISOString(),
      range_end: now.toISOString(),
      total,
      records: withdrawals
    };
  }
`;
    serviceCode = serviceCode.substring(0, insertIdx) + fn + serviceCode.substring(insertIdx);
    fs.writeFileSync(servicePath, serviceCode);
    console.log("Patched service");
}

const controllerPath = '/var/www/gaming-app/backend/src/payments/payments.controller.ts';
let controllerCode = fs.readFileSync(controllerPath, 'utf8');

if (!controllerCode.includes('getWithdrawalHistory')) {
    const insertIdx = controllerCode.lastIndexOf('}');
    const fn = `
  @Get('withdrawal-history')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get withdrawal history with date range filters' })
  async getWithdrawalHistory(@CurrentUser() user: any, @Query('range') range: string = '1d') {
    return this.service.getWithdrawalHistory(user.userId, range);
  }
`;
    controllerCode = controllerCode.substring(0, insertIdx) + fn + controllerCode.substring(insertIdx);
    fs.writeFileSync(controllerPath, controllerCode);
    console.log("Patched controller");
}
