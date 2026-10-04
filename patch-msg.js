const fs = require('fs');
let code = fs.readFileSync('backend/src/payments/payments.service.ts', 'utf8');

code = code.replace(
  /throw new BadRequestException\(`Wagering requirement incomplete\. Play PKR \$\{req - comp\} more to withdraw\.`\);/g,
  "throw new BadRequestException(`You need to complete ${req - comp} PKR more in valid bets before you can withdraw.`);"
);

fs.writeFileSync('backend/src/payments/payments.service.ts', code);
console.log("Updated error message");
