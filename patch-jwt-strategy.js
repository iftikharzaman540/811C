const fs = require('fs');
let code = fs.readFileSync('backend/src/auth/jwt.strategy.ts', 'utf8');

const replacement = `
import { ExtractJwt, Strategy } from 'passport-jwt';
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
    if (payload.session_id) {
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        select: { active_session_id: true }
      });
      if (!user || user.active_session_id !== payload.session_id) {
        throw new UnauthorizedException('Your account has been logged in on another device.');
      }
    }
    
    return { userId: payload.sub, role: payload.role, session_id: payload.session_id };
  }
}
`;

fs.writeFileSync('backend/src/auth/jwt.strategy.ts', replacement.trim());
console.log("Updated JWT strategy!");
