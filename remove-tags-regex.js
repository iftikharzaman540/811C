const fs = require('fs');
let code = fs.readFileSync('src/components/HomeScreen.tsx', 'utf8');

// Use regex to match the exact closing block, ignoring whitespace variations
code = code.replace(/<\/>\s*\)\s*\}/, '');

fs.writeFileSync('src/components/HomeScreen.tsx', code);
console.log("Removed rogue tags with regex");
