import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AdminSettingsService } from './admin-settings.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('api/v1/admin/settings')
@UseGuards(AuthGuard('jwt'), RolesGuard)
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

  // System Settings endpoints
  @Get('system')
  getSystemSettings() {
    return this.adminSettingsService.getSettings();
  }

  @Post('system')
  updateSystemSetting(@Body() body: { key: string; value: string; description?: string }) {
    return this.adminSettingsService.updateSetting(body.key, body.value, body.description);
  }

  @Delete('system/:key')
  deleteSystemSetting(@Param('key') key: string) {
    return this.adminSettingsService.deleteSetting(key);
  }
}
