import { Module } from '@nestjs/common';
import { AdminVipController } from './admin-vip.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { VipModule } from '../../vip/vip.module';

@Module({
  imports: [PrismaModule, VipModule],
  controllers: [AdminVipController],
})
export class AdminVipModule {}
