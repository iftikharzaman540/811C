import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WalletService } from '../wallet/wallet.service';
import { JazzCashProvider } from './providers/jazzcash.provider';
import { EasypaisaProvider } from './providers/easypaisa.provider';
import { XpressPayProvider } from './providers/xpresspay.provider';
import { v4 as uuidv4 } from 'uuid';
import { PaymentProvider } from '@prisma/client';

@Injectable()
export class PaymentsService {
  constructor(
    private prisma: PrismaService,
    private walletService: WalletService,
    private jazzCash: JazzCashProvider,
    private easyPaisa: EasypaisaProvider,
    private xpressPay: XpressPayProvider
  ) {}

  private getProvider(provider: PaymentProvider) {
    if (provider === 'JAZZCASH' || provider === 'EASYPAISA') return this.xpressPay; // Use XpressPay for both!
    throw new BadRequestException('Unsupported provider');
  }

  async createDeposit(userId: string, amount: number, providerName: PaymentProvider) {
    const reference = `DEP-${uuidv4()}`;
    const provider = this.getProvider(providerName);

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

    const providerResponse = await provider.initiateDeposit(amount, reference, { userId });
    return { payment_id: payment.id, reference, ...providerResponse };
  }

  async createAutoDeposit(userId: string, amount: number, providerName: PaymentProvider, accountNo: string) {
    const reference = `AUTO-DEP-${uuidv4()}`;

    // 1. Create a completed payment immediately (since it's a seamless API mock)
    const payment = await this.prisma.payment.create({
      data: {
        user_id: userId,
        amount,
        provider: providerName,
        type: 'DEPOSIT',
        transaction_reference: reference,
        status: 'COMPLETED',
        metadata: { auto: true, accountNo }
      },
    });

    // 2. Add the amount to user's wallet automatically
    const wallet = await this.prisma.wallet.findUnique({ where: { user_id: userId } });
    if (!wallet) throw new NotFoundException('Wallet not found');

    await this.walletService.processTransaction({
      walletId: wallet.id,
      type: 'DEPOSIT',
      amount: amount,
      referenceId: reference,
      description: `Auto Deposit via ${providerName} (${accountNo})`
    });

    // 3. Create the Deposit record for backwards compatibility in Admin Financials
    await this.prisma.deposit.create({
      data: {
        user_id: userId,
        amount,
        payment_method: providerName,
        transaction_ref: reference,
        status: 'COMPLETED',
      },
    });

    return { success: true, message: 'Deposit successful', reference, newBalance: wallet.balance.toNumber() + amount };
  }

  async handleWebhook(payload: any, signature: string) {
    const { reference, provider: providerName, status } = payload;
    if (!reference) throw new BadRequestException('Reference missing in webhook');

    const payment = await this.prisma.payment.findUnique({ where: { transaction_reference: reference } });
    if (!payment) throw new NotFoundException('Payment not found');

    if (payment.status !== 'PENDING') {
      return { success: true, message: 'Payment already processed (Idempotency)' };
    }

    const provider = this.getProvider(payment.provider);
    if (!provider.verifyWebhookSignature(payload, signature)) {
      throw new BadRequestException('Invalid webhook signature');
    }

    if (status === 'SUCCESS') {
      const wallet = await this.prisma.wallet.findUnique({ where: { user_id: payment.user_id } });
      
      // Update wallet via processTransaction
      const transaction = await this.walletService.processTransaction({
        walletId: wallet.id,
        amount: payment.amount.toNumber(),
        type: 'DEPOSIT',
        description: `Deposit via ${payment.provider}`,
        referenceId: payment.id,
      });

      await this.prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'COMPLETED', metadata: payload },
      });

      // Socket event would be emitted here (or via a Queued Job)

      return { success: true, transaction_id: transaction.id };
    } else {
      await this.prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'REJECTED', metadata: payload },
      });
      return { success: true, message: 'Payment rejected' };
    }
  }

  async createWithdrawal(userId: string, amount: number, providerName: PaymentProvider, accountDetails: any) {
    const wallet = await this.prisma.wallet.findUnique({ where: { user_id: userId } });
    if (wallet.balance.toNumber() < amount) {
      throw new BadRequestException('Insufficient balance');
    }
    if (amount < 500) {
      throw new BadRequestException('Minimum withdrawal is 500');
    }

    // Deduct immediately as PENDING via WalletService
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
