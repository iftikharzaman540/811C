const fs = require('fs');

let authService = fs.readFileSync('backend/src/auth/auth.service.ts', 'utf8');

const searchGetMe = `
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
`;

const replaceGetMe = `
  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { wallet: true }
    });
    if (!user) throw new UnauthorizedException();
    
    // Count today's withdrawals
    const today = new Date();
    today.setHours(0, 0, 0, 0);
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
      today_withdrawals_count: todayWithdrawalsCount
    };
  }
`;

authService = authService.replace(
  /async getMe\(userId: string\) \{[\s\S]*?balance: wallet \? wallet\.balance\.toNumber\(\) : 0\s*\};\s*\}/m, 
  replaceGetMe.trim()
);

fs.writeFileSync('backend/src/auth/auth.service.ts', authService);
console.log("Auth service patched with today_withdrawals_count.");
