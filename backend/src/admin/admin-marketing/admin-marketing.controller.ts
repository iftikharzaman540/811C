import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AdminMarketingService } from './admin-marketing.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('api/v1/admin/marketing')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.SUPER_ADMIN, Role.ADMIN)
export class AdminMarketingController {
  constructor(private readonly svc: AdminMarketingService) {}
  @Get('events')
  getEvents() {
    return this.svc.getEvents();
  }

  @Post('events')
  updateEvents(@Body() data: any) {
    return this.svc.updateEvents(data);
  }


  // PROMO CODES
  @Get('promocodes')
  getPromoCodes(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.svc.getPromoCodes(page ? parseInt(page) : 1, limit ? parseInt(limit) : 50);
  }

  @Post('promocodes')
  createPromoCode(@Body() data: any) {
    return this.svc.createPromoCode(data);
  }

  @Patch('promocodes/:id')
  updatePromoCode(@Param('id') id: string, @Body() data: any) {
    return this.svc.updatePromoCode(id, data);
  }

  @Delete('promocodes/:id')
  deletePromoCode(@Param('id') id: string) {
    return this.svc.deletePromoCode(id);
  }

  // BONUSES
  @Get('bonuses')
  getBonuses(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.svc.getBonuses(page ? parseInt(page) : 1, limit ? parseInt(limit) : 50);
  }

  @Post('bonuses')
  createBonus(@Body() data: any) {
    return this.svc.createBonus(data);
  }

  @Patch('bonuses/:id')
  updateBonus(@Param('id') id: string, @Body() data: any) {
    return this.svc.updateBonus(id, data);
  }

  @Delete('bonuses/:id')
  deleteBonus(@Param('id') id: string) {
    return this.svc.deleteBonus(id);
  }

  // AFFILIATES
  @Get('affiliates')
  getAffiliates(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.svc.getAffiliates(page ? parseInt(page) : 1, limit ? parseInt(limit) : 50);
  }
}