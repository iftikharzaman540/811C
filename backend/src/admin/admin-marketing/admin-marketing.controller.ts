import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AdminMarketingService } from './admin-marketing.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('admin/marketing/promocodes')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.SUPER_ADMIN, Role.ADMIN)
export class AdminMarketingController {
  constructor(private readonly svc: AdminMarketingService) {}
  @Get()
  getAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.svc.getPromoCodes(page ? parseInt(page) : 1, limit ? parseInt(limit) : 50);
  }
}