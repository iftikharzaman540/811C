const fs = require('fs');
let code = fs.readFileSync('backend/src/admin/admin-vip/admin-vip.controller.ts', 'utf8');
code = code.replace(/@Controller\('admin\/vip'\)/, "@Controller('api/v1/admin/vip')");
fs.writeFileSync('backend/src/admin/admin-vip/admin-vip.controller.ts', code);
console.log("Updated controller route!");
