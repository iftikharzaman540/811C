const fs = require('fs');
const controllerCode = `
import { Controller, Get, Post, Param, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PrismaService } from '../prisma/prisma.service';

@Controller('api/v1/notifications')
@UseGuards(AuthGuard('jwt'))
export class NotificationsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async getMyNotifications(@Req() req: any) {
    return this.prisma.notification.findMany({
      where: { user_id: req.user.userId },
      orderBy: { created_at: 'desc' },
      take: 50
    });
  }

  @Post(':id/read')
  async markAsRead(@Req() req: any, @Param('id') id: string) {
    const notif = await this.prisma.notification.findFirst({
      where: { id, user_id: req.user.userId }
    });
    if (!notif) return { success: false, message: 'Not found' };

    await this.prisma.notification.update({
      where: { id },
      data: { is_read: true }
    });
    return { success: true };
  }

  @Post('read-all')
  async markAllAsRead(@Req() req: any) {
    await this.prisma.notification.updateMany({
      where: { user_id: req.user.userId, is_read: false },
      data: { is_read: true }
    });
    return { success: true };
  }
}
`;

fs.writeFileSync('backend/src/notifications/notifications.controller.ts', controllerCode);

// Register it in module
let modCode = fs.readFileSync('backend/src/notifications/notifications.module.ts', 'utf8');
if (!modCode.includes('NotificationsController')) {
  modCode = modCode.replace(
    "import { NotificationsService } from './notifications.service';",
    "import { NotificationsService } from './notifications.service';\nimport { NotificationsController } from './notifications.controller';"
  );
  modCode = modCode.replace(
    "providers: [NotificationsGateway, NotificationsService]",
    "controllers: [NotificationsController],\n  providers: [NotificationsGateway, NotificationsService]"
  );
  fs.writeFileSync('backend/src/notifications/notifications.module.ts', modCode);
}
console.log("Created User Notifications Controller!");
