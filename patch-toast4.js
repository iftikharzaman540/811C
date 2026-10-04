const fs = require('fs');
let lines = fs.readFileSync('src/app/support/page.tsx', 'utf8').split('\\n');
if (lines[0].includes('import toast') && lines[1].includes('"use client"')) {
  let temp = lines[0];
  lines[0] = lines[1];
  lines[1] = temp;
}
fs.writeFileSync('src/app/support/page.tsx', lines.join('\\n'));
