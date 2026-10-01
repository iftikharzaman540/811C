import { Module } from '@nestjs/common';
import { AdminFinancesController } from './admin-finances.controller';
import { AdminFinancesService } from './admin-finances.service';

@Module({
  controllers: [AdminFinancesController],
  providers: [AdminFinancesService]
})
export class AdminFinancesModule {}
