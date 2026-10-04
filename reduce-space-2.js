const fs = require('fs');
let code = fs.readFileSync('src/components/HomeScreen.tsx', 'utf8');
code = code.replace(
  '<div className="relative px-0 mb-8">',
  '<div className="relative px-0 mb-2">'
);
fs.writeFileSync('src/components/HomeScreen.tsx', code);
