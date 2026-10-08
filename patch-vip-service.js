const fs = require('fs');

const vipServiceContent = `import { Injectable, Logger, OnModuleInit, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VipService implements OnModuleInit {
  private readonly logger = new Logger(VipService.name);

  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    await this.seedVipLevels();
  }

  private async seedVipLevels() {
    const defaultLevels = [
      { level: 0, name: 'VIP 0', min_turnover: 0, bonus_amount: 0 },
      { level: 1, name: 'VIP 1', min_turnover: 50000, bonus_amount: 175 },
      { level: 2, name: 'VIP 2', min_turnover: 200000, bonus_amount: 500 },
      { level: 3, name: 'VIP 3', min_turnover: 1000000, bonus_amount: 2500 },
      { level: 4, name: 'VIP 4', min_turnover: 5000000, bonus_amount: 12000 },
      { level: 5, name: 'VIP 5', min_turnover: 20000000, bonus_amount: 50000 },
      { level: 6, name: 'VIP 6', min_turnover: 50000000, bonus_amount: 150000 },
      { level: 7, name: 'VIP 7', min_turnover: 100000000, bonus_amount: 350000 },
      { level: 8, name: 'VIP 8', min_turnover: 300000000, bonus_amount: 1000000 },
      { level: 9, name: 'VIP 9', min_turnover: 800000000, bonus_amount: 3000000 },
      { level: 10, name: 'VIP 10', min_turnover: 2000000000, bonus_amount: 8000000 },
    ];

    for (const lvl of defaultLevels) {
      await this.prisma.vipLevel.upsert({
        where: { level: lvl.level },
        update: {}, // Keep admin changes if any
        create: {
          level: lvl.level,
          name: lvl.name,
          min_deposit: 0,
          min_turnover: lvl.min_turnover,
          bonus_amount: lvl.bonus_amount,
          wagering_multiplier: 1,
          auto_upgrade: true,
          auto_bonus: true
        },
      });
    }
  }

  async checkVipUpgrade(userId: string) {
    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({ where: { id: userId }, include: { vip_level: true } });
      if (!user) return;

      const newTotal = Number(user.total_wagered || 0);
      const levels = await tx.vipLevel.findMany({ orderBy: { min_turnover: 'desc' } });
      
      const previousLevel = user.vip_level ? user.vip_level.level : -1;
      const highestQualified = levels.find(l => newTotal >= Number(l.min_turnover || 0) && l.auto_upgrade);
      
      if (highestQualified && highestQualified.level > previousLevel) {
        await tx.user.update({
          where: { id: user.id },
          data: { vip_level_id: highestQualified.id }
        });

        await tx.vipHistory.create({
          data: {
            user_id: user.id,
            previous_level: previousLevel === -1 ? 0 : previousLevel,
            new_level: highestQualified.level,
            transaction_id: 'AUTO_TURNOVER',
            deposit_amount: 0,
            total_deposit_after: newTotal
          }
        });
      }
    });
  }

  async claimBonus(userId: string, level: number) {
    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({ where: { id: userId }, include: { vip_level: true } });
      const targetLevel = await tx.vipLevel.findUnique({ where: { level } });

      if (!user) throw new BadRequestException('User not found');
      if (!targetLevel) throw new BadRequestException('VIP level not found');
      if (!user.vip_level || user.vip_level.level < level) throw new BadRequestException('You have not reached this VIP level yet');

      const existingClaim = await tx.vipBonusClaim.findFirst({
         where: { user_id: userId, level }
      });
      if (existingClaim) throw new BadRequestException('Bonus already claimed for this level');

      const bonusAmount = Number(targetLevel.bonus_amount || 0);
      
      await tx.vipBonusClaim.create({
         data: { user_id: userId, level, amount: bonusAmount }
      });

      if (bonusAmount > 0) {
         const multiplier = Number(targetLevel.wagering_multiplier || 1);
         const wageringReq = bonusAmount * multiplier;
         
         const wallet = await tx.wallet.findUnique({ where: { user_id: userId } });
         if (!wallet) throw new BadRequestException('Wallet not found');

         await tx.wallet.update({
            where: { id: wallet.id },
            data: { bonus_balance: { increment: bonusAmount } }
         });
         await tx.user.update({
            where: { id: userId },
            data: { 
                current_wagering_requirement: { increment: wageringReq }, 
                current_wagering_completed: 0 
            }
         });
      }
      return { success: true, message: 'VIP bonus claimed successfully', bonusAmount };
    });
  }

  async getVipLevels() {
    return this.prisma.vipLevel.findMany({ orderBy: { level: 'asc' } });
  }

  async getVipHistory(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.vipHistory.findMany({
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
        include: { user: { select: { username: true, player_id: true, email: true } } }
      }),
      this.prisma.vipHistory.count()
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }
}
`;

fs.writeFileSync('/var/www/gaming-app/backend/src/vip/vip.service.ts', vipServiceContent);
console.log('Wrote vip.service.ts');
