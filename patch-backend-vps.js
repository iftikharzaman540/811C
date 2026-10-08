const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  conn.exec(`node -e "
const fs = require('fs');
const servicePath = '/var/www/gaming-app/backend/src/admin/admin-finances/admin-finances.service.ts';
let serviceContent = fs.readFileSync(servicePath, 'utf8');

const newServiceMethods = \`
  async approveDeposit(id: string) {
    const payment = await this.prisma.payment.findUnique({ where: { id } });
    if (!payment || payment.type !== 'DEPOSIT') throw new Error('Deposit not found');
    if (payment.status !== 'PENDING') throw new Error('Deposit is not pending');

    const wallet = await this.prisma.wallet.findUnique({ where: { user_id: payment.user_id } });
    if (!wallet) throw new Error('Wallet not found');

    // Add funds to wallet
    await this.walletService.processTransaction({
      walletId: wallet.id,
      amount: payment.amount.toNumber(),
      type: 'DEPOSIT',
      description: 'Manual Deposit Approved',
      referenceId: payment.id,
    });

    await this.prisma.payment.update({
      where: { id },
      data: { status: 'COMPLETED' }
    });

    // Notify User
    await this.prisma.notification.create({
      data: {
        user_id: payment.user_id,
        title: 'Deposit Approved',
        message: \\\`Your deposit of RS \\\${payment.amount.toNumber()} has been approved and added to your wallet.\\\`,
        type: 'Deposit'
      }
    });

    return { success: true, message: 'Deposit approved' };
  }

  async rejectDeposit(id: string) {
    const payment = await this.prisma.payment.findUnique({ where: { id } });
    if (!payment || payment.type !== 'DEPOSIT') throw new Error('Deposit not found');
    if (payment.status !== 'PENDING') throw new Error('Deposit is not pending');

    await this.prisma.payment.update({
      where: { id },
      data: { status: 'REJECTED' }
    });

    // Notify User
    await this.prisma.notification.create({
      data: {
        user_id: payment.user_id,
        title: 'Deposit Rejected',
        message: \\\`Your deposit of RS \\\${payment.amount.toNumber()} was rejected. If you think this is a mistake, please contact support.\\\`,
        type: 'Deposit'
      }
    });

    return { success: true, message: 'Deposit rejected' };
  }
\`;

if(!serviceContent.includes('approveDeposit(id: string)')) {
  serviceContent = serviceContent.replace('async approveWithdrawal(id: string) {', newServiceMethods + '\\n  async approveWithdrawal(id: string) {');
  fs.writeFileSync(servicePath, serviceContent);
}

const controllerPath = '/var/www/gaming-app/backend/src/admin/admin-finances/admin-finances.controller.ts';
let controllerContent = fs.readFileSync(controllerPath, 'utf8');

const newControllerMethods = \`
  @Patch('deposits/:id/approve')
  approveDeposit(@Param('id') id: string) {
    return this.adminFinancesService.approveDeposit(id);
  }

  @Patch('deposits/:id/reject')
  rejectDeposit(@Param('id') id: string) {
    return this.adminFinancesService.rejectDeposit(id);
  }
\`;

if(!controllerContent.includes('approveDeposit(@Param')) {
  controllerContent = controllerContent.replace(\"@Post('withdrawals/:id/approve')\", newControllerMethods + \"\\n  @Post('withdrawals/:id/approve')\");
  fs.writeFileSync(controllerPath, controllerContent);
}

console.log('Backend patched!');
"`, (err, stream) => {
    stream.on('data', d => process.stdout.write(d.toString()));
    stream.stderr.on('data', d => process.stderr.write(d.toString()));
    stream.on('close', () => conn.end());
  });
}).connect({host:'169.58.50.184',port:22,username:'root',password:'Iftkharzaman'});
