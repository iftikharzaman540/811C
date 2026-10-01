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