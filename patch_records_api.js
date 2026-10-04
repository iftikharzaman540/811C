const fs = require('fs');
const path = require('path');

const servicePath = '/var/www/gaming-app/backend/src/payments/payments.service.ts';
const controllerPath = '/var/www/gaming-app/backend/src/payments/payments.controller.ts';

// Patch Service
let serviceCode = fs.readFileSync(servicePath, 'utf8');
if (!serviceCode.includes('getUserRecords')) {
    const insertIdx = serviceCode.lastIndexOf('}');
    const fn = `
  async getUserRecords(userId: string) {
    const deposits = await this.prisma.deposit.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' }
    });
    const withdrawals = await this.prisma.withdrawal.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' }
    });
    
    // Combine and sort by date descending
    const allRecords = [
      ...deposits.map(d => ({ ...d, record_type: 'DEPOSIT' })),
      ...withdrawals.map(w => ({ ...w, record_type: 'WITHDRAWAL' }))
    ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return allRecords;
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
if (!controllerCode.includes('getUserRecords')) {
    const insertIdx = controllerCode.lastIndexOf('}');
    const fn = `
  @Get('records')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get user deposits and withdrawals records' })
  async getUserRecords(@CurrentUser() user: any) {
    return this.service.getUserRecords(user.userId);
  }
`;
    controllerCode = controllerCode.substring(0, insertIdx) + fn + controllerCode.substring(insertIdx);
    fs.writeFileSync(controllerPath, controllerCode);
    console.log("Patched controller");
} else {
    console.log("Controller already patched");
}
