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
        // We also need the real full userId for updatedBalance later
        const user = await this.walletService.prisma.user.findFirst({ where: { id: { startsWith: partial } } });
        if (user) effectiveUserId = user.id;
      } else {
        balanceData = await this.walletService.getBalance(userId);
      }`;

webhookContent = webhookContent.replace(searchRegex, replacement);

// Also need to replace all `await this.walletService.getBalance(userId);` later in the file with `await this.walletService.getBalance(effectiveUserId);`
webhookContent = webhookContent.replace(/const updatedBalance = await this\.walletService\.getBalance\(userId\);/g, 'const updatedBalance = await this.walletService.getBalance(effectiveUserId);');

fs.writeFileSync(webhookFile, webhookContent);
