const fs = require('fs');
let code = fs.readFileSync('backend/src/gregmorn/gregmorn-webhook.controller.ts', 'utf8');

const targetStr = `const netAmount = winAmount - betAmount;`;
const replacement = `const netAmount = winAmount - betAmount;
          
          // Track wagering requirement
          if (betAmount > 0) {
            await this.walletService.updateWageringCompleted(effectiveUserId, betAmount).catch(e => this.logger.error('Wagering update error:', e));
          }`;

if (code.includes(targetStr)) {
  code = code.replace(targetStr, replacement);
  fs.writeFileSync('backend/src/gregmorn/gregmorn-webhook.controller.ts', code);
  console.log("Patched gregmorn-webhook.controller.ts");
} else {
  console.log("Could not find target string in gregmorn-webhook.controller.ts");
}
