const fs = require('fs');

const walletFile = 'backend/src/wallet/wallet.service.ts';
let walletContent = fs.readFileSync(walletFile, 'utf8');

// I will literally find the string block and replace it correctly.
const toReplace = `  async getWalletByPartialUserId(partialId: string) {
    const user = await this.prisma.user.findFirst({
      where: { id: { startsWith: partialId } }
    });
    if (!user) throw new BadRequestException('Wallet not found');
    return this.getBalance(user.id);
  }
\\n  async getBalance(userId: string) {`;

const newCode = `  async getWalletByPartialUserId(partialId: string) {
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

  async getBalance(userId: string) {`;

walletContent = walletContent.replace(toReplace, newCode);
fs.writeFileSync(walletFile, walletContent);
