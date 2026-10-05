import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminDashboardService {
  constructor(private prisma: PrismaService) {}

  async getDashboardSummary() {
    const [
      totalUsers,
      activeUsers,
      totalGames,
      totalDeposits,
      totalWithdrawals,
      recentActivities
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { status: 'ACTIVE' } }),
      this.prisma.game.count(),
      this.prisma.deposit.aggregate({
        _sum: { amount: true },
        where: { status: 'COMPLETED' } // Assuming COMPLETED or APPROVED
      }),
      this.prisma.payment.aggregate({ _sum: { amount: true }, where: { type: 'WITHDRAWAL', status: 'COMPLETED' } }),
      this.prisma.auditLog.findMany({
        take: 10,
        orderBy: { created_at: 'desc' },
        include: { admin: { select: { username: true } }, user: { select: { username: true } } }
      })
    ]);

    return {
      total_users: totalUsers,
      active_users: activeUsers,
      total_games: totalGames,
      total_deposits_volume: totalDeposits._sum.amount || 0,
      total_withdrawals_volume: totalWithdrawals._sum.amount || 0,
      recent_activities: recentActivities
    };
  }
}
