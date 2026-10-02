import { Controller, Get, Put, Body, UseGuards, Param, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { PrismaService } from '../../prisma/prisma.service';
import { VipService } from '../../vip/vip.service';

@Controller('admin/vip')
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
    return this.prisma.vipLevel.update({
      where: { id },
      data: { min_deposit: data.min_deposit }
    });
  }

  @Get('history')
  async getHistory(@Query('page') page: string = '1', @Query('limit') limit: string = '20') {
    return this.vipService.getVipHistory(Number(page), Number(limit));
  }
}

