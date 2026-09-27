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
      const newUser = await tx.user.create({
        data: {
          username: dto.username,
          email: dto.email,
          phone: dto.phone,
          password_hash: hashedPassword,
        },
      });

      await tx.wallet.create({
        data: { user_id: newUser.id },
      });

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
    
    const { password_hash, wallet, ...safeUser } = user;
    return {
      ...safeUser,
      balance: wallet ? wallet.balance.toNumber() : 0
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
