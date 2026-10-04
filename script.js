const fs = require("fs");

// 1. JWT Strategy
const jwtContent = `import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'super-secret-key-for-gaming-app',
    });
  }

  async validate(payload: any) {
    if (!payload.sessionId) {
      throw new UnauthorizedException('Your account has been logged in from another device.');
    }

    const session = await this.prisma.session.findUnique({
      where: { id: payload.sessionId }
    });

    if (!session || !session.is_active || session.status !== 'ACTIVE') {
      throw new UnauthorizedException('Your account has been logged in from another device.');
    }

    return { userId: payload.sub, role: payload.role, sessionId: payload.sessionId };
  }
}`;
fs.writeFileSync("/var/www/gaming-app/backend/src/auth/jwt.strategy.ts", jwtContent);

// 2. Auth Controller
let authCtrl = fs.readFileSync("/var/www/gaming-app/backend/src/auth/auth.controller.ts", "utf8");
const newLogout = `
  @Post('logout')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Logout user (Invalidate session)' })
  async logout(@CurrentUser() user: any) {
    await this.service.logout(user.userId, user.sessionId);
    return { message: 'Successfully logged out' };
  }`;
authCtrl = authCtrl.replace(/@Post\('logout'\)[\s\S]*?\{[\s\S]*?message: 'Successfully logged out' \};\s*\}/, newLogout.trim());
fs.writeFileSync("/var/www/gaming-app/backend/src/auth/auth.controller.ts", authCtrl);

// 3. Auth Service
let authService = fs.readFileSync("/var/www/gaming-app/backend/src/auth/auth.service.ts", "utf8");

const newGenerateTokens = `
  private async generateTokens(userId: string, role: string) {
    await this.prisma.session.updateMany({
      where: { user_id: userId, is_active: true },
      data: { is_active: false, status: 'CLOSED' }
    });

    const session = await this.prisma.session.create({
      data: {
        user_id: userId,
        session_token: require('crypto').randomUUID(),
        is_active: true,
        provider: 'LOCAL',
        status: 'ACTIVE'
      }
    });

    const payload = { sub: userId, role, sessionId: session.id };
    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
      refresh_token: this.jwtService.sign(payload, { expiresIn: '30d' }),
    };
  }`;
authService = authService.replace(/private async generateTokens\(userId: string, role: string\) \{[\s\S]*?expiresIn: '30d' \}\),\s*\};\s*\}/, newGenerateTokens.trim());

const logoutCode = `
  async logout(userId: string, sessionId?: string) {
    if (sessionId) {
      await this.prisma.session.updateMany({
        where: { id: sessionId },
        data: { is_active: false, status: 'CLOSED' }
      });
    } else {
      await this.prisma.session.updateMany({
        where: { user_id: userId, is_active: true },
        data: { is_active: false, status: 'CLOSED' }
      });
    }
  }

  async updateProfile(`;
if (!authService.includes("async logout(userId:")) {
  authService = authService.replace(/async updateProfile\(/, logoutCode);
}
fs.writeFileSync("/var/www/gaming-app/backend/src/auth/auth.service.ts", authService);
console.log("Done");
