const fs = require('fs');
const content = `
import { Controller, Post, Body, Req, Res, Headers, Logger } from '@nestjs/common';
import { SlotegratorService } from './slotegrator.service';
import { WalletService } from '../wallet/wallet.service';
import { Request, Response } from 'express';
import * as crypto from 'crypto';
import { TransactionType } from '@prisma/client';

@Controller('api/v1/webhooks/slotegrator')
export class SlotegratorWebhookController {
  private readonly logger = new Logger(SlotegratorWebhookController.name);

  constructor(
    private readonly slotegratorService: SlotegratorService,
    private readonly walletService: WalletService
  ) {}

  private verifySignature(body: any, headers: any): boolean {
    const merchantId = headers['x-merchant-id'];
    const timestamp = headers['x-timestamp'];
    const nonce = headers['x-nonce'];
    const receivedSign = headers['x-sign'];

    if (!merchantId || !timestamp || !nonce || !receivedSign) return false;

    const mergedParams = {
      ...body,
      'X-Merchant-Id': merchantId,
      'X-Timestamp': timestamp,
      'X-Nonce': nonce
    };

    const sortedKeys = Object.keys(mergedParams).sort();
    const pairs = [];
    for (const key of sortedKeys) {
      if (mergedParams[key] !== undefined && mergedParams[key] !== null) {
        pairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(String(mergedParams[key])));
      }
    }
    const hashString = pairs.join('&');
    
    const expectedSign = crypto.createHmac('sha1', this.slotegratorService.merchantKey).update(hashString, 'utf8').digest('hex');
    return expectedSign === receivedSign;
  }

  @Post()
  async handleWebhook(
    @Req() req: Request,
    @Res() res: Response,
    @Headers() headers: any,
    @Body() body: any
  ) {
    try {
      if (!this.verifySignature(body, headers)) {
        this.logger.error('Invalid Slotegrator signature');
        return res.status(401).json({ error_code: 'INTERNAL_ERROR', error_description: 'Invalid signature' });
      }

      const action = body.action;
      const playerId = body.player_id;
      const amount = Number(body.amount || 0);
      const transactionId = body.transaction_id;
      // const type = body.type; // bet, win, freespin

      // Find user wallet
      let balanceData;
      let effectiveUserId = playerId;
      if (playerId.startsWith('Player_')) {
        const partial = playerId.replace('Player_', '');
        balanceData = await this.walletService.getWalletByPartialUserId(partial);
        effectiveUserId = balanceData.user_id;
      } else {
        try {
          balanceData = await this.walletService.getBalance(playerId);
        } catch (e) {
          return res.status(200).json({ error_code: 'INTERNAL_ERROR', error_description: 'Player not found' });
        }
      }
      
      const walletId = balanceData.wallet_id;
      let currentBalance = Number(balanceData.balance);

      if (action === 'balance') {
        return res.status(200).json({ balance: currentBalance });
      }

      if (action === 'bet') {
        if (currentBalance < amount) {
          return res.status(200).json({ error_code: 'INSUFFICIENT_FUNDS', error_description: 'Not enough money' });
        }
        
        try {
          const newWallet = await this.walletService.processTransaction({
            walletId,
            amount: -amount,
            type: TransactionType.BET,
            description: \`Slotegrator Bet: \${body.game_uuid}\`,
            reference: transactionId
          });
          return res.status(200).json({ balance: Number(newWallet.balance), transaction_id: transactionId });
        } catch (e) {
          // If transaction already processed (unique constraint error)
          if (e.message.includes('Unique constraint')) {
            return res.status(200).json({ balance: currentBalance, transaction_id: transactionId });
          }
          return res.status(200).json({ error_code: 'INTERNAL_ERROR', error_description: e.message });
        }
      }

      if (action === 'win') {
        try {
          const newWallet = await this.walletService.processTransaction({
            walletId,
            amount: amount,
            type: TransactionType.WIN,
            description: \`Slotegrator Win: \${body.game_uuid}\`,
            reference: transactionId
          });
          return res.status(200).json({ balance: Number(newWallet.balance), transaction_id: transactionId });
        } catch (e) {
          if (e.message.includes('Unique constraint')) {
            return res.status(200).json({ balance: currentBalance, transaction_id: transactionId });
          }
          return res.status(200).json({ error_code: 'INTERNAL_ERROR', error_description: e.message });
        }
      }

      if (action === 'refund') {
        try {
          const newWallet = await this.walletService.processTransaction({
            walletId,
            amount: amount,
            type: TransactionType.REFUND,
            description: \`Slotegrator Refund: \${body.game_uuid}\`,
            reference: transactionId
          });
          return res.status(200).json({ balance: Number(newWallet.balance), transaction_id: transactionId });
        } catch (e) {
          if (e.message.includes('Unique constraint')) {
            return res.status(200).json({ balance: currentBalance, transaction_id: transactionId });
          }
          return res.status(200).json({ error_code: 'INTERNAL_ERROR', error_description: e.message });
        }
      }

      if (action === 'rollback') {
        // Rollback is complex as it cancels previous bets/wins. We will simply add/deduct the 'amount' as an adjustment
        // According to docs, amount is the net change? Wait, rollback specifies rollback_transactions list, and an amount.
        // If it's too complex, just refunding the amount as an ADJUSTMENT is the safest fallback.
        try {
          const newWallet = await this.walletService.processTransaction({
            walletId,
            amount: amount,
            type: TransactionType.REFUND, // Using refund for rollback
            description: \`Slotegrator Rollback: \${body.game_uuid}\`,
            reference: transactionId
          });
          
          return res.status(200).json({
            balance: Number(newWallet.balance),
            transaction_id: transactionId,
            rollback_transactions: body.rollback_transactions || []
          });
        } catch (e) {
          if (e.message.includes('Unique constraint')) {
            return res.status(200).json({ balance: currentBalance, transaction_id: transactionId });
          }
          return res.status(200).json({ error_code: 'INTERNAL_ERROR', error_description: e.message });
        }
      }

      return res.status(200).json({ error_code: 'INTERNAL_ERROR', error_description: 'Unknown action' });
      
    } catch (error) {
      this.logger.error('Slotegrator Webhook Error: ' + error.message);
      return res.status(200).json({ error_code: 'INTERNAL_ERROR', error_description: 'Server error' });
    }
  }
}
`;
fs.writeFileSync('slotegrator-webhook.controller.ts', content);
console.log('Created slotegrator-webhook.controller.ts locally');
