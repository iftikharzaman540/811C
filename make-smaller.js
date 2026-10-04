const fs = require('fs');
let code = fs.readFileSync('src/components/HomeScreen.tsx', 'utf8');

// 1. Reduce top space
code = code.replace(
  '<div className="max-w-md mx-auto relative pt-4">',
  '<div className="max-w-md mx-auto relative pt-1">'
);

// 2. Make squares smaller
code = code.replace(
  'className="w-full aspect-square rounded-[10px]',
  'className="w-[75%] aspect-square rounded-[8px]'
);

// 3. Make icons smaller to match
code = code.replace(/w-5 h-5 text-\[\#ffdf00\]/g, 'w-4 h-4 text-[#ffdf00]');

// 4. Make text a bit smaller if needed, or leave at 10px. 9px might be too small but let's do 9px.
code = code.replace(/text-\[10px\] font-medium/g, 'text-[9px] font-medium leading-tight');

fs.writeFileSync('src/components/HomeScreen.tsx', code);
