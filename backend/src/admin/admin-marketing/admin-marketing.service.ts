import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminMarketingService {
  constructor(private prisma: PrismaService) {}

  // PROMO CODES
  async getPromoCodes(page = 1, limit = 50) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.promoCode.findMany({ skip, take: limit, orderBy: { created_at: 'desc' } }),
      this.prisma.promoCode.count()
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async createPromoCode(data: any) {
    return this.prisma.promoCode.create({ data });
  }

  async updatePromoCode(id: string, data: any) {
    return this.prisma.promoCode.update({ where: { id }, data });
  }

  async deletePromoCode(id: string) {
    return this.prisma.promoCode.delete({ where: { id } });
  }

  // BONUSES
  async getBonuses(page = 1, limit = 50) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.bonusConfiguration.findMany({ skip, take: limit, orderBy: { created_at: 'desc' } }),
      this.prisma.bonusConfiguration.count()
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async createBonus(data: any) {
    return this.prisma.bonusConfiguration.create({ data });
  }

  async updateBonus(id: string, data: any) {
    return this.prisma.bonusConfiguration.update({ where: { id }, data });
  }

  async deleteBonus(id: string) {
    return this.prisma.bonusConfiguration.delete({ where: { id } });
  }

  // AFFILIATES (REFERRALS)
  async getAffiliates(page = 1, limit = 50) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.referral.findMany({
        skip, 
        take: limit, 
        orderBy: { created_at: 'desc' },
        include: {
          user: { select: { id: true, username: true, email: true } },
          referred_user: { select: { id: true, username: true, email: true } }
        }
      }),
      this.prisma.referral.count()
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }
}