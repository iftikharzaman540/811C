const fs = require('fs');

// Patch backend controller
let ctrlCode = fs.readFileSync('backend/src/admin-financials/admin-financials.controller.ts', 'utf8');
const ctrlTarget = `  @Patch('withdrawals/:id/:action')
  @ApiOperation({ summary: 'Approve, reject, or complete a withdrawal' })
  @ApiParam({ name: 'action', enum: ['approve', 'reject', 'complete'] })
  async processWithdrawal(
    @CurrentUser() admin: any,
    @Param('id') id: string,
    @Param('action') action: 'approve' | 'reject' | 'complete'
  ) {
    return this.service.processWithdrawal(admin.userId, id, action);
  }`;
const ctrlReplacement = `  @Patch('withdrawals/:id/:action')
  @ApiOperation({ summary: 'Approve, reject, or complete a withdrawal' })
  @ApiParam({ name: 'action', enum: ['approve', 'reject', 'complete'] })
  async processWithdrawal(
    @CurrentUser() admin: any,
    @Param('id') id: string,
    @Param('action') action: 'approve' | 'reject' | 'complete',
    @Body() body?: { reason?: string }
  ) {
    return this.service.processWithdrawal(admin.userId, id, action, body?.reason);
  }`;
ctrlCode = ctrlCode.replace(ctrlTarget, ctrlReplacement);
fs.writeFileSync('backend/src/admin-financials/admin-financials.controller.ts', ctrlCode);

// Patch backend service
let srvCode = fs.readFileSync('backend/src/admin-financials/admin-financials.service.ts', 'utf8');
const srvTarget = `async processWithdrawal(adminId: string, withdrawalId: string, action: 'approve' | 'reject' | 'complete') {`;
const srvReplacement = `async processWithdrawal(adminId: string, withdrawalId: string, action: 'approve' | 'reject' | 'complete', reason?: string) {`;
srvCode = srvCode.replace(srvTarget, srvReplacement);

// Inside processWithdrawal, we need to add the Notification creation.
// Currently it does:
// if (action === 'approve') { ... } else if (action === 'reject') { ... }
// Let's add notification creation before returning.

const actionTarget = `    await this.auditLogs.log(
      adminId,
      'UPDATE',
      'Withdrawal',
      withdrawal.id,
      { oldStatus: withdrawal.status },
      { newStatus }
    );

    return updated;
  }`;

const actionReplacement = `    await this.auditLogs.log(
      adminId,
      'UPDATE',
      'Withdrawal',
      withdrawal.id,
      { oldStatus: withdrawal.status },
      { newStatus }
    );

    // Create Notification
    let title = '';
    let message = '';
    if (action === 'approve') {
      title = 'Withdrawal Approved';
      message = \`Your withdrawal of PKR \${Number(withdrawal.amount)} has been approved and is being processed.\`;
    } else if (action === 'reject') {
      title = 'Withdrawal Rejected';
      message = \`Your withdrawal of PKR \${Number(withdrawal.amount)} has been rejected.\${reason ? '\\nReason: ' + reason : ''}\\nThe amount has been refunded to your wallet.\`;
    } else if (action === 'complete') {
      title = 'Withdrawal Completed';
      message = \`Your withdrawal of PKR \${Number(withdrawal.amount)} has been successfully transferred to your account.\`;
    }

    if (title && message) {
      await this.prisma.notification.create({
        data: {
          user_id: withdrawal.user_id,
          title,
          message,
          type: 'SYSTEM',
        }
      });
    }

    return updated;
  }`;
srvCode = srvCode.replace(actionTarget, actionReplacement);
fs.writeFileSync('backend/src/admin-financials/admin-financials.service.ts', srvCode);

