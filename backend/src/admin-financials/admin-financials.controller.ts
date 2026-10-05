import { Controller, Get, Patch, Param, Query, UseGuards } from '@nestjs/common';
import { AdminFinancialsService } from './admin-financials.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role, FinancialStatus } from '@prisma/client';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery, ApiParam } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Admin - Financials')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.ADMIN, Role.SUPER_ADMIN)
@Controller('api/v1/admin')
export class AdminFinancialsController {
  constructor(private readonly service: AdminFinancialsService) {}

  @Get('deposits')
  @ApiOperation({ summary: 'List all deposits' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'status', required: false, enum: ['PENDING', 'APPROVED', 'REJECTED', 'COMPLETED'] })
  async getDeposits(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('status') status?: FinancialStatus,
    @Query('search') search?: string
  ) {
    return this.service.getDeposits(Number(page), Number(limit), status, search);
  }

  @Patch('deposits/:id/:action')
  @ApiOperation({ summary: 'Approve or reject a deposit' })
  @ApiParam({ name: 'action', enum: ['approve', 'reject'] })
  async processDeposit(
    @CurrentUser() admin: any,
    @Param('id') id: string,
    @Param('action') action: 'approve' | 'reject'
  ) {
    return this.service.processDeposit(admin.userId, id, action);
  }

  @Get('withdrawals')
  @ApiOperation({ summary: 'List all withdrawals' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'status', required: false, enum: ['PENDING', 'APPROVED', 'REJECTED', 'COMPLETED'] })
  async getWithdrawals(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('status') status?: FinancialStatus
  ) {
    return this.service.getWithdrawals(Number(page), Number(limit), status);
  }

  @Patch('withdrawals/:id/:action')
  @ApiOperation({ summary: 'Approve, reject, or complete a withdrawal' })
  @ApiParam({ name: 'action', enum: ['approve', 'reject', 'complete'] })
  async processWithdrawal(
    @CurrentUser() admin: any,
    @Param('id') id: string,
    @Param('action') action: 'approve' | 'reject' | 'complete',
    @Body() body?: { reason?: string }
  ) {
    return this.service.processWithdrawal(admin.userId, id, action, body?.reason);
  }
}
