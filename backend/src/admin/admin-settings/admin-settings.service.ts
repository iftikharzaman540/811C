import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class AdminSettingsService {
  constructor(private prisma: PrismaService) {}

  async getAuditLogs(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    
    const [logs, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
        include: {
          admin: { select: { email: true, username: true } },
          user: { select: { email: true, username: true } }
        }
      }),
      this.prisma.auditLog.count()
    ]);

    return {
      data: logs,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  // System Settings CRUD
  async getSettings() {
    return this.prisma.systemSetting.findMany({ orderBy: { key: 'asc' } });
  }

  async updateSetting(key: string, value: string, description?: string) {
    return this.prisma.systemSetting.upsert({
      where: { key },
      update: { value, ...(description && { description }) },
      create: { key, value, description: description || '' }
    });
  }

  async deleteSetting(key: string) {
    return this.prisma.systemSetting.delete({ where: { key } });
  }
}
