import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AdminKycService } from './admin-kyc.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('admin/kyc')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.SUPER_ADMIN, Role.ADMIN)
export class AdminKycController {
  constructor(private readonly svc: AdminKycService) {}
  @Get()
  getAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.svc.getDocuments(page ? parseInt(page) : 1, limit ? parseInt(limit) : 50);
  }
}