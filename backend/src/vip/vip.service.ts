import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class VipService implements OnModuleInit {
  private readonly logger = new Logger(VipService.name);

  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    await this.seedVipLevels();
  }

  private async seedVipLevels() {
    const defaultLevels = [
      { level: 1, name: 'VIP 1', min_deposit: 0 },
      { level: 2, name: 'VIP 2', min_deposit: 50000 },
      { level: 3, name: 'VIP 3', min_deposit: 150000 },
      { level: 4, name: 'VIP 4', min_deposit: 500000 },
      { level: 5, name: 'VIP 5', min_deposit: 1000000 },
      { level: 6, name: 'VIP 6', min_deposit: 2500000 },
      { level: 7, name: 'VIP 7', min_deposit: 5000000 },
      { level: 8, name: 'VIP 8', min_deposit: 10000000 },
      { level: 9, name: 'VIP 9', min_deposit: 15000000 },
      { level: 10, name: 'VIP 10', min_deposit: 25000000 },
    ];

    for (const lvl of defaultLevels) {
      await this.prisma.vipLevel.upsert({
        where: { level: lvl.level },
        update: {}, // Don't override if admin has changed it
        create: {
          level: lvl.level,
          name: lvl.name,
          min_deposit: lvl.min_deposit,
        },
      });
    }
  }

  async processDepositForVip(userId: string, amount: number | string, transactionId: string) {
    this.logger.log(Processing VIP for user  + userId +  on transaction  + transactionId);
    
    // We run everything in a transaction to prevent race conditions
    await this.prisma.$transaction(async (tx) => {
      // 1. Idempotency check: has this payment been processed for VIP?
      const payment = await tx.payment.findUnique({ where: { transaction_reference: transactionId } });
      if (!payment || payment.vip_processed || payment.status !== 'COMPLETED') {
        return; // Already processed, or not completed, or not found
      }

      // 2. Fetch user
      const user = await tx.user.findUnique({ where: { id: userId } });
      if (!user) return;

      // 3. Mark payment as processed
      await tx.payment.update({
        where: { id: payment.id },
        data: { vip_processed: true }
      });

      // 4. Update user total deposit
      const depositAmount = new Decimal(amount);
      const newTotal = user.total_deposited.add(depositAmount);
      
      let previousLevel = 1;
      let newLevel = 1;

      // 5. Check VIP thresholds
      const levels = await tx.vipLevel.findMany({ orderBy: { min_deposit: 'desc' } });
      
      const currentLevelData = levels.find(l => l.id === user.vip_level_id);
      previousLevel = currentLevelData ? currentLevelData.level : 1;

      // Find the highest level the user qualifies for
      const highestQualified = levels.find(l => newTotal.greaterThanOrEqualTo(l.min_deposit));
      
      if (highestQualified) {
        newLevel = highestQualified.level;
      }

      // 6. Update user
      await tx.user.update({
        where: { id: user.id },
        data: {
          total_deposited: newTotal,
          vip_level_id: highestQualified ? highestQualified.id : user.vip_level_id,
        }
      });

      // 7. Save history if level changed
      if (previousLevel !== newLevel) {
        this.logger.log(User  + user.id +  upgraded from VIP  + previousLevel +  to VIP  + newLevel);
        await tx.vipHistory.create({
          data: {
            user_id: user.id,
            previous_level: previousLevel,
            new_level: newLevel,
            transaction_id: transactionId,
            deposit_amount: depositAmount,
            total_deposit_after: newTotal
          }
        });
      }
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
