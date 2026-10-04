const fs = require('fs');
let code = fs.readFileSync('src/components/DepositScreen.tsx', 'utf8');

const regex = /\{\/\* Deposit Promotion \*\/\}[\s\S]*?(?=\{\/\* INSTRUCTIONS ADDED AT THE BOTTOM \*\/})/g;
code = code.replace(regex, '');

fs.writeFileSync('src/components/DepositScreen.tsx', code);
console.log("Removed Deposit Promotion block!");
