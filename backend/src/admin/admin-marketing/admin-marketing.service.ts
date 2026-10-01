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