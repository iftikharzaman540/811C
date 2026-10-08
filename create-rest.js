const fs = require('fs');

const serviceContent = fs.readFileSync('slotegrator.service.ts', 'utf8');
const webhookContent = fs.readFileSync('slotegrator-webhook.controller.ts', 'utf8');

const controllerContent = `
import { Controller, Post, Body, Req, UseGuards, HttpException } from '@nestjs/common';
import { SlotegratorService } from './slotegrator.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/v1/games/slotegrator')
export class SlotegratorController {
  constructor(private readonly slotegratorService: SlotegratorService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('launch')
  async launchGame(@Req() req: any, @Body() body: { gameId: string, demo?: boolean }) {
    if (!body.gameId) throw new HttpException('gameId is required', 400);
    
    // Convert generic user ID into something the provider understands if needed
    const playerId = \`Player_\${req.user.userId}\`;
    
    try {
      const url = await this.slotegratorService.initGame(
        body.gameId,
        playerId,
        req.user.username || 'Player',
        'PKR',
        body.demo || false
      );
      
      return { url };
    } catch (e) {
      throw new HttpException(e.message || 'Failed to launch Slotegrator game', 400);
    }
  }
}
`;

const moduleContent = `
import { Module } from '@nestjs/common';
import { SlotegratorService } from './slotegrator.service';
import { SlotegratorController } from './slotegrator.controller';
import { SlotegratorWebhookController } from './slotegrator-webhook.controller';
import { WalletModule } from '../wallet/wallet.module';

@Module({
  imports: [WalletModule],
  providers: [SlotegratorService],
  controllers: [SlotegratorController, SlotegratorWebhookController],
  exports: [SlotegratorService]
})
export class SlotegratorModule {}
`;

fs.writeFileSync('slotegrator.controller.ts', controllerContent);
fs.writeFileSync('slotegrator.module.ts', moduleContent);
console.log('Created controller and module locally');
