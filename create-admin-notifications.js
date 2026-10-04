const fs = require('fs');
const path = require('path');

const serviceCode = `
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

    return { success: true, broadcast, message: \`Sent to \${users.length} users\` };
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
`;

const controllerCode = `
import { Controller, Post, Get, Body, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { AdminNotificationsService } from './admin-notifications.service';

@Controller('api/v1/admin/notifications')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.SUPER_ADMIN, Role.ADMIN)
export class AdminNotificationsController {
  constructor(private svc: AdminNotificationsService) {}

  @Post('send-all')
  sendToAll(@Body() body: { title: string, message: string, type: string }) {
    return this.svc.sendToAll(body.title, body.message, body.type);
  }

  @Post('send-single')
  sendToSingle(@Body() body: { userId: string, title: string, message: string, type: string }) {
    return this.svc.sendToSingle(body.userId, body.title, body.message, body.type);
  }

  @Get('history')
  getHistory(@Query('page') page: string = '1', @Query('limit') limit: string = '20') {
    return this.svc.getBroadcastHistory(parseInt(page), parseInt(limit));
  }
}
`;

const moduleCode = `
import { Module } from '@nestjs/common';
import { AdminNotificationsController } from './admin-notifications.controller';
import { AdminNotificationsService } from './admin-notifications.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AdminNotificationsController],
  providers: [AdminNotificationsService],
})
export class AdminNotificationsModule {}
`;

fs.writeFileSync('backend/src/admin/admin-notifications/admin-notifications.service.ts', serviceCode);
fs.writeFileSync('backend/src/admin/admin-notifications/admin-notifications.controller.ts', controllerCode);
fs.writeFileSync('backend/src/admin/admin-notifications/admin-notifications.module.ts', moduleCode);

console.log("Created admin notifications module files.");
