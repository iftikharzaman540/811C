import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { AdminFinancesService } from './admin-finances.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('admin/finances')
@UseGuards(AuthGuard('jwt'), RolesGuard)
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

  @Get('deposits')
  getDeposits(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.adminFinancesService.getDeposits(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 50
    );
  }

  @Get('withdrawals')
  getWithdrawals(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.adminFinancesService.getWithdrawals(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 50
    );
  }
}
