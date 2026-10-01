import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminDashboardService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const [
      totalUsers,
      totalDepositsAgg,
      totalWithdrawalsAgg,
      pendingWithdrawals,
      pendingKyc
    ] = await Promise.all([
      this.prisma.user.count({ where: { role: 'USER' } }),
      this.prisma.deposit.aggregate({
        _sum: { amount: true },
        where: { status: 'COMPLETED' }
      }),
      this.prisma.withdrawal.aggregate({
        _sum: { amount: true },
        where: { status: 'COMPLETED' }
      }),
      this.prisma.withdrawal.count({ where: { status: 'PENDING' } }),
      this.prisma.kycDocument.count({ where: { status: 'PENDING' } })
    ]);

    const deposits = Number(totalDepositsAgg._sum.amount || 0);
    const withdrawals = Number(totalWithdrawalsAgg._sum.amount || 0);

    return {
      totalUsers,
      activeUsers: totalUsers, // we can refine this later with last_login
      totalDeposits: deposits,
      totalWithdrawals: withdrawals,
      pendingWithdrawals,
      pendingKyc,
      netRevenue: deposits - withdrawals,
      totalBonuses: 0, // refine this later when UserBonus table is populated
    };
  }
}
