const fs = require('fs');
let code = fs.readFileSync('backend/src/admin/admin.module.ts', 'utf8');

code = code.replace(
  "import { AdminDashboardModule } from './admin-dashboard/admin-dashboard.module';",
  "import { AdminDashboardModule } from './admin-dashboard/admin-dashboard.module';\nimport { AdminVipModule } from './admin-vip/admin-vip.module';"
);

code = code.replace(
  "imports: [AdminUsersModule, AdminFinancesModule, AdminSettingsModule, AdminCmsModule, AdminSupportModule, AdminMarketingModule, AdminKycModule, AdminDashboardModule]",
  "imports: [AdminUsersModule, AdminFinancesModule, AdminSettingsModule, AdminCmsModule, AdminSupportModule, AdminMarketingModule, AdminKycModule, AdminDashboardModule, AdminVipModule]"
);

fs.writeFileSync('backend/src/admin/admin.module.ts', code);
console.log("Registered AdminVipModule in AdminModule!");
