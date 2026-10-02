import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  
  async resetPassword(identifier: string, newPassword: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { phone: identifier },
          { email: identifier },
          { username: identifier }
        ]
      }
    });
    if (!user) throw new Error('User not found');
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { password_hash: hashedPassword }
    });
    return { success: true, message: 'Password updated successfully' };
  }

async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findFirst({
      where: {
        OR: [
          ...(dto.email ? [{ email: dto.email }] : []),
          ...(dto.phone ? [{ phone: dto.phone }] : []),
          ...(dto.username ? [{ username: dto.username }] : []),
        ],
      },
    });

    if (existing) {
      throw new ConflictException('User with this email, phone, or username already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.$transaction(async (tx) => {
      const refCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      const newUser = await tx.user.create({
        data: {
          username: dto.username,
          email: dto.email,
          phone: dto.phone,
          password_hash: hashedPassword,
          referral_code: refCode,
          available_spins: 1,
          has_registration_spin: true,
        },
      });

      await tx.wallet.create({
        data: { user_id: newUser.id },
      });

      if (dto.referralCode) {
        const referrer = await tx.user.findUnique({ where: { referral_code: dto.referralCode } });
        if (referrer) {
          await tx.user.update({
             where: { id: referrer.id },
             data: { available_spins: { increment: 2 } }
          });
          await tx.referral.create({
             data: { user_id: referrer.id, referred_user_id: newUser.id }
          });
        }
      }

      return newUser;
    });

    return this.generateTokens(user.id, user.role);
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: dto.identifier },
          { phone: dto.identifier },
          { username: dto.identifier }
        ],
      },
      include: { wallet: true }
    });

    if (!user) throw new UnauthorizedException('Invalid credentials');
    if (user.status === 'BLOCKED') throw new UnauthorizedException('Account is blocked');

    const isMatch = await bcrypt.compare(dto.password, user.password_hash);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    const tokens = await this.generateTokens(user.id, user.role);
    const { password_hash, wallet, ...safeUser } = user;
    return { 
      ...tokens, 
      user: {
        ...safeUser,
        balance: wallet ? wallet.balance.toNumber() : 0
      } 
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      return this.generateTokens(payload.sub, payload.role);
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { wallet: true }
    });
    if (!user) throw new UnauthorizedException();
    
    // Count today's withdrawals
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check Daily Login Draw
    let grantedDailySpin = false;
    let newSpins = user.available_spins;
    if (!user.last_login_spin_date || user.last_login_spin_date < today) {
      // Grant +1 daily spin
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          available_spins: { increment: 1 },
          last_login_spin_date: new Date()
        }
      });
      grantedDailySpin = true;
      newSpins += 1;
    }
    const todayWithdrawalsCount = await this.prisma.payment.count({
      where: {
        user_id: userId,
        type: 'WITHDRAWAL',
        created_at: { gte: today }
      }
    });

    const { password_hash, wallet, ...safeUser } = user;
    return {
      ...safeUser,
      balance: wallet ? wallet.balance.toNumber() : 0,
      bonus_balance: wallet ? wallet.bonus_balance.toNumber() : 0,
      today_withdrawals_count: todayWithdrawalsCount,
      available_spins: newSpins
    };
  }

  private async generateTokens(userId: string, role: string) {
    const payload = { sub: userId, role };
    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
      refresh_token: this.jwtService.sign(payload, { expiresIn: '30d' }),
    };
  }
}
