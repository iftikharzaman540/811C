const fs = require('fs');
let code = fs.readFileSync('src/components/WithdrawScreen.tsx', 'utf8');

code = code.replace(/toast\.error\("Minimum withdrawal is 500"\);/g, 'toast.error("Minimum withdrawal is 100");');
code = code.replace(/placeholder="Minimum 500"/g, 'placeholder="Minimum 100"');
code = code.replace(/Withdrawal amount range: 500-500,000/g, 'Withdrawal amount range: 100-50,000');
code = code.replace(/Withdrawal amount range: 500-50,000/g, 'Withdrawal amount range: 100-50,000');

fs.writeFileSync('src/components/WithdrawScreen.tsx', code);
console.log("Fully patched withdraw limits");
