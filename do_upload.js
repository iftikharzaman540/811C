const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  conn.sftp((err, sftp) => {
    if (err) throw err;
    const writeStream = sftp.createWriteStream('/var/www/gaming-app/backend/src/admin-users/admin-users.service.ts');
    writeStream.write(`import { Injectable, NotFoundException } from '@nestjs/common';
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

    return { ...user, recent_transactions: walletTransactions };
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
`);
    writeStream.end();
    writeStream.on('close', () => {
      conn.exec('cd /var/www/gaming-app/backend && npm run build && pm2 restart gaming-backend', (err, stream) => {
        stream.on('data', d => process.stdout.write(d.toString()));
        stream.stderr.on('data', d => process.stderr.write(d.toString()));
        stream.on('close', () => conn.end());
      });
    });
  });
}).connect({host:'169.58.50.184',port:22,username:'root',password:'Iftkharzaman'});
