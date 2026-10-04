const fs = require('fs');
const path = require('path');

const servicePath = '/var/www/gaming-app/backend/src/payments/payments.service.ts';
const controllerPath = '/var/www/gaming-app/backend/src/payments/payments.controller.ts';

// Patch Service
let serviceCode = fs.readFileSync(servicePath, 'utf8');
if (!serviceCode.includes('getDepositHistory')) {
    const insertIdx = serviceCode.lastIndexOf('}');
    const fn = `
  async getDepositHistory(userId: string, range: string) {
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

    const deposits = await this.prisma.deposit.findMany({
      where: { 
        user_id: userId,
        created_at: { gte: startDate }
      },
      orderBy: { created_at: 'desc' }
    });

    const total = deposits
      .filter(d => d.status === 'COMPLETED' || d.status === 'APPROVED' || d.status === 'SUCCESS')
      .reduce((sum, d) => sum + Number(d.amount), 0);

    return {
      range_start: startDate.toISOString(),
      range_end: now.toISOString(),
      total,
      records: deposits
    };
  }
`;
    serviceCode = serviceCode.substring(0, insertIdx) + fn + serviceCode.substring(insertIdx);
    fs.writeFileSync(servicePath, serviceCode);
    console.log("Patched service");
} else {
    console.log("Service already patched");
}

// Patch Controller
let controllerCode = fs.readFileSync(controllerPath, 'utf8');
if (!controllerCode.includes('getDepositHistory')) {
    const insertIdx = controllerCode.lastIndexOf('}');
    const fn = `
  @Get('deposit-history')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get deposit history with date range filters' })
  async getDepositHistory(@CurrentUser() user: any, @Query('range') range: string = '1d') {
    return this.service.getDepositHistory(user.userId, range);
  }
`;
    // We also need to ensure Query is imported from @nestjs/common if not already.
    if (!controllerCode.includes('Query,')) {
        controllerCode = controllerCode.replace('Param,', 'Param, Query,');
    }
    
    controllerCode = controllerCode.substring(0, insertIdx) + fn + controllerCode.substring(insertIdx);
    fs.writeFileSync(controllerPath, controllerCode);
    console.log("Patched controller");
} else {
    console.log("Controller already patched");
}
