const fs = require('fs');

const walletFile = 'backend/src/wallet/wallet.service.ts';
let walletContent = fs.readFileSync(walletFile, 'utf8');

// Use regex to completely rip out everything from getWalletByPartialUserId until getBalance
walletContent = walletContent.replace(/async getWalletByPartialUserId[\s\S]*?async getBalance\(userId: string\) \{/, 
\`async getWalletByPartialUserId(partialId: string) {
    const user = await this.prisma.user.findFirst({
      where: { id: { startsWith: partialId } },
      include: { wallet: true }
    });
    if (!user || !user.wallet) throw new BadRequestException('Wallet not found');
    return {
      wallet_id: user.wallet.id,
      balance: user.wallet.balance.toNumber(),
      bonus_balance: user.wallet.bonus_balance.toNumber(),
      currency: user.wallet.currency,
      user_id: user.id
    };
  }

  async getBalance(userId: string) {\`
);
fs.writeFileSync(walletFile, walletContent);
