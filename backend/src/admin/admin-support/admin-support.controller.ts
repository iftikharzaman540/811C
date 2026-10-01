import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AdminSupportService } from './admin-support.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('admin/support/tickets')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.SUPER_ADMIN, Role.ADMIN)
export class AdminSupportController {
  constructor(private readonly svc: AdminSupportService) {}
  @Get()
  getAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.svc.getTickets(page ? parseInt(page) : 1, limit ? parseInt(limit) : 50);
  }
}