import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AdminCmsService } from './admin-cms.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('admin/cms/banners')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.SUPER_ADMIN, Role.ADMIN)
export class AdminCmsController {
  constructor(private readonly svc: AdminCmsService) {}
  @Get()
  getAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.svc.getBanners(page ? parseInt(page) : 1, limit ? parseInt(limit) : 50);
  }
}