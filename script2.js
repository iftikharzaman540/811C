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

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub }
    });

    if (!user || user.session_token !== payload.sessionId) {
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
    await this.authService.logout(user.userId);
    return { message: 'Successfully logged out' };
  }`;
authCtrl = authCtrl.replace(/@Post\('logout'\)[\s\S]*?\{[\s\S]*?message: 'Successfully logged out' \};\s*\}/, newLogout.trim());
fs.writeFileSync("/var/www/gaming-app/backend/src/auth/auth.controller.ts", authCtrl);

// 3. Auth Service
let authService = fs.readFileSync("/var/www/gaming-app/backend/src/auth/auth.service.ts", "utf8");
const newGenerateTokens = `
  private async generateTokens(userId: string, role: string) {
    const sessionToken = require('crypto').randomUUID();
    await this.prisma.user.update({
      where: { id: userId },
      data: { session_token: sessionToken }
    });

    const payload = { sub: userId, role, sessionId: sessionToken };
    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
      refresh_token: this.jwtService.sign(payload, { expiresIn: '30d' }),
    };
  }`;
authService = authService.replace(/private async generateTokens\(userId: string, role: string\) \{[\s\S]*?expiresIn: '30d' \}\),\s*\};\s*\}/, newGenerateTokens.trim());

const logoutCode = `
  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { session_token: null }
    });
  }

  async updateProfile(`;
authService = authService.replace(/async logout\([\s\S]*?\}\n\n  async updateProfile\(/, logoutCode);

fs.writeFileSync("/var/www/gaming-app/backend/src/auth/auth.service.ts", authService);
console.log("Files updated successfully");
