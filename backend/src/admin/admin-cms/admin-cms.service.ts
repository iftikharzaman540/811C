import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminCmsService {
  constructor(private prisma: PrismaService) {}

  // BANNERS
  async getBanners(page = 1, limit = 50) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.banner.findMany({ skip, take: limit, orderBy: { display_order: 'asc' } }),
      this.prisma.banner.count()
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async createBanner(data: any) {
    // If we want to automatically set display_order to the last + 1
    if (data.display_order === undefined) {
      const lastBanner = await this.prisma.banner.findFirst({ orderBy: { display_order: 'desc' } });
      data.display_order = lastBanner ? lastBanner.display_order + 1 : 0;
    }
    return this.prisma.banner.create({ data });
  }

  async updateBanner(id: string, data: any) {
    return this.prisma.banner.update({ where: { id }, data });
  }

  async deleteBanner(id: string) {
    return this.prisma.banner.delete({ where: { id } });
  }

  // PAGES
  async getPages(page = 1, limit = 50) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.page.findMany({ skip, take: limit, orderBy: { created_at: 'desc' } }),
      this.prisma.page.count()
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async createPage(data: any) {
    return this.prisma.page.create({ data });
  }

  async updatePage(id: string, data: any) {
    return this.prisma.page.update({ where: { id }, data });
  }

  async deletePage(id: string) {
    return this.prisma.page.delete({ where: { id } });
  }
}