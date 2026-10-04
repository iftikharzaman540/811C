const fs = require('fs');
let code = fs.readFileSync('backend/src/games/games.callback.controller.ts', 'utf8');

const targetStr = `await this.walletService.processTransaction({
          walletId: wallet.wallet_id,
          amount: -parseFloat(amount), // Deduct bet
          type: TransactionType.BET,
          referenceId: transaction_id,
          description: \`Bet on game\`,
        });`;

const replacement = targetStr + `
        
        // Track wagering requirement
        if (parseFloat(amount) > 0) {
          await this.walletService.updateWageringCompleted(player_id, parseFloat(amount)).catch(e => console.error('Wagering error:', e));
        }`;

if (code.includes(targetStr)) {
  code = code.replace(targetStr, replacement);
  fs.writeFileSync('backend/src/games/games.callback.controller.ts', code);
  console.log("Patched games.callback.controller.ts");
} else {
  console.log("Could not find target string in games.callback.controller.ts");
}
