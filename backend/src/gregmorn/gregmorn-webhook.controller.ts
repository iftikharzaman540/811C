import { Controller, Post, Body, Req, Res, Headers, Logger } from '@nestjs/common';
import { GregmornService } from './gregmorn.service';
import { WalletService } from '../wallet/wallet.service';
import { Request, Response } from 'express';
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
      throw new Error('Raw body is missing');
    }

    const expectedSignature = crypto
      .createHmac('sha256', this.gregmornService.secretKey)
      .update(rawBody)
      .digest('hex');

    if (signature !== expectedSignature) {
      this.logger.error(`Signature mismatch. Expected: ${expectedSignature}, Got: ${signature}`);
      throw new Error('Invalid signature');
    }
  }

  @Post()
  async handleWebhook(
    @Req() req: Request,
    @Res() res: Response,
    @Headers('x-signature') signature: string,
    @Body() body: any
  ) {
    if (!signature) {
      return res.status(400).json({ status: 'fail', error: 'Missing X-Signature header' });
    }

    try {
      this.verifySignature(req, signature);
    } catch (e) {
      return res.status(400).json({ status: 'fail', error: 'invalid signature' });
    }

    const { cmd, login, sessionid, transactionId, bet, win } = body;
    const userId = login; // As per our openGame logic

    try {
      // Find wallet balance
      let balanceData;
      let effectiveUserId = userId;
      if (userId.startsWith('Player_')) {
        const partial = userId.replace('Player_', '');
        balanceData = await this.walletService.getWalletByPartialUserId(partial);
        effectiveUserId = balanceData.user_id; // Added user_id to getWalletByPartialUserId return
      } else {
        balanceData = await this.walletService.getBalance(userId);
      }
      let currentBalance = balanceData.balance;

      switch (cmd) {
        case 'getBalance':
          return res.status(200).json({
            balance: currentBalance,
            currency: balanceData.currency || 'PKR',
            error: '',
            login,
            status: 'success'
          });

        case 'writeBet': {
          // Convert bet/win to numbers since docs say they can be strings
          const betAmount = Number(bet || 0);
          const winAmount = Number(win || 0);

          if (betAmount > currentBalance) {
            // According to Gregmorn docs, we MUST respond with HTTP 400+ on fail, otherwise they double-charge
            return res.status(400).json({
              balance: currentBalance,
              currency: balanceData.currency || 'PKR',
              error: 'insufficient funds',
              login,
              status: 'fail'
            });
          }

          // Process transaction (deduct bet, add win)
          const netAmount = winAmount - betAmount;
          
          // Track wagering requirement
          if (betAmount > 0) {
            await this.walletService.updateWageringCompleted(effectiveUserId, betAmount).catch(e => this.logger.error('Wagering update error:', e));
          }
          
          if (netAmount !== 0) {
            const existingTx = await this.walletService.getTransactionByReference(transactionId);
            if (existingTx) {
              this.logger.warn(`Duplicate transactionId detected: ${transactionId}`);
              return res.status(200).json({
                balance: currentBalance,
                currency: balanceData.currency || 'PKR',
                error: '',
                login,
                status: 'success'
              });
            }

            await this.walletService.processTransaction({
              walletId: balanceData.wallet_id,
              amount: netAmount,
              type: netAmount > 0 ? 'WIN' : 'BET',
              description: `Game transaction: ${transactionId}`,
              referenceId: transactionId
            });
            
            const updatedBalance = await this.walletService.getBalance(effectiveUserId);
            currentBalance = updatedBalance.balance;
          }

          return res.status(200).json({
            balance: currentBalance,
            currency: balanceData.currency || 'PKR',
            error: '',
            login,
            status: 'success'
          });
        }

        case 'rollback': {
          const betAmount = Number(bet || 0);
          const winAmount = Number(win || 0); // usually 0

          // Rollback the exact amount
          const netAmount = betAmount - winAmount;

          if (netAmount !== 0) {
            const rollbackRef = `${transactionId}_rollback`;
            const existingRollback = await this.walletService.getTransactionByReference(rollbackRef);
            if (existingRollback) {
              this.logger.warn(`Duplicate rollback detected: ${rollbackRef}`);
              return res.status(200).json({ balance: currentBalance, currency: balanceData.currency || 'PKR', error: '', login, status: 'success' });
            }
            try {
              await this.walletService.processTransaction({
                walletId: balanceData.wallet_id,
                amount: netAmount,
                type: 'REFUND',
                description: `Rollback transaction: ${transactionId}`,
                referenceId: `${transactionId}_rollback`
              });
              
              const updatedBalance = await this.walletService.getBalance(effectiveUserId);
              currentBalance = updatedBalance.balance;
            } catch (err) {
              // If we can't process it (e.g., transaction not found in a strict idempotent setup),
              // still return success as per the Gregmorn documentation requirements.
              this.logger.error(`Failed to process rollback for ${transactionId}, returning success anyway. Error: ${err.message}`);
            }
          }

          return res.status(200).json({
            balance: currentBalance,
            currency: balanceData.currency || 'PKR',
            error: '',
            login,
            status: 'success'
          });
        }

        default:
          return res.status(400).json({ status: 'fail', error: 'unknown command' });
      }
    } catch (error) {
      this.logger.error(`Webhook error: ${error.message}`);
      return res.status(500).json({ status: 'fail', error: 'internal error' });
    }
  }
}
