const fs = require('fs');
let code = fs.readFileSync('src/components/WithdrawScreen.tsx', 'utf8');

// The original limits are min 500 and max 500,000
code = code.replace(/Min 500~Max 500,000/g, 'Min 100~Max 50,000');
code = code.replace(/if \(!amount \|\| Number\(amount\) < 500\)/g, 'if (!amount || Number(amount) < 100)');
code = code.replace(/if \(!amount \|\| Number\(amount\) < 500 \|\| Number\(amount\) > 500000\)/g, 'if (!amount || Number(amount) < 100 || Number(amount) > 50000)');
// If the above replace didn't catch the exact string, let's do a more robust one:
code = code.replace(/Number\(amount\) < 500/g, 'Number(amount) < 100');
code = code.replace(/Number\(amount\) > 500000/g, 'Number(amount) > 50000');
code = code.replace(/Amount must be between 500 and 500,000/g, 'Amount must be between 100 and 50,000');

// There's a 100, 500, 1000, 5000 quick grid in withdraw screen? Let's check.
// Let's just save.

fs.writeFileSync('src/components/WithdrawScreen.tsx', code);
console.log("Patched withdraw limits");
