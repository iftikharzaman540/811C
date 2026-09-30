import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TransactionType, Prisma } from '@prisma/client';

@Injectable()
export class WalletService {
  constructor(private readonly prisma: PrismaService) {}

  async createWallet(userId: string) {
    return this.prisma.wallet.create({
      data: {
        user_id: userId,
        balance: 0,
        bonus_balance: 0,
      },
    });
  }

  
  async updateWageringCompleted(userId: string, betAmount: number) {
    if (betAmount <= 0) return;
    
    // We update current_wagering_completed for this user.
    await this.prisma.$executeRaw`
       UPDATE "User" 
       SET current_wagering_completed = LEAST(current_wagering_completed + ${betAmount}, current_wagering_requirement)
       WHERE id = '${userId}'
    `;
  }

  async processTransaction(data: {
    walletId: string;
    amount: number;
    type: TransactionType;
    referenceId?: string;
    description?: string;
  }) {
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

      const balanceBefore = wallet.balance.toNumber();
      const amount = data.amount;
      const balanceAfter = balanceBefore + amount;

      if (balanceAfter < 0) {
        throw new BadRequestException('Insufficient balance');
      }

      const transaction = await tx.walletTransaction.create({
        data: {
          wallet_id: wallet.id,
          type: data.type,
          amount: new Prisma.Decimal(amount),
          balance_before: new Prisma.Decimal(balanceBefore),
          balance_after: new Prisma.Decimal(balanceAfter),
          reference_id: data.referenceId,
          description: data.description,
        },
      });

      await tx.wallet.update({
        where: { id: wallet.id },
        data: { balance: new Prisma.Decimal(balanceAfter) },
      });

      return transaction;
    });
  }

  async getBalance(userId: string) {
    const wallet = await this.prisma.wallet.findUnique({
      where: { user_id: userId },
    });
    if (!wallet) throw new BadRequestException('Wallet not found');
    
    return {
      wallet_id: wallet.id,
      balance: wallet.balance.toNumber(),
      bonus_balance: wallet.bonus_balance.toNumber(),
      currency: wallet.currency
    };
  }

  async getTransactionHistory(userId: string, page = 1, limit = 20) {
    const wallet = await this.prisma.wallet.findUnique({
      where: { user_id: userId },
    });
    if (!wallet) throw new BadRequestException('Wallet not found');

    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      this.prisma.walletTransaction.findMany({
        where: { wallet_id: wallet.id },
        orderBy: { created_at: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.walletTransaction.count({
        where: { wallet_id: wallet.id },
      }),
    ]);

    return {
      data: transactions,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getTransactionByReference(referenceId: string) {
    if (!referenceId) return null;
    return this.prisma.walletTransaction.findUnique({
      where: { reference_id: referenceId },
    });
  }
}
