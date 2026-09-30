const fs = require('fs');

let walletService = fs.readFileSync('backend/src/wallet/wallet.service.ts', 'utf8');

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
  /return this\.prisma\.\$transaction\(async \(tx\) => \{\s*const wallet = await tx\.wallet\.findUnique\(\{\s*where: \{ id: data\.walletId \},\s*\}\);\s*if \(\!wallet\) throw new BadRequestException\('Wallet not found'\);/,
  replaceProcessTx.trim()
);

fs.writeFileSync('backend/src/wallet/wallet.service.ts', walletService);
console.log("Wallet service patched correctly this time.");
