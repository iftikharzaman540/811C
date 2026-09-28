import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
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
    private xpressPay: XpressPayProvider
  ) {}

  private getProvider(provider: PaymentProvider) {
    if (provider === 'JAZZCASH' || provider === 'EASYPAISA') return this.xpressPay;
    throw new BadRequestException('Unsupported provider');
  }

  async createDeposit(userId: string, amount: number, providerName: PaymentProvider) {
    const reference = `DEP-${uuidv4()}`;
    const payment = await this.prisma.payment.create({
      data: {
        user_id: userId,
        amount,
        provider: providerName,
        type: 'DEPOSIT',
        transaction_reference: reference,
        status: 'PENDING',
      },
    });

    return { payment_id: payment.id, reference, success: true, message: 'Deposit recorded manually' };
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

    const providerResponse = await this.xpressPay.initiateDeposit(amount, reference, metadata);
    
    // Save gateway order number
    await this.prisma.payment.update({
      where: { id: payment.id },
      data: { metadata: { auto: true, accountNo, gatewayOrderNo: providerResponse.gatewayOrderNo } }
    });

    return { 
      success: true, 
      message: 'Deposit initiated! Please check your phone for MPIN prompt.', 
      reference,
      gatewayOrderNo: providerResponse.gatewayOrderNo 
    };
  }

  async handleWebhook(payload: any) {
    this.logger.log(`Webhook Payload: ${JSON.stringify(payload)}`);

    // Ensure we unwrap if nested in 'data'
    const data = (payload.data && typeof payload.data === 'object') ? { ...payload, ...payload.data } : payload;
    
    if (!this.xpressPay.verifyWebhookSignature(payload)) {
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
        data: { status: 'COMPLETED', metadata: data },
      });

      await this.prisma.deposit.updateMany({
        where: { transaction_ref: reference },
        data: { status: 'COMPLETED', transaction_id: data.orderNo }
      });

      this.logger.log(`Deposit ${reference} COMPLETED successfully!`);
      return 'SUCCESS';
    } else if (orderStatus === '4' || statusText === 'FAILED') {
      await this.prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'REJECTED', metadata: data },
      });

      await this.prisma.deposit.updateMany({
        where: { transaction_ref: reference },
        data: { status: 'REJECTED' }
      });

      return 'SUCCESS';
    }

    return 'SUCCESS';
  }

  async getPaymentStatus(reference: string) {
    const payment = await this.prisma.payment.findFirst({ where: { transaction_reference: reference } });
    if (!payment) throw new NotFoundException('Payment not found');
    return { status: payment.status };
  }

  // Withdraw methods kept unchanged
  async createWithdrawal(userId: string, amount: number, providerName: PaymentProvider, accountDetails: any) {
    const wallet = await this.prisma.wallet.findUnique({ where: { user_id: userId } });
    if (wallet.balance.toNumber() < amount) {
      throw new BadRequestException('Insufficient balance');
    }
    if (amount < 500) {
      throw new BadRequestException('Minimum withdrawal is 500');
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
}
