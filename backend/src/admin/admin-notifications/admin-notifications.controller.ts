
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
