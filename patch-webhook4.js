const fs = require('fs');

const webhookFile = 'backend/src/gregmorn/gregmorn-webhook.controller.ts';
let webhookContent = fs.readFileSync(webhookFile, 'utf8');

const searchRegex = /const userId = login; \/\/ As per our openGame logic[\s\S]*?const balanceData = await this\.walletService\.getBalance\(userId\);/;

const replacement = `const userId = login; // As per our openGame logic

    try {
      // Find wallet balance
      let balanceData;
      let effectiveUserId = userId;
      if (userId.startsWith('Player_')) {
        const partial = userId.replace('Player_', '');
        balanceData = await this.walletService.getWalletByPartialUserId(partial);
        effectiveUserId = balanceData.user_id; // Added user_id to getWalletByPartialUserId return
      } else {
        balanceData = await this.walletService.getBalance(userId);
      }`;

webhookContent = webhookContent.replace(searchRegex, replacement);

webhookContent = webhookContent.replace(/const updatedBalance = await this\.walletService\.getBalance\(userId\);/g, 'const updatedBalance = await this.walletService.getBalance(effectiveUserId);');

fs.writeFileSync(webhookFile, webhookContent);

const walletFile = 'backend/src/wallet/wallet.service.ts';
let walletContent = fs.readFileSync(walletFile, 'utf8');

walletContent = walletContent.replace(/async getWalletByPartialUserId[^{]+{/, `async getWalletByPartialUserId(partialId: string) {
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
  async dummy() {`);
fs.writeFileSync(walletFile, walletContent.replace('async dummy() {', ''));

