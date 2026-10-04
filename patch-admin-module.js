const fs = require('fs');
let code = fs.readFileSync('backend/src/admin/admin.module.ts', 'utf8');

code = code.replace(
  "import { AdminVipModule } from './admin-vip/admin-vip.module';",
  "import { AdminVipModule } from './admin-vip/admin-vip.module';\nimport { AdminNotificationsModule } from './admin-notifications/admin-notifications.module';"
);

code = code.replace(
  "AdminDashboardModule, AdminVipModule]",
  "AdminDashboardModule, AdminVipModule, AdminNotificationsModule]"
);

fs.writeFileSync('backend/src/admin/admin.module.ts', code);
console.log("Registered AdminNotificationsModule in AdminModule!");
