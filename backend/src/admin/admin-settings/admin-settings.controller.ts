import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AdminSettingsService } from './admin-settings.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller('admin/settings')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SUPER_ADMIN) // Only super admin should see full audit logs
export class AdminSettingsController {
  constructor(private readonly adminSettingsService: AdminSettingsService) {}

  @Get('audit-logs')
  getAuditLogs(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.adminSettingsService.getAuditLogs(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 50
    );
  }
}
