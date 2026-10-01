const fs = require('fs');
const file = 'backend/src/gregmorn/gregmorn-webhook.controller.ts';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(
  'const userId = login; // As per our openGame logic',
  `let userId = login;
      if (userId.startsWith('Player_')) {
        const partialId = userId.replace('Player_', '');
        const u = await this.walletService.prisma.user.findFirst({ where: { id: { startsWith: partialId } } });
        if (u) userId = u.id;
      }`
);
fs.writeFileSync(file, content);
