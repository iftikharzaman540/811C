const fs = require('fs');
let code = fs.readFileSync('backend/src/wallet/wallet.service.ts', 'utf8');

// Replace the updateWageringCompleted method
const oldWag = /async updateWageringCompleted\([\s\S]*?\n  \}/m;
const newWag = `async updateWageringCompleted(userId: string, betAmount: number) {
    if (betAmount <= 0) return;
    const user = await this.prisma.user.findUnique({ where: { id: userId }, select: { current_wagering_completed: true, current_wagering_requirement: true } });
    if (!user) return;
    
    const currentReq = Number(user.current_wagering_requirement || 0);
    const currentComp = Number(user.current_wagering_completed || 0);
    
    if (currentComp < currentReq) {
      const newComp = Math.min(currentComp + betAmount, currentReq);
      await this.prisma.user.update({
        where: { id: userId },
        data: { current_wagering_completed: newComp }
      });
    }
  }`;

code = code.replace(oldWag, newWag);

// Update processTransaction to handle BONUS as well
code = code.replace(
  "if (data.type === 'DEPOSIT' && data.amount > 0) {",
  "if ((data.type === 'DEPOSIT' || data.type === 'BONUS') && data.amount > 0) {"
);

fs.writeFileSync('backend/src/wallet/wallet.service.ts', code);
console.log("Patched wallet.service.ts");
