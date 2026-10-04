const fs = require("fs");

// 1. Revert JWT Strategy
const jwtContent = `import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'super-secret-key-for-gaming-app',
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, role: payload.role };
  }
}`;
fs.writeFileSync("/var/www/gaming-app/backend/src/auth/jwt.strategy.ts", jwtContent);

// 2. Revert Auth Controller
let authCtrl = fs.readFileSync("/var/www/gaming-app/backend/src/auth/auth.controller.ts", "utf8");
const oldLogout = `
  @Post('logout')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Logout user (Client should discard token)' })
  async logout() {
    return { message: 'Successfully logged out' };
  }`;
authCtrl = authCtrl.replace(/@Post\('logout'\)[\s\S]*?\{[\s\S]*?message: 'Successfully logged out' \};\s*\}/, oldLogout.trim());
fs.writeFileSync("/var/www/gaming-app/backend/src/auth/auth.controller.ts", authCtrl);

// 3. Revert Auth Service
let authService = fs.readFileSync("/var/www/gaming-app/backend/src/auth/auth.service.ts", "utf8");
const oldGenerateTokens = `
  private async generateTokens(userId: string, role: string) {
    const payload = { sub: userId, role };
    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
      refresh_token: this.jwtService.sign(payload, { expiresIn: '30d' }),
    };
  }`;
authService = authService.replace(/  private async generateTokens[\s\S]*?expiresIn: '30d' \}\),\s*\};\s*\}/, oldGenerateTokens.trim());
// Remove logout method
authService = authService.replace(/  async logout\(userId: string\) \{[\s\S]*?session_token: null \}\n    \}\);\n  \}\n\n/g, "");

fs.writeFileSync("/var/www/gaming-app/backend/src/auth/auth.service.ts", authService);
console.log("Backend logic reverted");
