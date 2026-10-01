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