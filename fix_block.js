const fs = require('fs');
let content = fs.readFileSync('src/app/support/page.tsx', 'utf8');

content = content.replace(/ transition-colors block w-full/g, ' transition-colors w-full');

fs.writeFileSync('src/app/support/page.tsx', content);
console.log('Done');
