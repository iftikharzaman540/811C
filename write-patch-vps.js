const fs = require('fs');

// Patch wallet.service.ts
let walletContent = fs.readFileSync('src/wallet/wallet.service.ts', 'utf8');

const processTxRegex = /async processTransaction\([\s\S]*?return transaction;\s*\}\);\s*\}/m;
const newProcessTx = `async processTransaction(data: { walletId: string; amount: number; type: TransactionType; referenceId?: string; description?: string; }) {
    return this.prisma.$transaction(async (tx) => {
      const wallet = await tx.wallet.findUnique({ where: { id: data.walletId }, include: { user: true } });
      if (!wallet) throw new BadRequestException('Wallet not found');

      const balanceBefore = Number(wallet.balance || 0);
      const bonusBefore = Number(wallet.bonus_balance || 0);
      let newBalance = balanceBefore;
      let newBonusBalance = bonusBefore;

      if (data.amount < 0) {
          const deductAmount = Math.abs(data.amount);
          if (data.type === 'BET') {
              if (newBalance >= deductAmount) {
                  newBalance -= deductAmount;
              } else {
                  const remaining = deductAmount - newBalance;
                  newBalance = 0;
                  if (newBonusBalance >= remaining) {
                      newBonusBalance -= remaining;
                  } else { throw new BadRequestException('Insufficient balance'); }
              }
          } else {
              // Non-bet deductions only from main balance
              if (newBalance >= deductAmount) { newBalance -= deductAmount; } 
              else { throw new BadRequestException('Insufficient main balance'); }
          }
      } else {
          newBalance += data.amount;
      }

      // WAGERING PROGRESS UPDATE
      if (data.type === 'BET' && data.amount < 0) {
          const betAmount = Math.abs(data.amount);
          const user = wallet.user;
          const currentReq = Number(user.current_wagering_requirement || 0);
          const currentComp = Number(user.current_wagering_completed || 0);
          
          if (currentReq > 0) {
              const newComp = currentComp + betAmount;
              if (newComp >= currentReq) {
                  newBalance += newBonusBalance;
                  newBonusBalance = 0;
                  
                  await tx.user.update({
                      where: { id: user.id },
                      data: { total_wagered: { increment: betAmount }, current_wagering_completed: 0, current_wagering_requirement: 0 }
                  });
              } else {
                  await tx.user.update({
                      where: { id: user.id },
                      data: { total_wagered: { increment: betAmount }, current_wagering_completed: newComp }
                  });
              }
          } else {
              await tx.user.update({ where: { id: user.id }, data: { total_wagered: { increment: betAmount } } });
          }
      }

      const transaction = await tx.walletTransaction.create({
        data: {
          wallet_id: wallet.id, type: data.type, amount: new Prisma.Decimal(data.amount),
          balance_before: new Prisma.Decimal(balanceBefore + bonusBefore),
          balance_after: new Prisma.Decimal(newBalance + newBonusBalance),
          reference_id: data.referenceId, description: data.description,
        },
      });

      await tx.wallet.update({
        where: { id: wallet.id },
        data: { balance: new Prisma.Decimal(newBalance), bonus_balance: new Prisma.Decimal(newBonusBalance) },
      });

      return transaction;
    });
  }`;

walletContent = walletContent.replace(processTxRegex, newProcessTx);

const getBalanceRegex = /async getBalance\([\s\S]*?currency: wallet\.currency\s*};\s*\}/m;
const newGetBalance = `async getBalance(userId: string) {
    const wallet = await this.prisma.wallet.findUnique({ where: { user_id: userId } });
    if (!wallet) throw new BadRequestException('Wallet not found');
    return {
      wallet_id: wallet.id,
      balance: Number(wallet.balance || 0) + Number(wallet.bonus_balance || 0),
      bonus_balance: Number(wallet.bonus_balance || 0),
      currency: wallet.currency
    };
  }`;

walletContent = walletContent.replace(getBalanceRegex, newGetBalance);
fs.writeFileSync('src/wallet/wallet.service.ts', walletContent);

// Patch vip.controller.ts
let vipCtrl = fs.readFileSync('src/vip/vip.controller.ts', 'utf8');
if (!vipCtrl.includes('Post(')) {
  vipCtrl = vipCtrl.replace(
    `import { Controller, Get, UseGuards, Request } from '@nestjs/common';`,
    `import { Controller, Get, Post, Body, UseGuards, Request, BadRequestException } from '@nestjs/common';`
  );
  vipCtrl = vipCtrl.replace(
    `export class VipController {`,
    `export class VipController {\n  @Post('claim-bonus')\n  async claimBonus(@Request() req, @Body('level') level: number) {\n    if (!level) throw new BadRequestException('Level is required');\n    const tx = await this.prisma.$transaction(async (tx) => {\n      const user = await tx.user.findUnique({ where: { id: req.user.id }, include: { vip_level: true } });\n      const targetLevel = await tx.vipLevel.findUnique({ where: { level } });\n      if (!user) throw new BadRequestException('User not found');\n      if (!targetLevel) throw new BadRequestException('VIP level not found');\n      if (!user.vip_level || user.vip_level.level < level) throw new BadRequestException('You have not reached this VIP level yet');\n      const existingClaim = await tx.vipBonusClaim.findFirst({ where: { user_id: req.user.id, level } });\n      if (existingClaim) throw new BadRequestException('Bonus already claimed for this level');\n      const bonusAmount = Number(targetLevel.bonus_amount || 0);\n      await tx.vipBonusClaim.create({ data: { user_id: req.user.id, level, amount: bonusAmount } });\n      if (bonusAmount > 0) {\n         const multiplier = Number(targetLevel.wagering_multiplier || 1);\n         const wageringReq = bonusAmount * multiplier;\n         await tx.wallet.update({ where: { user_id: req.user.id }, data: { bonus_balance: { increment: bonusAmount } } });\n         await tx.user.update({ where: { id: req.user.id }, data: { current_wagering_requirement: { increment: wageringReq }, current_wagering_completed: 0 } });\n      }\n      return { success: true, message: 'VIP bonus claimed successfully', bonusAmount };\n    });\n    return tx;\n  }`
  );
  fs.writeFileSync('src/vip/vip.controller.ts', vipCtrl);
}
console.log('Patched backend services.');
