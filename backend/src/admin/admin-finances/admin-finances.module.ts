import { Module } from '@nestjs/common';
import { AdminFinancesController } from './admin-finances.controller';
import { AdminFinancesService } from './admin-finances.service';
import { WalletModule } from '../../wallet/wallet.module';

@Module({
  imports: [WalletModule],
  controllers: [AdminFinancesController],
  providers: [AdminFinancesService]
})
export class AdminFinancesModule {}
