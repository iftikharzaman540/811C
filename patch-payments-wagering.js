const fs = require('fs');
let code = fs.readFileSync('backend/src/payments/payments.service.ts', 'utf8');

const regex = /if \(\!user\.withdrawals_enabled\) \{[\s\S]*?\}/;
const match = code.match(regex);

if (match) {
  const replacement = match[0] + `
    
    // WAGERING REQUIREMENT CHECK
    const req = Number(user.current_wagering_requirement || 0);
    const comp = Number(user.current_wagering_completed || 0);
    if (req > 0 && comp < req) {
      const remaining = req - comp;
      throw new BadRequestException(\`You need to complete \${remaining} PKR more in valid bets before you can withdraw.\`);
    }`;
  
  code = code.replace(regex, replacement);
  fs.writeFileSync('backend/src/payments/payments.service.ts', code);
  console.log("Patched payments.service.ts via regex");
} else {
  console.log("Could not find target via regex");
}
