const fs = require('fs');
let code = fs.readFileSync('src/components/DepositScreen.tsx', 'utf8');

const regex = /\{\s*tab === "online" \? \([\s\S]*?(<div className="mb-6">\s*<div className="grid grid-cols-2 gap-3 mb-2">[\s\S]*?<\/div>\s*<\/div>)\s*\)\s*:\s*\([\s\S]*?Click to switch[\s\S]*?<\/div>\s*\)\s*\}/;
code = code.replace(regex, '$1');

// Remove Cryptocurrency entirely
code = code.replace(/<span className="text-sm font-medium">Cryptocurrency<\/span>/, '');

fs.writeFileSync('src/components/DepositScreen.tsx', code);
console.log("Patched DepositScreen.tsx partially");
