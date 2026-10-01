import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AdminCmsService } from './admin-cms.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('api/v1/admin/cms')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.SUPER_ADMIN, Role.ADMIN)
export class AdminCmsController {
  constructor(private readonly svc: AdminCmsService) {}

  // BANNERS
  @Get('banners')
  getBanners(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.svc.getBanners(page ? parseInt(page) : 1, limit ? parseInt(limit) : 50);
  }

  @Post('banners')
  createBanner(@Body() data: any) {
    return this.svc.createBanner(data);
  }

  @Patch('banners/:id')
  updateBanner(@Param('id') id: string, @Body() data: any) {
    return this.svc.updateBanner(id, data);
  }

  @Delete('banners/:id')
  deleteBanner(@Param('id') id: string) {
    return this.svc.deleteBanner(id);
  }

  // PAGES
  @Get('pages')
  getPages(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.svc.getPages(page ? parseInt(page) : 1, limit ? parseInt(limit) : 50);
  }

  @Post('pages')
  createPage(@Body() data: any) {
    return this.svc.createPage(data);
  }

  @Patch('pages/:id')
  updatePage(@Param('id') id: string, @Body() data: any) {
    return this.svc.updatePage(id, data);
  }

  @Delete('pages/:id')
  deletePage(@Param('id') id: string) {
    return this.svc.deletePage(id);
  }
}