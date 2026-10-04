const fs = require('fs');
let code = fs.readFileSync('src/components/DepositScreen.tsx', 'utf8');

const regex = /\{\/\* Tabs \*\/\}[\s\S]*?<\/button>\s*<\/div>/;
code = code.replace(regex, '{/* Tabs */}');

fs.writeFileSync('src/components/DepositScreen.tsx', code);
console.log("Patched syntax error");
