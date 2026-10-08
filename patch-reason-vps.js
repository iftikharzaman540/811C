const { Client } = require('ssh2');
const fs = require('fs');

const nodeScript = `
const fs = require('fs');
const servicePath = '/var/www/gaming-app/backend/src/admin/admin-finances/admin-finances.service.ts';
let serviceContent = fs.readFileSync(servicePath, 'utf8');

// Replace rejectDeposit
const oldRejectDeposit = "async rejectDeposit(id: string) {";
const newRejectDeposit = "async rejectDeposit(id: string, reason?: string) {";
serviceContent = serviceContent.replace(oldRejectDeposit, newRejectDeposit);

const oldRejectDepositMessage = "message: \\\`Your deposit of RS \\\${payment.amount.toNumber()} was rejected. If you think this is a mistake, please contact support.\\\`,";
const newRejectDepositMessage = "message: \\\`Your deposit of RS \\\${payment.amount.toNumber()} was rejected.\\\${reason ? ' Reason: ' + reason : ' If you think this is a mistake, please contact support.'}\\\`,";
serviceContent = serviceContent.replace(oldRejectDepositMessage, newRejectDepositMessage);


// Replace rejectWithdrawal
const oldRejectWithdrawal = "async rejectWithdrawal(id: string) {";
const newRejectWithdrawal = "async rejectWithdrawal(id: string, reason?: string) {";
serviceContent = serviceContent.replace(oldRejectWithdrawal, newRejectWithdrawal);

const oldRejectWithdrawalMessage = "message: \\\`Your withdrawal of RS \\\${payment.amount.toNumber()} was rejected and the amount has been refunded to your wallet.\\\`,";
const newRejectWithdrawalMessage = "message: \\\`Your withdrawal of RS \\\${payment.amount.toNumber()} was rejected and the amount has been refunded to your wallet.\\\${reason ? ' Reason: ' + reason : ''}\\\`,";
serviceContent = serviceContent.replace(oldRejectWithdrawalMessage, newRejectWithdrawalMessage);

fs.writeFileSync(servicePath, serviceContent);

const controllerPath = '/var/www/gaming-app/backend/src/admin/admin-finances/admin-finances.controller.ts';
let controllerContent = fs.readFileSync(controllerPath, 'utf8');

// Replace rejectDeposit in controller
const oldRejectDepositCtrl = "@Patch('deposits/:id/reject')\\n  rejectDeposit(@Param('id') id: string) {\\n    return this.adminFinancesService.rejectDeposit(id);\\n  }";
const newRejectDepositCtrl = "@Patch('deposits/:id/reject')\\n  rejectDeposit(@Param('id') id: string, @Body('reason') reason?: string) {\\n    return this.adminFinancesService.rejectDeposit(id, reason);\\n  }";
controllerContent = controllerContent.replace(oldRejectDepositCtrl, newRejectDepositCtrl);

// Replace rejectWithdrawal in controller
const oldRejectWithdrawalCtrl = "@Post('withdrawals/:id/reject')\\n  rejectWithdrawal(@Param('id') id: string) {\\n    return this.adminFinancesService.rejectWithdrawal(id);\\n  }";
const newRejectWithdrawalCtrl = "@Post('withdrawals/:id/reject')\\n  rejectWithdrawal(@Param('id') id: string, @Body('reason') reason?: string) {\\n    return this.adminFinancesService.rejectWithdrawal(id, reason);\\n  }";
controllerContent = controllerContent.replace(oldRejectWithdrawalCtrl, newRejectWithdrawalCtrl);

fs.writeFileSync(controllerPath, controllerContent);
console.log('Backend patched for rejection reason!');
`;

const conn = new Client();
conn.on('ready', () => {
  conn.sftp((err, sftp) => {
    if (err) throw err;
    const writeStream = sftp.createWriteStream('/tmp/patch-reason.js');
    writeStream.write(nodeScript);
    writeStream.end(() => {
      conn.exec('node /tmp/patch-reason.js', (err, stream) => {
        if (err) throw err;
        stream.on('data', (d) => process.stdout.write(d.toString()));
        stream.stderr.on('data', (d) => process.stderr.write(d.toString()));
        stream.on('close', () => conn.end());
      });
    });
  });
}).connect({host:'169.58.50.184',port:22,username:'root',password:'Iftkharzaman'});
