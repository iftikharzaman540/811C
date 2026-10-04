const fs = require('fs');

let walletService = fs.readFileSync('backend/src/wallet/wallet.service.ts', 'utf8');

// 1. Add updateWageringCompleted to walletService
if (!walletService.includes('updateWageringCompleted')) {
  const methodToAdd = `
  async updateWageringCompleted(userId: string, betAmount: number) {
    if (betAmount <= 0) return;
    
    // We update current_wagering_completed for this user.
    await this.prisma.$executeRaw\`
       UPDATE "User" 
       SET current_wagering_completed = LEAST(current_wagering_completed + \${betAmount}, current_wagering_requirement)
       WHERE id = '\${userId}'
    \`;
  }
`;
  walletService = walletService.replace('async processTransaction', methodToAdd + '\n  async processTransaction');
}

// 2. Modify processTransaction to update requirement on DEPOSIT
const searchProcessTx = `
      return this.prisma.$transaction(async (tx) => {
        const wallet = await tx.wallet.findUnique({
`;
const replaceProcessTx = `
      return this.prisma.$transaction(async (tx) => {
        const wallet = await tx.wallet.findUnique({
          where: { id: data.walletId },
          include: { user: true }
        });

        if (!wallet) throw new BadRequestException('Wallet not found');

        // WAGERING REQUIREMENT UPDATE
        if (data.type === 'DEPOSIT' && data.amount > 0) {
           const currentReq = Number(wallet.user.current_wagering_requirement || 0);
           const currentComp = Number(wallet.user.current_wagering_completed || 0);
           
           if (currentComp >= currentReq) {
              // Reset and set to new deposit amount
              await tx.user.update({
                where: { id: wallet.user_id },
                data: {
                  current_wagering_requirement: data.amount,
                  current_wagering_completed: 0
                }
              });
           } else {
              // Add to existing requirement
              await tx.user.update({
                where: { id: wallet.user_id },
                data: {
                  current_wagering_requirement: { increment: data.amount }
                }
              });
           }
        }
`;
walletService = walletService.replace(
  /return this\.prisma\.\$transaction\(async \(tx\) => \{\s*const wallet = await tx\.wallet\.findUnique\(\{/m, 
  replaceProcessTx.trim()
);
// Remove the original redundant findUnique since it's injected
walletService = walletService.replace(/const wallet = await tx\.wallet\.findUnique\(\{\s*where: \{ id: data\.walletId \},\s*\}\);/m, '');

fs.writeFileSync('backend/src/wallet/wallet.service.ts', walletService);


let webhookCtrl = fs.readFileSync('backend/src/gregmorn/gregmorn-webhook.controller.ts', 'utf8');

// 3. Inject updateWageringCompleted into gregmorn-webhook.controller.ts writeBet
const writeBetSearch = `
            // Process transaction (deduct bet, add win)
            const netAmount = winAmount - betAmount;
`;
const writeBetReplace = `
            // Process transaction (deduct bet, add win)
            const netAmount = winAmount - betAmount;
            
            // ALWAYS RECORD QUALIFYING BET AMOUNT
            if (betAmount > 0) {
              try {
                await this.walletService.updateWageringCompleted(userId, betAmount);
              } catch (err) {
                this.logger.error(\`Failed to update wagering completed: \${err.message}\`);
              }
            }
`;
webhookCtrl = webhookCtrl.replace(writeBetSearch, writeBetReplace);

// Also need to handle the case where netAmount === 0, wait, it already continues because of res.status(200).json
const netZeroSearch = `
            if (netAmount !== 0) {
`;
const netZeroReplace = `
            // Ensure we return success even if netAmount is 0
            if (netAmount === 0) {
              return res.status(200).json({
                balance: currentBalance,
                currency: balanceData.currency || 'PKR',
                error: '',
                login,
                status: 'success'
              });
            }

            if (netAmount !== 0) {
`;
if (!webhookCtrl.includes('if (netAmount === 0) {')) {
   webhookCtrl = webhookCtrl.replace(netZeroSearch, netZeroReplace);
}

fs.writeFileSync('backend/src/gregmorn/gregmorn-webhook.controller.ts', webhookCtrl);

console.log("Backend wagering logic patched.");
