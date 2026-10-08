const fs = require('fs');
let walletContent = fs.readFileSync('/var/www/gaming-app/backend/src/wallet/wallet.service.ts', 'utf8');

const regex = /\}\s*else\s*\{\s*await\s+tx\.user\.update\(\{\s*where:\s*\{\s*id:\s*user\.id\s*\},\s*data:\s*\{\s*total_wagered:\s*\{\s*increment:\s*betAmount\s*\}\s*\}\s*\}\);\s*\}\s*\}/m;

const replacement = `} else {
              await tx.user.update({ where: { id: user.id }, data: { total_wagered: { increment: betAmount } } });
          }
          
          // AUTO UPGRADE VIP LEVEL CHECK
          const newTotalWagered = Number(user.total_wagered || 0) + betAmount;
          const levels = await tx.vipLevel.findMany({ orderBy: { min_turnover: 'desc' } });
          const previousLevel = user.vip_level_id ? (levels.find(l => l.id === user.vip_level_id)?.level || 0) : 0;
          
          const highestQualified = levels.find(l => newTotalWagered >= Number(l.min_turnover || 0) && l.auto_upgrade);
          
          if (highestQualified && highestQualified.level > previousLevel) {
              await tx.user.update({
                  where: { id: user.id },
                  data: { vip_level_id: highestQualified.id }
              });
              await tx.vipHistory.create({
                  data: {
                      user_id: user.id,
                      previous_level: previousLevel,
                      new_level: highestQualified.level,
                      transaction_id: data.referenceId || 'AUTO_TURNOVER',
                      deposit_amount: 0,
                      total_deposit_after: newTotalWagered
                  }
              });
          }
      }`;

if (walletContent.match(regex)) {
  walletContent = walletContent.replace(regex, replacement);
  fs.writeFileSync('/var/www/gaming-app/backend/src/wallet/wallet.service.ts', walletContent);
  console.log('Patched wallet.service.ts with VIP upgrade logic');
} else {
  console.log('Regex did not match in wallet.service.ts');
}
