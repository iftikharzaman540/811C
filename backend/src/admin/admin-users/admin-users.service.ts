import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class AdminUsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(page: number = 1, limit: number = 20, search?: string) {
    const skip = (page - 1) * limit;
    
    const where: Prisma.UserWhereInput = search
      ? {
          OR: [
            { username: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
            { id: { contains: search } }
          ],
        }
      : {};

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
        include: {
          wallet: { select: { balance: true, bonus_balance: true } }
        }
      }),
      this.prisma.user.count({ where })
    ]);

    return {
      data: users,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        wallet: true,
        kyc_documents: true,
        vip_level: true,
      }
    });

    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateUser(id: string, updateData: any, adminId: string) {
    // 1. Get old user data for audit log
    const oldUser = await this.prisma.user.findUnique({ where: { id } });
    if (!oldUser) throw new NotFoundException('User not found');

    // 2. Update user
    const newUser = await this.prisma.user.update({
      where: { id },
      data: updateData
    });

    // 3. Log action
    await this.prisma.auditLog.create({
      data: {
        admin_id: adminId,
        user_id: id,
        action: 'UPDATE_USER_PROFILE',
        entity: 'User',
        entity_id: id,
        old_value: oldUser as any,
        new_value: newUser as any,
      }
    });

    return newUser;
  }
}
