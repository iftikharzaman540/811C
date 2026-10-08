const fs = require('fs');
const content = `
import { Controller, Post, Body, Req, Res, Headers, Logger } from '@nestjs/common';
import { MeganodesService } from './meganodes.service';
import { WalletService } from '../wallet/wallet.service';
import { Request, Response } from 'express';
import { TransactionType } from '@prisma/client';

@Controller('api/v1/webhooks/meganodes')
export class MeganodesWebhookController {
  private readonly logger = new Logger(MeganodesWebhookController.name);
  private readonly apiToken = process.env.MEGANODES_API_TOKEN || '123qwe!@#QWE';

  constructor(
    private readonly meganodesService: MeganodesService,
    private readonly walletService: WalletService
  ) {}

  private verifySignature(headers: any): boolean {
    const auth = headers['authorization'];
    if (!auth || !auth.startsWith('Bearer ')) return false;
    const token = auth.replace('Bearer ', '');
    return token === this.apiToken;
  }

  @Post('GetBalance')
  async getBalance(@Req() req: Request, @Res() res: Response, @Headers() headers: any, @Body() body: any) {
    if (!this.verifySignature(headers)) {
      return res.status(401).json({ error: 401, description: 'Unauthorized' });
    }

    try {
      const userCode = Number(body.user_code);
      const userId = await this.meganodesService.resolveUserIdFromCode(userCode);
      const balanceData = await this.walletService.getBalance(userId);

      return res.status(200).json({
        data: { user_balance: Number(balanceData.balance) },
        error: 0,
        description: 'OK'
      });
    } catch (e) {
      this.logger.error('Meganodes GetBalance Error: ' + e.message);
      // Return 0 balance or error
      return res.status(200).json({ error: 2002, description: 'UserNotFound' });
    }
  }

  @Post('UTransaction')
  async handleTransaction(@Req() req: Request, @Res() res: Response, @Headers() headers: any, @Body() body: any) {
    if (!this.verifySignature(headers)) {
      return res.status(401).json({ error: 401, description: 'Unauthorized' });
    }

    try {
      const userCode = Number(body.user_code);
      const userId = await this.meganodesService.resolveUserIdFromCode(userCode);
      const balanceData = await this.walletService.getBalance(userId);
      const walletId = balanceData.wallet_id;

      const transId = String(body.trans_id);
      const amount = Number(body.amount);
      const txType = Number(body.transaction_type);
      const gameDesc = \`Meganodes: \${body.game_name} (\${body.provider_name})\`;

      let newBalance = Number(balanceData.balance);

      // transaction_type values: Bet (1), Win (2), Cancel (3)
      if (txType === 1) { // Bet
        if (newBalance < amount) {
          return res.status(200).json({ error: 2001, description: 'PointNotEnough' });
        }
        try {
          const w = await this.walletService.processTransaction({
            walletId,
            amount: -amount,
            type: TransactionType.BET,
            description: \`Bet - \${gameDesc}\`,
            referenceId: transId
          });
          newBalance = Number(w.balance_after);
        } catch (e) {
          if (!e.message.includes('Unique constraint')) throw e;
        }
      } 
      else if (txType === 2) { // Win
        try {
          const w = await this.walletService.processTransaction({
            walletId,
            amount: amount,
            type: TransactionType.WIN,
            description: \`Win - \${gameDesc}\`,
            referenceId: transId
          });
          newBalance = Number(w.balance_after);
        } catch (e) {
          if (!e.message.includes('Unique constraint')) throw e;
        }
      }
      else if (txType === 3) { // Cancel/Rollback
        try {
          const w = await this.walletService.processTransaction({
            walletId,
            amount: amount, // Cancel restores the amount
            type: TransactionType.REFUND,
            description: \`Cancel/Rollback - \${gameDesc}\`,
            referenceId: transId
          });
          newBalance = Number(w.balance_after);
        } catch (e) {
          if (!e.message.includes('Unique constraint')) throw e;
        }
      }

      return res.status(200).json({
        data: { user_balance: newBalance },
        error: 0,
        description: 'OK'
      });
      
    } catch (error) {
      this.logger.error('Meganodes UTransaction Error: ' + error.message);
      return res.status(200).json({ error: 500, description: 'ServiceError' });
    }
  }
}
`;
fs.writeFileSync('meganodes-webhook.controller.ts', content);
console.log('Created meganodes-webhook.controller.ts locally');
