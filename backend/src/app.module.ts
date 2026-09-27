import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { WalletModule } from './wallet/wallet.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { GameCategoriesModule } from './game-categories/game-categories.module';
import { GamesModule } from './games/games.module';
import { ProvidersModule } from './providers/providers.module';
import { GameSessionsModule } from './game-sessions/game-sessions.module';
import { GameHistoryModule } from './game-history/game-history.module';
import { AuditLogsModule } from './audit-logs/audit-logs.module';
import { AdminUsersModule } from './admin-users/admin-users.module';
import { AdminWalletModule } from './admin-wallet/admin-wallet.module';
import { AdminFinancialsModule } from './admin-financials/admin-financials.module';
import { AdminDashboardModule } from './admin-dashboard/admin-dashboard.module';
import { PaymentsModule } from './payments/payments.module';
import { NotificationsModule } from './notifications/notifications.module';
import { QueuesModule } from './queues/queues.module';
import { GregmornModule } from './gregmorn/gregmorn.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    WalletModule,
    UsersModule,
    GameCategoriesModule,
    GamesModule,
    ProvidersModule,
    GameSessionsModule,
    GameHistoryModule,
    AuditLogsModule,
    AdminUsersModule,
    AdminWalletModule,
    AdminFinancialsModule,
    AdminDashboardModule,
    PaymentsModule,
    NotificationsModule,
    QueuesModule,
    GregmornModule
  ],
})
export class AppModule {}
