const fs = require('fs');

const services = {
  'backend/src/admin/admin-kyc/admin-kyc.service.ts': `
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminKycService {
  constructor(private prisma: PrismaService) {}
  async getDocuments(page = 1, limit = 50) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.kycDocument.findMany({ skip, take: limit, orderBy: { created_at: 'desc' }, include: { user: { select: { email: true, username: true } } } }),
      this.prisma.kycDocument.count()
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }
}
`,
  'backend/src/admin/admin-kyc/admin-kyc.controller.ts': `
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AdminKycService } from './admin-kyc.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('admin/kyc')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.SUPER_ADMIN, Role.ADMIN)
export class AdminKycController {
  constructor(private readonly svc: AdminKycService) {}
  @Get()
  getAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.svc.getDocuments(page ? parseInt(page) : 1, limit ? parseInt(limit) : 50);
  }
}
`,
  'backend/src/admin/admin-support/admin-support.service.ts': `
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminSupportService {
  constructor(private prisma: PrismaService) {}
  async getTickets(page = 1, limit = 50) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.ticket.findMany({ skip, take: limit, orderBy: { created_at: 'desc' }, include: { user: { select: { email: true, username: true } } } }),
      this.prisma.ticket.count()
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }
}
`,
  'backend/src/admin/admin-support/admin-support.controller.ts': `
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AdminSupportService } from './admin-support.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('admin/support/tickets')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.SUPER_ADMIN, Role.ADMIN)
export class AdminSupportController {
  constructor(private readonly svc: AdminSupportService) {}
  @Get()
  getAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.svc.getTickets(page ? parseInt(page) : 1, limit ? parseInt(limit) : 50);
  }
}
`,
  'backend/src/admin/admin-marketing/admin-marketing.service.ts': `
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminMarketingService {
  constructor(private prisma: PrismaService) {}
  async getPromoCodes(page = 1, limit = 50) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.promoCode.findMany({ skip, take: limit, orderBy: { created_at: 'desc' } }),
      this.prisma.promoCode.count()
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }
}
`,
  'backend/src/admin/admin-marketing/admin-marketing.controller.ts': `
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AdminMarketingService } from './admin-marketing.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('admin/marketing/promocodes')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.SUPER_ADMIN, Role.ADMIN)
export class AdminMarketingController {
  constructor(private readonly svc: AdminMarketingService) {}
  @Get()
  getAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.svc.getPromoCodes(page ? parseInt(page) : 1, limit ? parseInt(limit) : 50);
  }
}
`,
  'backend/src/admin/admin-cms/admin-cms.service.ts': `
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminCmsService {
  constructor(private prisma: PrismaService) {}
  async getBanners(page = 1, limit = 50) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.banner.findMany({ skip, take: limit, orderBy: { display_order: 'asc' } }),
      this.prisma.banner.count()
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }
}
`,
  'backend/src/admin/admin-cms/admin-cms.controller.ts': `
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AdminCmsService } from './admin-cms.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('admin/cms/banners')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.SUPER_ADMIN, Role.ADMIN)
export class AdminCmsController {
  constructor(private readonly svc: AdminCmsService) {}
  @Get()
  getAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.svc.getBanners(page ? parseInt(page) : 1, limit ? parseInt(limit) : 50);
  }
}
`
};

Object.entries(services).forEach(([file, content]) => {
  fs.writeFileSync(file, content.trim());
  console.log('Generated ' + file);
});
