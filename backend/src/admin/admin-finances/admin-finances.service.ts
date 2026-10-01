import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { WalletService } from '../../wallet/wallet.service';
import { TransactionType } from '@prisma/client';

@Injectable()
export class AdminFinancesService {
  constructor(private prisma: PrismaService, private walletService: WalletService) {}

  async adjustWallet(userId: string, adminId: string, amount: number, type: 'CREDIT' | 'DEBIT', reason: string) {
    if (amount <= 0) throw new BadRequestException('Amount must be greater than zero');

    return this.prisma.$transaction(async (tx) => {
      const wallet = await tx.wallet.findUnique({ where: { user_id: userId } });
      if (!wallet) throw new NotFoundException('Wallet not found for this user');

      const balanceBefore = Number(wallet.balance);
      let balanceAfter = balanceBefore;

      if (type === 'CREDIT') {
        balanceAfter += amount;
      } else if (type === 'DEBIT') {
        if (balanceBefore < amount) throw new BadRequestException('Insufficient balance for debit');
        balanceAfter -= amount;
      }

      // Update wallet
      const updatedWallet = await tx.wallet.update({
        where: { id: wallet.id },
        data: { balance: balanceAfter }
      });

      // Create WalletTransaction
      const transaction = await tx.walletTransaction.create({
        data: {
          wallet_id: wallet.id,
          type: TransactionType.ADJUSTMENT,
          amount: amount,
          balance_before: balanceBefore,
          balance_after: balanceAfter,
          description: `Manual \${type} by Admin: \${reason}`,
        }
      });

      // Create AuditLog
      await tx.auditLog.create({
        data: {
          admin_id: adminId,
          user_id: userId,
          action: `MANUAL_WALLET_\${type}`,
          entity: 'Wallet',
          entity_id: wallet.id,
          old_value: { balance: balanceBefore },
          new_value: { balance: balanceAfter, reason },
        }
      });

      return updatedWallet;
    });
  }

  async getAdjustmentsHistory(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    
    // We can infer manual adjustments by querying audit logs
    const where = { action: { startsWith: 'MANUAL_WALLET_' } };
    
    const [logs, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
        include: {
          admin: { select: { email: true, username: true } },
          user: { select: { email: true, username: true, id: true } }
        }
      }),
      this.prisma.auditLog.count({ where })
    ]);

    return {
      data: logs,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async getDeposits(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.payment.findMany({ where: { type: 'DEPOSIT' }, 
        skip, 
        take: limit, 
        orderBy: { created_at: 'desc' }, 
        include: { user: { select: { username: true, email: true } } } 
      }),
      this.prisma.payment.count({ where: { type: 'DEPOSIT' } })
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async getWithdrawals(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.payment.findMany({ where: { type: 'WITHDRAWAL' }, 
        skip, 
        take: limit, 
        orderBy: { created_at: 'desc' }, 
        include: { user: { select: { username: true, email: true, wallet: true } } } 
      }),
      this.prisma.payment.count({ where: { type: 'WITHDRAWAL' } })
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async getPaymentMethods() {
    const defaultMethods = [
      { id: 'easypaisa', name: 'EasyPaisa', enabled: true, min_deposit: 100, max_deposit: 50000, fee_percentage: 0 },
      { id: 'jazzcash', name: 'JazzCash', enabled: true, min_deposit: 100, max_deposit: 50000, fee_percentage: 0 },
      { id: 'bank_transfer', name: 'Bank Transfer', enabled: true, min_deposit: 500, max_deposit: 1000000, fee_percentage: 0 }
    ];

    const setting = await this.prisma.systemSetting.findUnique({
      where: { key: 'payment_methods_config' }
    });

    if (setting) {
      return JSON.parse(setting.value);
    }
    return defaultMethods;
  }

  async updatePaymentMethod(id: string, updates: any) {
    const methods = await this.getPaymentMethods();
    const updatedMethods = methods.map((m: any) => m.id === id ? { ...m, ...updates } : m);
    
    await this.prisma.systemSetting.upsert({
      where: { key: 'payment_methods_config' },
      update: { value: JSON.stringify(updatedMethods) },
      create: { key: 'payment_methods_config', value: JSON.stringify(updatedMethods), description: 'Configuration for payment methods' }
    });

    return { success: true, methods: updatedMethods };
  }
}
