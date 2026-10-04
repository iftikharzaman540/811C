import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminMarketingService {
  async getEvents() {
    let setting = await this.prisma.systemSetting.findUnique({ where: { key: 'promo_events' } });
    if (!setting) {
      const defaultEvents = [
        { id: 1, title: 'Invitation Event', desc: 'Each player you invite', highlight: 'Get Rs 600', icon: '??', category: 'Cooperation' }
      ];
      setting = await this.prisma.systemSetting.create({
        data: { key: 'promo_events', value: JSON.stringify(defaultEvents), description: 'Promo Events' }
      });
    }
    return JSON.parse(setting.value as string);
  }

  async updateEvents(data: any) {
    const setting = await this.prisma.systemSetting.upsert({
      where: { key: 'promo_events' },
      update: { value: JSON.stringify(data) },
      create: { key: 'promo_events', value: JSON.stringify(data), description: 'Promo Events' }
    });
    return JSON.parse(setting.value as string);
  }

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