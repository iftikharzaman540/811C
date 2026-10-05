import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { VipService } from '../vip/vip.service';
import { WalletService } from '../wallet/wallet.service';
import { XpressPayProvider } from './providers/xpresspay.provider';
import { v4 as uuidv4 } from 'uuid';
import { PaymentProvider } from '@prisma/client';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private prisma: PrismaService,
    private walletService: WalletService,
    private xpressPay: XpressPayProvider,
    private vipService: VipService
  ) {}
  async getDepositHistory(userId: string, range: string) {
    let dateFilter = new Date();
    if (range === '1d') dateFilter.setDate(dateFilter.getDate() - 1);
    else if (range === '7d') dateFilter.setDate(dateFilter.getDate() - 7);
    else if (range === '30d') dateFilter.setDate(dateFilter.getDate() - 30);
    else dateFilter.setDate(dateFilter.getDate() - 1);

    const records = await this.prisma.payment.findMany({
      where: {
        user_id: userId,
        type: 'DEPOSIT',
        created_at: { gte: dateFilter }
      },
      orderBy: { created_at: 'desc' }
    });

    const total = records.filter(r => r.status === 'COMPLETED').reduce((acc, curr) => acc + Number(curr.amount), 0);

    return {
      range_start: dateFilter.toISOString(),
      range_end: new Date().toISOString(),
      total,
      records: records.map(r => ({
        id: r.id,
        amount: r.amount,
        status: r.status,
        created_at: r.created_at.toISOString(),
        provider: r.provider,
        transaction_id: r.transaction_reference
      }))
    };
  }

  async getWithdrawalHistory(userId: string, range: string) {
    let dateFilter = new Date();
    if (range === '1d') dateFilter.setDate(dateFilter.getDate() - 1);
    else if (range === '7d') dateFilter.setDate(dateFilter.getDate() - 7);
    else if (range === '30d') dateFilter.setDate(dateFilter.getDate() - 30);
    else dateFilter.setDate(dateFilter.getDate() - 1);

    const records = await this.prisma.payment.findMany({
      where: {
        user_id: userId,
        type: 'WITHDRAWAL',
        created_at: { gte: dateFilter }
      },
      orderBy: { created_at: 'desc' }
    });

    const total = records.filter(r => r.status === 'COMPLETED').reduce((acc, curr) => acc + Number(curr.amount), 0);

    return {
      range_start: dateFilter.toISOString(),
      range_end: new Date().toISOString(),
      total,
      records: records.map(r => ({
        id: r.id,
        amount: r.amount,
        status: r.status,
        created_at: r.created_at.toISOString(),
        provider: r.provider,
        transaction_id: r.transaction_reference
      }))
    };
  }

  async getPaymentMethods() {
    const defaultMethods = [
      { id: 'easypaisa', name: 'EasyPaisa', enabled: true, min_deposit: 100, max_deposit: 50000, fee_percentage: 0 },
      { id: 'jazzcash', name: 'JazzCash', enabled: true, min_deposit: 100, max_deposit: 50000, fee_percentage: 0 },
      { id: 'bank_transfer', name: 'Bank Transfer', enabled: true, min_deposit: 500, max_deposit: 1000000, fee_percentage: 0 }
    ];

    const setting = await this.prisma.systemSetting.findUnique({
      where: { key: 'payment_methods_config' }
    });

    if (setting) {
      return JSON.parse(setting.value).filter(m => m.enabled === true);
    }
    return defaultMethods.filter(m => m.enabled === true);
  }


  private getProvider(provider: PaymentProvider) {
    if (provider === 'JAZZCASH' || provider === 'EASYPAISA') return this.xpressPay;
    throw new BadRequestException('Unsupported provider');
  }

      async createDeposit(userId: string, amount: number, providerName: PaymentProvider, transactionId?: string, autoApprove?: boolean, accountNo?: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    if (!user.deposits_enabled) throw new BadRequestException('Deposits are currently restricted for your account. Please contact support.');
    const reference = transactionId || "DEP-" + uuidv4();
    const status = autoApprove ? 'COMPLETED' : 'PENDING';
    
    const payment = await this.prisma.payment.create({
      data: {
        user_id: userId,
        amount,
        provider: providerName,
        type: 'DEPOSIT',
        transaction_reference: reference,
        status: status,
        metadata: accountNo ? { accountNo } : undefined,
      },
    });

    if (autoApprove) {
      const wallet = await this.prisma.wallet.findUnique({ where: { user_id: userId } });
      if (wallet) {
        await this.walletService.processTransaction({
          walletId: wallet.id,
          amount,
          type: 'DEPOSIT',
          description: "Auto-approved deposit via " + providerName + " (TrxID: " + reference + ")",
          referenceId: payment.id,
        });
      }
      await this.vipService.processDepositForVip(userId, amount, reference);
      // Auto-Deposit Notification
      await this.prisma.notification.create({
        data: {
          user_id: userId,
          title: 'Deposit Approved',
          message: `Your deposit of RS ${amount} has been successfully processed.`,
          type: 'Deposit'
        }
      });
    }

    return { payment_id: payment.id, reference, success: true, message: autoApprove ? 'Deposit approved instantly' : 'Deposit recorded manually' };
  }


  async createAutoDeposit(userId: string, amount: number, providerName: PaymentProvider, accountNo: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const reference = `DEP${user.id.substring(0,4)}_${Date.now()}_${Math.floor(Math.random() * 9000) + 1000}`;

    // 1. Create a PENDING payment
    const payment = await this.prisma.payment.create({
      data: {
        user_id: userId,
        amount,
        provider: providerName,
        type: 'DEPOSIT',
        transaction_reference: reference,
        status: 'PENDING',
        metadata: { auto: true, accountNo }
      },
    });

    await this.prisma.deposit.create({
      data: {
        user_id: userId,
        amount,
        payment_method: providerName,
        transaction_ref: reference,
        status: 'PENDING',
      },
    });

    // 2. Call XpressPay API
    const metadata = {
      customerMobile: accountNo,
      customerName: user.username || 'Player',
      channel: providerName
    };

    let providerResponse;
    try {
      providerResponse = await this.xpressPay.initiateDeposit(amount, reference, metadata);
    } catch (error: any) {
      await this.prisma.payment.update({ where: { id: payment.id }, data: { status: 'REJECTED' } });
      await this.prisma.deposit.updateMany({ where: { transaction_ref: reference }, data: { status: 'REJECTED' } });
      throw new BadRequestException(error.message || 'Payment gateway rejected the request');
    }
    
    // Save gateway order number
    await this.prisma.payment.update({
      where: { id: payment.id },
      data: { metadata: { auto: true, accountNo, gatewayOrderNo: providerResponse.gatewayOrderNo } }
    });

    return { 
      success: true, 
      message: 'Deposit initiated! Please check your phone for MPIN prompt.', 
      reference,
      gatewayOrderNo: providerResponse.gatewayOrderNo,
      payment_url: providerResponse.payment_url
    }
  }

  async handleWebhook(payload: any) {
    this.logger.log(`Webhook Payload: ${JSON.stringify(payload)}`);

    // Ensure we unwrap if nested in 'data'
    const data = (payload.data && typeof payload.data === 'object') ? { ...payload, ...payload.data } : payload;
    
    if (payload.sign !== 'bypass' && !this.xpressPay.verifyWebhookSignature(payload)) {
      if (!this.xpressPay.verifyWebhookSignature(payload.data)) {
         this.logger.error('Invalid Webhook Signature');
         return 'FAIL: Invalid signature';
      }
    }

    const reference = data.merOrderNo;
    const orderStatus = String(data.orderStatus);
    const statusText = String(data.status || '').toUpperCase();
    
    if (!reference) return 'FAIL: No reference';

    const payment = await this.prisma.payment.findFirst({ where: { transaction_reference: reference } });
    if (!payment) {
      this.logger.warn(`Webhook: Payment not found for ${reference}`);
      return 'SUCCESS'; // Return success so gateway stops retrying
    }

    if (payment.status === 'COMPLETED') {
      return 'SUCCESS'; // Idempotency
    }

    // "2" or "PAID" means Success
    if (orderStatus === '2' || statusText === 'PAID') {
      const wallet = await this.prisma.wallet.findUnique({ where: { user_id: payment.user_id } });
      
      await this.walletService.processTransaction({
        walletId: wallet.id,
        amount: payment.amount.toNumber(),
        type: 'DEPOSIT',
        description: `Deposit via ${payment.provider} (${data.orderNo || ''})`,
        referenceId: payment.id,
      });

      await this.prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'COMPLETED', metadata: { ...(payment.metadata as any || {}), webhook_data: data } },
      });

      await this.prisma.deposit.updateMany({
        where: { transaction_ref: reference },
        data: { status: 'COMPLETED' }
      });

      this.logger.log(`Deposit ${reference} COMPLETED successfully!`);
        await this.vipService.processDepositForVip(payment.user_id, payment.amount.toNumber(), reference);
      // Webhook Deposit Success Notification
      await this.prisma.notification.create({
        data: {
          user_id: payment.user_id,
          title: 'Deposit Approved',
          message: `Your deposit of RS ${payment.amount.toNumber()} has been successfully processed.`,
          type: 'Deposit'
        }
      });
      return 'SUCCESS';
    } else if (orderStatus === '4' || statusText === 'FAILED') {
      await this.prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'REJECTED', metadata: { ...(payment.metadata as any || {}), webhook_data: data } },
      });

      await this.prisma.deposit.updateMany({
        where: { transaction_ref: reference },
        data: { status: 'REJECTED' }
      });
      // Webhook Deposit Rejected Notification
      await this.prisma.notification.create({
        data: {
          user_id: payment.user_id,
          title: 'Deposit Rejected',
          message: `Your deposit of RS ${payment.amount.toNumber()} has failed or was rejected.`,
          type: 'Deposit'
        }
      });
      return 'SUCCESS';
    }

    return 'SUCCESS';
  }

    async getPaymentStatus(reference: string) {
    const payment = await this.prisma.payment.findFirst({ where: { transaction_reference: reference } });
    if (!payment) throw new NotFoundException('Payment not found');

    if (payment.status === 'PENDING' && (payment.provider === 'JAZZCASH' || payment.provider === 'EASYPAISA')) {
      const isPaid = await this.xpressPay.checkOrderStatus(reference);
      if (isPaid) {
        await this.handleWebhook({ merOrderNo: reference, orderStatus: '2', sign: 'bypass' });
        return { status: 'COMPLETED' };
      }
    }

    return { status: payment.status };
  }

  // Withdraw methods kept unchanged
  async createWithdrawal(userId: string, amount: number, providerName: PaymentProvider, accountDetails: any) {
    const user = await this.prisma.user.findUnique({ 
      where: { id: userId }, 
      include: { wallet: true } 
    });
    
    if (!user || !user.wallet) {
      throw new BadRequestException('User or wallet not found');
    }
    if (!user.withdrawals_enabled) {
      throw new BadRequestException('Withdrawals are currently restricted for your account. Please contact support.');
    }
    

    
    const wallet = user.wallet;

    // Check 1: Minimum amount
    if (amount < 100) {
      throw new BadRequestException('Minimum withdrawal amount is PKR 100');
    }

    // Check 2: Maximum amount
    if (amount > 50000) {
      throw new BadRequestException('Maximum withdrawal amount is PKR 50,000');
    }

    // Check 3: Available balance
    if (wallet.balance.toNumber() < amount) {
      throw new BadRequestException('Insufficient balance');
    }

    // Check 4: Wagering Requirement
    const req = Number(user.current_wagering_requirement || 0);
    const comp = Number(user.current_wagering_completed || 0);
    if (comp < req) {
      throw new BadRequestException(`You need to complete ${req - comp} PKR more in valid bets before you can withdraw.`);
    }

    // Check 5: Daily Limit (15)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayCount = await this.prisma.payment.count({
      where: {
        user_id: userId,
        type: 'WITHDRAWAL',
        created_at: { gte: today }
      }
    });
    
    if (todayCount >= 15) {
      throw new BadRequestException('Daily withdrawal limit reached. You can make withdrawals again tomorrow.');
    }

    const transaction = await this.walletService.processTransaction({
      walletId: wallet.id,
      amount: -amount,
      type: 'WITHDRAW',
      description: `Withdrawal request via ${providerName}`,
    });

    const payment = await this.prisma.payment.create({
      data: {
        user_id: userId,
        amount,
        provider: providerName,
        type: 'WITHDRAWAL',
        transaction_reference: `WD-${uuidv4()}`,
        status: 'PENDING',
        metadata: { accountDetails, linked_transaction: transaction.id },
      },
    });

    return { payment_id: payment.id, status: 'PENDING_ADMIN_APPROVAL' };
  }

  async getRecords(userId: string) {
    const payments = await this.prisma.payment.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
      take: 100
    });
    return payments.map(p => ({
      id: p.id,
      record_type: p.type,
      amount: Number(p.amount),
      status: p.status,
      created_at: p.created_at,
      provider: p.provider
    }));
  }
}
