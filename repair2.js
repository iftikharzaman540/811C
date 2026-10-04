import * as fs from 'fs';

const walletFile = 'backend/src/wallet/wallet.service.ts';
let walletContent = fs.readFileSync(walletFile, 'utf8');

const newMethod = `
  async getWalletByPartialUserId(partialId: string) {
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

if (!walletContent.includes('getWalletByPartialUserId')) {
  walletContent = walletContent.replace(
    'async getBalance(userId: string) {',
    newMethod + '\n  async getBalance(userId: string) {'
  );
  fs.writeFileSync(walletFile, walletContent);
}

const webhookFile = 'backend/src/gregmorn/gregmorn-webhook.controller.ts';
let webhookContent = fs.readFileSync(webhookFile, 'utf8');

webhookContent = webhookContent.replace(
  'const balanceData = await this.walletService.getBalance(userId);',
  `let balanceData;
      let effectiveUserId = userId;
      if (userId.startsWith('Player_')) {
        const partial = userId.replace('Player_', '');
        balanceData = await this.walletService.getWalletByPartialUserId(partial);
        effectiveUserId = balanceData.user_id;
      } else {
        balanceData = await this.walletService.getBalance(userId);
      }`
);

webhookContent = webhookContent.replace(
  /const updatedBalance = await this\.walletService\.getBalance\(userId\);/g,
  `const updatedBalance = await this.walletService.getBalance(effectiveUserId);`
);

fs.writeFileSync(webhookFile, webhookContent);
