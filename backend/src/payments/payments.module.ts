import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { JazzCashProvider } from './providers/jazzcash.provider';
import { EasypaisaProvider } from './providers/easypaisa.provider';
import { XpressPayProvider } from './providers/xpresspay.provider';
import { WalletModule } from '../wallet/wallet.module';
import { VipModule } from '../vip/vip.module';

@Module({
  imports: [WalletModule, VipModule],
  providers: [PaymentsService, JazzCashProvider, EasypaisaProvider, XpressPayProvider],
  controllers: [PaymentsController],
  exports: [PaymentsService],
})
export class PaymentsModule {}


