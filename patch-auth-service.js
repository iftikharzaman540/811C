const fs = require('fs');
let code = fs.readFileSync('backend/src/auth/auth.service.ts', 'utf8');

// Add crypto import if not exists
if (!code.includes("import * as crypto")) {
  code = "import * as crypto from 'crypto';\n" + code;
}

// 1. In generateTokens, accept sessionId and update user
code = code.replace(
  /private async generateTokens\(userId: string, role: string\) \{[\s\S]*?const payload = \{ sub: userId, role \};\s*return \{[\s\S]*?access_token: this\.jwtService\.sign\(payload, \{ expiresIn: '7d' \}\),[\s\S]*?refresh_token: this\.jwtService\.sign\(payload, \{ expiresIn: '30d' \}\),[\s\S]*?\};\s*\}/,
  `private async generateTokens(userId: string, role: string, providedSessionId?: string) {
    const sessionId = providedSessionId || crypto.randomUUID();
    
    // Save to DB
    await this.prisma.user.update({
      where: { id: userId },
      data: { active_session_id: sessionId }
    });

    const payload = { sub: userId, role, session_id: sessionId };
    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
      refresh_token: this.jwtService.sign(payload, { expiresIn: '30d' }),
    };
  }`
);

// 2. We don't need to pass sessionId from login(), generateTokens will do it automatically now!
// Wait! What about refreshToken()? If the user refreshes their token, they should keep the same sessionId so they aren't logged out.
code = code.replace(
  /async refreshToken\(refreshToken: string\) \{[\s\S]*?try \{[\s\S]*?const payload = this\.jwtService\.verify\(refreshToken\);[\s\S]*?return this\.generateTokens\(payload\.sub, payload\.role\);[\s\S]*?\} catch \(e\) \{[\s\S]*?throw new UnauthorizedException\('Invalid refresh token'\);[\s\S]*?\}[\s\S]*?\}/,
  `async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      return this.generateTokens(payload.sub, payload.role, payload.session_id);
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }`
);

fs.writeFileSync('backend/src/auth/auth.service.ts', code);
console.log("Updated AuthService with session_id support!");
