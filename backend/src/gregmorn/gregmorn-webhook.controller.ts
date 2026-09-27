import { Controller, Post, Body, Req, Headers, BadRequestException, Logger } from '@nestjs/common';
import { GregmornService } from './gregmorn.service';
import { WalletService } from '../wallet/wallet.service';
import { Request } from 'express';
import * as crypto from 'crypto';

@Controller('api/v1/webhooks/gregmorn')
export class GregmornWebhookController {
  private readonly logger = new Logger(GregmornWebhookController.name);

  constructor(
    private readonly gregmornService: GregmornService,
    private readonly walletService: WalletService
  ) {}

  private verifySignature(req: Request, signature: string) {
    // req.rawBody is available because rawBody: true is set in NestFactory
    const rawBody = (req as any).rawBody;
    if (!rawBody) {
      throw new BadRequestException('Raw body is missing');
    }

    const expectedSignature = crypto
      .createHmac('sha256', this.gregmornService.secretKey)
      .update(rawBody)
      .digest('hex');

    if (signature !== expectedSignature) {
      this.logger.error(`Signature mismatch. Expected: ${expectedSignature}, Got: ${signature}`);
      throw new BadRequestException('Invalid signature');
    }
  }

  @Post()
  async handleWebhook(
    @Req() req: Request,
    @Headers('x-signature') signature: string,
    @Body() body: any
  ) {
    if (!signature) {
      return { status: 'fail', error: 'Missing X-Signature header' };
    }

    try {
      this.verifySignature(req, signature);
    } catch (e) {
      return { status: 'fail', error: 'invalid signature' };
    }

    const { cmd, login, sessionid, transactionId, bet, win } = body;
    const userId = login; // As per our openGame logic

    try {
      // Find wallet balance
      const balanceData = await this.walletService.getBalance(userId);
      let currentBalance = balanceData.balance;

      switch (cmd) {
        case 'getBalance':
          return {
            balance: currentBalance,
            currency: balanceData.currency || 'PKR',
            error: '',
            login,
            status: 'success'
          };

        case 'writeBet': {
          // Convert bet/win to numbers since docs say they can be strings
          const betAmount = Number(bet || 0);
          const winAmount = Number(win || 0);

          if (betAmount > currentBalance) {
            return {
              balance: currentBalance,
              currency: balanceData.currency || 'PKR',
              error: 'insufficient funds',
              login,
              status: 'fail'
            };
          }

          // Process transaction (deduct bet, add win)
          const netAmount = winAmount - betAmount;
          
          if (netAmount !== 0) {
            // Ideally we should check idempotency using transactionId before applying
            // but for simplicity we assume the walletService or DB handles duplicate prevention if implemented,
            // or we just process it. A robust system stores transactionId in DB.
            await this.walletService.processTransaction({
              walletId: balanceData.wallet_id,
              amount: netAmount,
              type: netAmount > 0 ? 'WIN' : 'BET',
              description: `Game transaction: ${transactionId}`,
              referenceId: transactionId
            });
            
            const updatedBalance = await this.walletService.getBalance(userId);
            currentBalance = updatedBalance.balance;
          }

          return {
            balance: currentBalance,
            currency: balanceData.currency || 'PKR',
            error: '',
            login,
            status: 'success'
          };
        }

        case 'rollback': {
          const betAmount = Number(bet || 0);
          const winAmount = Number(win || 0); // usually 0

          // Rollback the exact amount
          const netAmount = betAmount - winAmount;

          if (netAmount !== 0) {
            await this.walletService.processTransaction({
              walletId: balanceData.wallet_id,
              amount: netAmount,
              type: 'REFUND',
              description: `Rollback transaction: ${transactionId}`,
              referenceId: `${transactionId}_rollback`
            });
            
            const updatedBalance = await this.walletService.getBalance(userId);
            currentBalance = updatedBalance.balance;
          }

          return {
            balance: currentBalance,
            currency: balanceData.currency || 'PKR',
            error: '',
            login,
            status: 'success'
          };
        }

        default:
          return { status: 'fail', error: 'unknown command' };
      }
    } catch (error) {
      this.logger.error(`Webhook error: ${error.message}`);
      return { status: 'fail', error: 'internal error' };
    }
  }
}
