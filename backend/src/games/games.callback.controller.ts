import { Controller, Post, Body, Headers, UnauthorizedException, Res, HttpStatus } from '@nestjs/common';
import { SlotegratorService } from '../providers/slotegrator.service';
import { WalletService } from '../wallet/wallet.service';
import { ReferralsService } from '../referrals/referrals.service';
import { Response } from 'express';
import { TransactionType } from '@prisma/client';

@Controller('api/v1/games/callback')
export class GamesCallbackController {
  constructor(
    private readonly slotegratorService: SlotegratorService,
    private readonly walletService: WalletService,
    private readonly referralsService: ReferralsService
  ) {}

  @Post()
  async handleCallback(
    @Headers() headers: any,
    @Body() body: any,
    @Res() res: Response
  ) {
    // 1. Verify Signature
    const isValid = this.slotegratorService.validateWebhook(headers, body);
    if (!isValid) {
      return res.status(HttpStatus.FORBIDDEN).json({
        error_code: 'INTERNAL_ERROR',
        error_description: 'Invalid signature',
      });
    }

    const { action, player_id, amount, currency, transaction_id } = body;

    try {
      // Find wallet balance (player_id should map to our internal user.id)
      const wallet = await this.walletService.getBalance(player_id);

      if (action === 'balance') {
        return res.json({
          balance: wallet.balance,
        });
      }

      if (action === 'bet') {
        if (wallet.balance < parseFloat(amount)) {
          return res.json({
            error_code: 'INSUFFICIENT_FUNDS',
            error_description: 'Not enough money',
          });
        }
        await this.walletService.processTransaction({
          walletId: wallet.wallet_id,
          amount: -parseFloat(amount), // Deduct bet
          type: TransactionType.BET,
          referenceId: transaction_id,
          description: `Bet on game`,
        });
        
        // Track wagering requirement
        if (parseFloat(amount) > 0) {
          await this.walletService.updateWageringCompleted(player_id, parseFloat(amount)).catch(e => console.error('Wagering error:', e));
        }

        // Trigger affiliate commission asynchronously (fire & forget)
        this.referralsService.processBetCommission(player_id, parseFloat(amount)).catch(err => {
          console.error("Failed to process affiliate commission:", err);
        });
      }

      if (action === 'win') {
        await this.walletService.processTransaction({
          walletId: wallet.wallet_id,
          amount: parseFloat(amount), // Add win
          type: TransactionType.WIN,
          referenceId: transaction_id,
          description: `Win from game`,
        });
      }

      if (action === 'refund' || action === 'rollback') {
        await this.walletService.processTransaction({
          walletId: wallet.wallet_id,
          amount: parseFloat(amount), // Return money
          type: TransactionType.REFUND,
          referenceId: transaction_id,
          description: `Refund from game`,
        });
      }

      // Return updated balance after operation
      const updatedWallet = await this.walletService.getBalance(player_id);
      return res.json({
        balance: updatedWallet.balance,
        transaction_id: transaction_id,
      });

    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        error_code: 'INTERNAL_ERROR',
        error_description: error.message,
      });
    }
  }
}
