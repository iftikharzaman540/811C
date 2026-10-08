const fs = require('fs');
let adminVipCtrl = `import { Controller, Get, Put, Body, UseGuards, Param, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { PrismaService } from '../../prisma/prisma.service';
import { VipService } from '../../vip/vip.service';

@Controller('api/v1/admin/vip')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('ADMIN', 'SUPER_ADMIN')
export class AdminVipController {
  constructor(private prisma: PrismaService, private vipService: VipService) {}

  @Get('levels')
  async getLevels() {
    return this.vipService.getVipLevels();
  }

  @Put('levels/:id')
  async updateLevel(@Param('id') id: string, @Body() data: any) {
    const updateData: any = {};
    if (data.min_deposit !== undefined) updateData.min_deposit = data.min_deposit;
    if (data.min_turnover !== undefined) updateData.min_turnover = data.min_turnover;
    if (data.bonus_amount !== undefined) updateData.bonus_amount = data.bonus_amount;
    if (data.wagering_multiplier !== undefined) updateData.wagering_multiplier = data.wagering_multiplier;
    if (data.auto_upgrade !== undefined) updateData.auto_upgrade = data.auto_upgrade;
    if (data.auto_bonus !== undefined) updateData.auto_bonus = data.auto_bonus;

    return this.prisma.vipLevel.update({
      where: { id },
      data: updateData
    });
  }

  @Get('history')
  async getHistory(@Query('page') page: string = '1', @Query('limit') limit: string = '20') {
    return this.vipService.getVipHistory(Number(page), Number(limit));
  }
}
`;
fs.writeFileSync('/tmp/admin-vip.controller.ts', adminVipCtrl);
