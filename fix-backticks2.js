const fs = require('fs');

function fixFile(file) {
  let c = fs.readFileSync(file, 'utf8');
  c = c.replace(/\\`/g, '`');
  fs.writeFileSync(file, c);
  console.log(`Fixed ${file}`);
}

fixFile('src/app/admin/users/[id]/page.tsx');
fixFile('src/app/admin/users/page.tsx');
fixFile('src/app/admin/finances/wallet-adjustments/page.tsx');
fixFile('src/app/admin/system/audit-logs/page.tsx');
