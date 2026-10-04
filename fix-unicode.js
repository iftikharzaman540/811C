const fs = require('fs');
let code = fs.readFileSync('src/components/DepositScreen.tsx', 'utf8');

// Replace corrupted bytes with >=
code = code.replace(/%/g, '>=');
// Also check for the corrupted coin symbol:
code = code.replace(/~/g, 'C'); // the C symbol
code = code.replace(/s/g, '?'); // lightning

fs.writeFileSync('src/components/DepositScreen.tsx', code);
console.log("Fixed corrupted unicode characters");
