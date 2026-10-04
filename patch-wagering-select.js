const fs = require('fs');
let code = fs.readFileSync('backend/src/admin-users/admin-users.service.ts', 'utf8');

const target = `total_deposited: true,`;
const replacement = `total_deposited: true, current_wagering_requirement: true, current_wagering_completed: true,`;

code = code.replace(target, replacement);

fs.writeFileSync('backend/src/admin-users/admin-users.service.ts', code);
// Also update the other one just in case
if(fs.existsSync('backend/src/admin/admin-users/admin-users.service.ts')) {
  let code2 = fs.readFileSync('backend/src/admin/admin-users/admin-users.service.ts', 'utf8');
  code2 = code2.replace(target, replacement);
  fs.writeFileSync('backend/src/admin/admin-users/admin-users.service.ts', code2);
}
console.log("Patched admin-users.service.ts to include wagering info");
