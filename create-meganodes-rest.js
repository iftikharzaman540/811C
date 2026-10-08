const fs = require('fs');

const controllerContent = `
import { Controller, Post, Body, Req, UseGuards, HttpException, Get, Query } from '@nestjs/common';
import { MeganodesService } from './meganodes.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/v1/games/meganodes')
export class MeganodesController {
  constructor(private readonly meganodesService: MeganodesService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('launch')
  async launchGame(@Req() req: any, @Body() body: { providerCode: number, gameSymbol: string }) {
    if (!body.providerCode || !body.gameSymbol) {
      throw new HttpException('providerCode and gameSymbol are required', 400);
    }
    
    try {
      const url = await this.meganodesService.initGame(
        req.user.userId,
        body.providerCode,
        body.gameSymbol
      );
      
      return { url };
    } catch (e) {
      throw new HttpException(e.message || 'Failed to launch Meganodes game', 400);
    }
  }
}
`;

const moduleContent = `
import { Module } from '@nestjs/common';
import { MeganodesService } from './meganodes.service';
import { MeganodesController } from './meganodes.controller';
import { MeganodesWebhookController } from './meganodes-webhook.controller';
import { WalletModule } from '../wallet/wallet.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [WalletModule, PrismaModule],
  providers: [MeganodesService],
  controllers: [MeganodesController, MeganodesWebhookController],
  exports: [MeganodesService]
})
export class MeganodesModule {}
`;

fs.writeFileSync('meganodes.controller.ts', controllerContent);
fs.writeFileSync('meganodes.module.ts', moduleContent);
console.log('Created controller and module locally');
