const { Client } = require('ssh2'); 
const conn = new Client(); 
conn.on('ready', () => { 
  const newContent = `import { ExtractJwt, Strategy } from 'passport-jwt';
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
}
`;
  conn.exec(`cat > /var/www/gaming-app/backend/src/auth/jwt.strategy.ts`, (err, stream) => { 
    stream.write(newContent);
    stream.end();
    console.log('jwt.strategy.ts updated');
    conn.end();
  }); 
}).connect({host:'169.58.50.184',port:22,username:'root',password:'Iftkharzaman'});
