const fs = require('fs');

const code = `import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditLogsService } from '../audit-logs/audit-logs.service';

@Injectable()
export class AdminUsersService {
  constructor(
    private prisma: PrismaService,
    private auditLogs: AuditLogsService
  ) {}

  async getUsers(page = 1, limit = 20, search?: string, status?: any) {
    const skip = (page - 1) * limit;
    const where: any = {};
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { username: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true, player_id: true, username: true, email: true, phone: true,
          role: true, status: true, created_at: true,
          wallet: { select: { balance: true, currency: true } }
        },
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async getUserDetails(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true, player_id: true, username: true, email: true, phone: true,
        role: true, status: true, created_at: true, country: true, avatar: true,
        total_deposited: true,
        wallet: true,
        game_history: { take: 10, orderBy: { created_at: 'desc' } },
      },
    });
    if (!user) throw new NotFoundException('User not found');
    
    // Also get wallet transactions
    let walletTransactions = [];
    if (user.wallet) {
      walletTransactions = await this.prisma.walletTransaction.findMany({
        where: { wallet_id: user.wallet.id },
        take: 10,
        orderBy: { created_at: 'desc' }
      });
    }

    // Get all deposits and withdrawals for the history tables
    const allPayments = await this.prisma.payment.findMany({
      where: { user_id: id },
      orderBy: { created_at: 'desc' }
    });

    const deposits = allPayments.filter(p => p.type === 'DEPOSIT');
    const withdrawals = allPayments.filter(p => p.type === 'WITHDRAWAL');

    // Calculate total withdrawn
    const totalWithdrawn = withdrawals
      .filter(p => p.status === 'COMPLETED')
      .reduce((sum, p) => sum + Number(p.amount), 0);

    return { 
      ...user, 
      recent_transactions: walletTransactions,
      deposits,
      withdrawals,
      total_withdrawn: totalWithdrawn
    };
  }

  async updateStatus(adminId: string, userId: string, status: any) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: { status },
      select: { id: true, status: true, email: true, username: true }
    });

    await this.auditLogs.logAction({
      admin_id: adminId,
      user_id: userId,
      action: 'UPDATE_USER_STATUS',
      entity: 'USER',
      entity_id: userId,
      old_value: { status: user.status },
      new_value: { status: updated.status },
    });

    return updated;
  }
}
`;

fs.writeFileSync('backend/src/admin-users/admin-users.service.ts', code);
// also save it in the other admin folder just in case
if(fs.existsSync('backend/src/admin/admin-users')) {
  fs.writeFileSync('backend/src/admin/admin-users/admin-users.service.ts', code);
}
console.log("Updated admin-users.service.ts locally");
