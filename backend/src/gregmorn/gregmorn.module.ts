import { Module } from '@nestjs/common';
import { GregmornService } from './gregmorn.service';
import { GregmornController } from './gregmorn.controller';
import { GregmornWebhookController } from './gregmorn-webhook.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { WalletModule } from '../wallet/wallet.module';

@Module({
  imports: [PrismaModule, WalletModule],
  controllers: [GregmornController, GregmornWebhookController],
  providers: [GregmornService],
  exports: [GregmornService],
})
export class GregmornModule {}
