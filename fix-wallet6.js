const fs = require('fs');
const file = 'backend/src/wallet/wallet.service.ts';
let code = fs.readFileSync(file, 'utf8');

// I will look for \n  async getBalance
// And remove everything between getWalletByPartialUserId and getBalance.
const indexStart = code.indexOf('async getWalletByPartialUserId');
const indexEnd = code.indexOf('async getBalance', indexStart);

const newMethod = `async getWalletByPartialUserId(partialId: string) {
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

  `;

code = code.substring(0, indexStart) + newMethod + code.substring(indexEnd);

// Also let's fix the literal \n that might be before async getBalance
code = code.replace(/\\n\s*async getBalance/g, '\n  async getBalance');

fs.writeFileSync(file, code);
