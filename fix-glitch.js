const fs = require('fs');
let code = fs.readFileSync('src/components/WithdrawScreen.tsx', 'utf8');
code = code.replace(/<div className="bg-gradient-to-r from-neutral-800 to-neutral-900 rounded-xl p-4 mb-6 border border-neutral-700 shadow-lg">\s*border-neutral-700 shadow-lg">/, '<div className="bg-gradient-to-r from-neutral-800 to-neutral-900 rounded-xl p-4 mb-6 border border-neutral-700 shadow-lg">');
fs.writeFileSync('src/components/WithdrawScreen.tsx', code);
