const fs = require('fs');

const walletServiceFile = 'backend/src/wallet/wallet.service.ts';
let walletContent = fs.readFileSync(walletServiceFile, 'utf8');
const methodToAdd = `
  async getWalletByPartialUserId(partialId: string) {
    const user = await this.prisma.user.findFirst({
      where: { id: { startsWith: partialId } }
    });
    if (!user) throw new BadRequestException('Wallet not found');
    return this.getBalance(user.id);
  }
`;
if (!walletContent.includes('getWalletByPartialUserId')) {
  walletContent = walletContent.replace('async getBalance(userId: string) {', methodToAdd + '\\n  async getBalance(userId: string) {');
  fs.writeFileSync(walletServiceFile, walletContent);
}

const webhookFile = 'backend/src/gregmorn/gregmorn-webhook.controller.ts';
let webhookContent = fs.readFileSync(webhookFile, 'utf8');
webhookContent = webhookContent.replace(
  'const userId = login; // As per our openGame logic\\n\\n    try {\\n      // Find wallet balance\\n      const balanceData = await this.walletService.getBalance(userId);',
  `let userId = login; // As per our openGame logic

    try {
      // Find wallet balance
      let balanceData;
      if (userId.startsWith('Player_')) {
        balanceData = await this.walletService.getWalletByPartialUserId(userId.replace('Player_', ''));
      } else {
        balanceData = await this.walletService.getBalance(userId);
      }`
);
fs.writeFileSync(webhookFile, webhookContent);
