const fs = require('fs');
const lines = fs.readFileSync('src/components/HomeScreen.tsx', 'utf8').split('\n');
console.log(lines.slice(799, 840).map((l, i) => `${i + 800}: ${l}`).join('\n'));
