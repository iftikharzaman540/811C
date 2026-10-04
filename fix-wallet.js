const fs = require('fs');

const walletFile = 'backend/src/wallet/wallet.service.ts';
let walletContent = fs.readFileSync(walletFile, 'utf8');

walletContent = walletContent.replace(/\\n\s*async getBalance/g, '\n  async getBalance');

const searchBadMethod = `async getWalletByPartialUserId(partialId: string) {
    const user = await this.prisma.user.findFirst({
      where: { id: { startsWith: partialId } }
    });
    if (!user) throw new BadRequestException('Wallet not found');
    return this.getBalance(user.id);
  }`;

const correctMethod = `async getWalletByPartialUserId(partialId: string) {
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
  }`;

walletContent = walletContent.replace(searchBadMethod, correctMethod);
fs.writeFileSync(walletFile, walletContent);
