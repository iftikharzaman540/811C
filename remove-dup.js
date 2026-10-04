const fs = require('fs');
let code = fs.readFileSync('backend/src/payments/payments.service.ts', 'utf8');

const regex = /    \/\/ WAGERING REQUIREMENT CHECK[\s\S]*?throw new BadRequestException\(`You need to complete \$\{remaining\} PKR more in valid bets before you can withdraw.`\);\n    \}/;

if (code.match(regex)) {
  code = code.replace(regex, "");
  fs.writeFileSync('backend/src/payments/payments.service.ts', code);
  console.log("Removed duplicated wagering check");
} else {
  console.log("Could not find the duplicated block");
}
