import { Module } from '@nestjs/common';
import { AdminUsersModule } from './admin-users/admin-users.module';
import { AdminFinancesModule } from './admin-finances/admin-finances.module';
import { AdminSettingsModule } from './admin-settings/admin-settings.module';
import { AdminCmsModule } from './admin-cms/admin-cms.module';
import { AdminSupportModule } from './admin-support/admin-support.module';
import { AdminMarketingModule } from './admin-marketing/admin-marketing.module';
import { AdminKycModule } from './admin-kyc/admin-kyc.module';
import { AdminDashboardModule } from './admin-dashboard/admin-dashboard.module';

@Module({
  imports: [AdminUsersModule, AdminFinancesModule, AdminSettingsModule, AdminCmsModule, AdminSupportModule, AdminMarketingModule, AdminKycModule, AdminDashboardModule]
})
export class AdminModule {}
