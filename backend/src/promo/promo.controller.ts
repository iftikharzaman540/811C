import { Controller, Post, UseGuards, Req } from '@nestjs/common';
import { PromoService } from './promo.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Promo')
@Controller('api/v1/promo')
export class PromoController {
  constructor(private readonly promoService: PromoService) {}

  @Post('spin')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Spin the Lucky Wheel' })
  async spinWheel(@Req() req: any) {
    return this.promoService.spinWheel(req.user.userId);
  }

  @Post('claim')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Claim Promotion Balance to Main Wallet' })
  async claimPromotion(@Req() req: any) {
    return this.promoService.claimPromotion(req.user.userId);
  }
}
