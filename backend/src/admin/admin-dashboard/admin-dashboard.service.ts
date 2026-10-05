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
      this.prisma.payment.aggregate({ _sum: { amount: true }, where: { type: 'DEPOSIT', status: 'COMPLETED' } }),
      this.prisma.payment.aggregate({ _sum: { amount: true }, where: { type: 'WITHDRAWAL', status: 'COMPLETED' } }),
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

  async getReports(startDate?: string, endDate?: string) {
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Default 30 days
    const end = endDate ? new Date(endDate) : new Date();

    const [users, deposits, withdrawals, games] = await Promise.all([
      this.prisma.user.findMany({
        where: { role: 'USER', created_at: { gte: start, lte: end } },
        select: { created_at: true }
      }),
      this.prisma.deposit.findMany({
        where: { status: 'COMPLETED', created_at: { gte: start, lte: end } },
        select: { created_at: true, amount: true }
      }),
      this.prisma.withdrawal.findMany({
        where: { status: 'COMPLETED', created_at: { gte: start, lte: end } },
        select: { created_at: true, amount: true }
      }),
      this.prisma.gameHistory.findMany({
        where: { created_at: { gte: start, lte: end } },
        select: { created_at: true, bet_amount: true, win_amount: true }
      })
    ]);

    // Group by day
    const days: Record<string, any> = {};

    // Initialize all days in range to 0
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      days[dateStr] = {
        date: dateStr,
        new_users: 0,
        deposits: 0,
        withdrawals: 0,
        bets: 0,
        wins: 0,
        ggr: 0
      };
    }

    users.forEach(u => {
      const d = u.created_at.toISOString().split('T')[0];
      if (days[d]) days[d].new_users += 1;
    });

    deposits.forEach(dep => {
      const d = dep.created_at.toISOString().split('T')[0];
      if (days[d]) days[d].deposits += Number(dep.amount);
    });

    withdrawals.forEach(w => {
      const d = w.created_at.toISOString().split('T')[0];
      if (days[d]) days[d].withdrawals += Number(w.amount);
    });

    games.forEach(g => {
      const d = g.created_at.toISOString().split('T')[0];
      if (days[d]) {
        days[d].bets += Number(g.bet_amount);
        days[d].wins += Number(g.win_amount);
        days[d].ggr += (Number(g.bet_amount) - Number(g.win_amount));
      }
    });

    return Object.values(days).sort((a: any, b: any) => a.date.localeCompare(b.date));
  }
}
