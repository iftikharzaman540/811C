
import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminNotificationsService {
  constructor(private prisma: PrismaService) {}

  async sendToAll(title: string, message: string, type: string) {
    // 1. Get all active users
    const users = await this.prisma.user.findMany({
      where: { status: 'ACTIVE' },
      select: { id: true }
    });

    if (users.length === 0) {
      throw new BadRequestException('No active users found');
    }

    // 2. Prepare notifications for bulk insert
    const notifications = users.map(user => ({
      user_id: user.id,
      title,
      message,
      type
    }));

    // 3. Bulk insert
    await this.prisma.notification.createMany({
      data: notifications
    });

    // 4. Save to broadcast history
    const broadcast = await this.prisma.adminBroadcast.create({
      data: {
        title,
        message,
        type,
        sent_to: users.length,
        target: 'ALL'
      }
    });

    return { success: true, broadcast, message: `Sent to ${users.length} users` };
  }

  async sendToSingle(userId: string, title: string, message: string, type: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new BadRequestException('User not found');

    await this.prisma.notification.create({
      data: {
        user_id: userId,
        title,
        message,
        type
      }
    });

    const broadcast = await this.prisma.adminBroadcast.create({
      data: {
        title,
        message,
        type,
        sent_to: 1,
        target: userId
      }
    });

    return { success: true, broadcast, message: 'Sent to 1 user' };
  }

  async getBroadcastHistory(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.adminBroadcast.findMany({
        skip,
        take: limit,
        orderBy: { created_at: 'desc' }
      }),
      this.prisma.adminBroadcast.count()
    ]);

    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }
}
