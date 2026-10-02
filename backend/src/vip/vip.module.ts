import { Module } from '@nestjs/common';
import { VipService } from './vip.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [require('./vip.controller').VipController],
  providers: [VipService],
  exports: [VipService],
})
export class VipModule {}

