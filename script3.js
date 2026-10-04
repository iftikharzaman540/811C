const fs = require("fs");
let authService = fs.readFileSync("/var/www/gaming-app/backend/src/auth/auth.service.ts", "utf8");

const missingMethods = `
  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { session_token: null }
    });
  }

  async updateProfile(userId: string, data: any) {
    const updateData: any = {};
    if (data.avatar !== undefined) updateData.avatar = data.avatar;
    if (data.nickname !== undefined) updateData.nickname = data.nickname;
    if (data.username !== undefined) updateData.username = data.username;
    if (data.whatsapp !== undefined) updateData.whatsapp = data.whatsapp;
    if (data.facebook !== undefined) updateData.facebook = data.facebook;
    if (data.telegram !== undefined) updateData.telegram = data.telegram;
    if (data.twitter !== undefined) updateData.twitter = data.twitter;
    if (data.date_of_birth !== undefined) updateData.date_of_birth = new Date(data.date_of_birth);
    
    if (data.username) {
       const existing = await this.prisma.user.findFirst({ where: { username: data.username, id: { not: userId } } });
       if (existing) throw new ConflictException('Display name (username) already taken');
    }

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: updateData
    });
    const { password_hash, ...safeUser } = user;
    return safeUser;
  }
}
`;

authService = authService.replace(/  private async generateTokens[\s\S]*?\}\n\}\n?$/, `  private async generateTokens(userId: string, role: string) {
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
  }\n${missingMethods}`);

fs.writeFileSync("/var/www/gaming-app/backend/src/auth/auth.service.ts", authService);
console.log("auth.service.ts fully updated");
