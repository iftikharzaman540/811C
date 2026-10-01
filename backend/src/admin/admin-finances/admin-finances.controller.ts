import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { AdminFinancesService } from './admin-finances.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller('admin/finances')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SUPER_ADMIN, Role.ADMIN) // Ideally we would have FINANCE_ADMIN role checking here
export class AdminFinancesController {
  constructor(private readonly adminFinancesService: AdminFinancesService) {}

  @Post('wallet-adjustments')
  adjustWallet(@Body() body: { userId: string; amount: number; type: 'CREDIT' | 'DEBIT'; reason: string }, @Req() req: any) {
    return this.adminFinancesService.adjustWallet(body.userId, req.user.userId, body.amount, body.type, body.reason);
  }

  @Get('wallet-adjustments/history')
  getAdjustmentsHistory(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.adminFinancesService.getAdjustmentsHistory(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 20
    );
  }
}
