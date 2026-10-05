import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WalletService } from '../wallet/wallet.service';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { FinancialStatus } from '@prisma/client';

@Injectable()
export class AdminFinancialsService {
  constructor(
    private prisma: PrismaService,
    private walletService: WalletService,
    private auditLogs: AuditLogsService
  ) {}

  async getDeposits(page = 1, limit = 20, status?: FinancialStatus, search?: string) {
    const skip = (page - 1) * limit;
    const where: any = { type: 'DEPOSIT' };
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { transaction_reference: { contains: search, mode: 'insensitive' } },
        { user: { username: { contains: search, mode: 'insensitive' } } },
        { user: { email: { contains: search, mode: 'insensitive' } } }
      ];
    }
    
    const [data, total] = await Promise.all([
      this.prisma.payment.findMany({ where, skip, take: limit, orderBy: { created_at: 'desc' }, include: { user: { select: { username: true, email: true } } } }),
      this.prisma.payment.count({ where }),
    ]);

    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async processDeposit(adminId: string, depositId: string, action: 'approve' | 'reject') {
    const deposit = await this.prisma.payment.findUnique({ where: { id: depositId }, include: { user: true } });
    if (!deposit) throw new NotFoundException('Deposit not found');
    if (deposit.status !== 'PENDING') throw new BadRequestException(`Deposit is already ${deposit.status}`);

    const newStatus = action === 'approve' ? 'COMPLETED' : 'REJECTED'; // For Payment table, typically COMPLETED is used instead of APPROVED
    
    let transaction = null;
    if (action === 'approve') {
      const wallet = await this.prisma.wallet.findUnique({ where: { user_id: deposit.user_id } });
      if (!wallet) throw new NotFoundException('User wallet not found');
      
      transaction = await this.walletService.processTransaction({
        walletId: wallet.id,
        amount: deposit.amount.toNumber(),
        type: 'DEPOSIT',
        description: 'Manual deposit approval',
        referenceId: deposit.id
      });
    }

    const updated = await this.prisma.payment.update({ where: { id: depositId }, data: { status: newStatus } });

    await this.auditLogs.logAction({
      admin_id: adminId,
      user_id: deposit.user_id,
      action: `DEPOSIT_${newStatus}`,
      entity: 'PAYMENT',
      entity_id: depositId,
      old_value: { status: 'PENDING' },
      new_value: { status: newStatus, transaction_id: transaction?.id }
    });

    return updated;
  }

  async getWithdrawals(page = 1, limit = 20, status?: FinancialStatus) {
    const skip = (page - 1) * limit;
    const where: any = { type: 'WITHDRAWAL' };
    if (status) where.status = status;
    
    const [data, total] = await Promise.all([
      this.prisma.payment.findMany({ where, skip, take: limit, orderBy: { created_at: 'desc' }, include: { user: { select: { username: true, email: true } } } }),
      this.prisma.payment.count({ where }),
    ]);

    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async processWithdrawal(adminId: string, withdrawalId: string, action: 'approve' | 'reject' | 'complete') {
    const withdrawal = await this.prisma.payment.findUnique({ where: { id: withdrawalId } });
    if (!withdrawal) throw new NotFoundException('Withdrawal not found');

    let newStatus: FinancialStatus;
    if (action === 'approve') {
      if (withdrawal.status !== 'PENDING') throw new BadRequestException('Can only approve PENDING withdrawals');
      newStatus = 'APPROVED';
    } else if (action === 'reject') {
      if (withdrawal.status === 'COMPLETED') throw new BadRequestException('Cannot reject COMPLETED withdrawal');
      newStatus = 'REJECTED';
      
      const wallet = await this.prisma.wallet.findUnique({ where: { user_id: withdrawal.user_id } });
      await this.walletService.processTransaction({
        walletId: wallet.id,
        amount: withdrawal.amount.toNumber(),
        type: 'REFUND',
        description: 'Withdrawal rejected refund',
        referenceId: withdrawal.id
      });
    } else {
      if (withdrawal.status !== 'APPROVED') throw new BadRequestException('Can only complete APPROVED withdrawals');
      newStatus = 'COMPLETED';
    }

    const updated = await this.prisma.payment.update({ where: { id: withdrawalId }, data: { status: newStatus } });

    await this.auditLogs.logAction({
      admin_id: adminId,
      user_id: withdrawal.user_id,
      action: `WITHDRAWAL_${newStatus}`,
      entity: 'PAYMENT',
      entity_id: withdrawalId,
      old_value: { status: withdrawal.status },
      new_value: { status: newStatus }
    });

    return updated;
  }
}
