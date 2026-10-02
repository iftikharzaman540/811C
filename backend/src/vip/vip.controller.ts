import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PrismaService } from '../prisma/prisma.service';

@Controller('vip')
@UseGuards(JwtAuthGuard)
export class VipController {
  constructor(private prisma: PrismaService) {}

  @Get('status')
  async getStatus(@Request() req) {
    const user = await this.prisma.user.findUnique({
      where: { id: req.user.id },
      include: { vip_level: true }
    });

    const levels = await this.prisma.vipLevel.findMany({ orderBy: { level: 'asc' } });
    const currentLevel = user.vip_level || levels[0];
    
    // Find next level
    const nextLevel = levels.find(l => l.level > (currentLevel?.level || 0));

    return {
      currentLevel: currentLevel?.level || 1,
      totalDeposited: user.total_deposited.toNumber(),
      nextLevel: nextLevel ? nextLevel.level : null,
      requiredForNext: nextLevel ? nextLevel.min_deposit.toNumber() : null,
      remaining: nextLevel ? Math.max(0, nextLevel.min_deposit.toNumber() - user.total_deposited.toNumber()) : 0
    };
  }
}
