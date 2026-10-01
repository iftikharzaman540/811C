const fs = require('fs');

const schemaFile = 'backend/prisma/schema.prisma';
let schema = fs.readFileSync(schemaFile, 'utf8');

// 1. Update User model
const userInsert = `
  // Account Restrictions
  casino_enabled      Boolean @default(true)
  sportsbook_enabled  Boolean @default(true)
  deposits_enabled    Boolean @default(true)
  withdrawals_enabled Boolean @default(true)
  bonuses_enabled     Boolean @default(true)
  
  // Admin Notes
  internal_notes      String?
  
  // KYC & VIP
  kyc_status          KycStatus @default(UNVERIFIED)
  vip_level_id        String?
  vip_level           VipLevel? @relation(fields: [vip_level_id], references: [id])
  
  // Relations
  kyc_documents       KycDocument[]
  tickets             Ticket[]
  ticket_messages     TicketMessage[]
  user_bonuses        UserBonus[]
  promo_code_usages   PromoCodeUsage[]
`;

schema = schema.replace(
  '  wallet        Wallet?',
  userInsert + '\\n  wallet        Wallet?'
);

// 2. Define New Enums
const enums = `
enum KycStatus {
  UNVERIFIED
  PENDING
  APPROVED
  REJECTED
  DOCUMENTS_REQUESTED
}

enum TicketStatus {
  OPEN
  IN_PROGRESS
  CLOSED
  RESOLVED
}
`;

// Insert enums at the top before the models
schema = schema.replace('enum Role {', enums + '\\n\\nenum Role {');

// 3. Append New Models at the end
const newModels = `
// ====================
// PHASE 5 - ADMIN PANEL MODELS
// ====================

model VipLevel {
  id                  String   @id @default(uuid())
  level               Int      @unique
  name                String
  min_deposit         Decimal  @default(0.00) @db.Decimal(15, 2)
  cashback_percentage Decimal  @default(0.00) @db.Decimal(5, 2)
  benefits            Json?
  
  created_at          DateTime @default(now())
  updated_at          DateTime @updatedAt
  
  users               User[]
}

model KycDocument {
  id              String   @id @default(uuid())
  user_id         String
  user            User     @relation(fields: [user_id], references: [id], onDelete: Cascade)
  document_type   String   // ID_CARD, PASSPORT, UTILITY_BILL
  front_image     String
  back_image      String?
  status          KycStatus @default(PENDING)
  rejection_reason String?
  
  created_at      DateTime @default(now())
  updated_at      DateTime @updatedAt

  @@index([user_id])
  @@index([status])
}

model Ticket {
  id          String         @id @default(uuid())
  user_id     String
  user        User           @relation(fields: [user_id], references: [id], onDelete: Cascade)
  subject     String
  category    String         // DEPOSIT, WITHDRAWAL, KYC, BONUS, OTHER
  status      TicketStatus   @default(OPEN)
  
  created_at  DateTime       @default(now())
  updated_at  DateTime       @updatedAt
  
  messages    TicketMessage[]

  @@index([user_id])
  @@index([status])
}

model TicketMessage {
  id          String   @id @default(uuid())
  ticket_id   String
  ticket      Ticket   @relation(fields: [ticket_id], references: [id], onDelete: Cascade)
  user_id     String?  // Null if sent by admin
  user        User?    @relation(fields: [user_id], references: [id])
  admin_id    String?  // The admin who replied
  message     String
  attachment  String?
  
  created_at  DateTime @default(now())

  @@index([ticket_id])
}

model BonusConfiguration {
  id                    String   @id @default(uuid())
  name                  String
  type                  String   // WELCOME, DEPOSIT, CASHBACK, FREE_SPINS
  bonus_amount          Decimal  @db.Decimal(15, 2)
  min_deposit           Decimal  @default(0.00) @db.Decimal(15, 2)
  max_bonus             Decimal  @db.Decimal(15, 2)
  wagering_requirement  Int      @default(1)
  start_date            DateTime?
  end_date              DateTime?
  is_active             Boolean  @default(true)
  
  created_at            DateTime @default(now())
  updated_at            DateTime @updatedAt
  
  user_bonuses          UserBonus[]
}

model UserBonus {
  id                    String             @id @default(uuid())
  user_id               String
  user                  User               @relation(fields: [user_id], references: [id], onDelete: Cascade)
  bonus_id              String
  bonus                 BonusConfiguration @relation(fields: [bonus_id], references: [id])
  amount                Decimal            @db.Decimal(15, 2)
  wagering_remaining    Decimal            @db.Decimal(15, 2)
  status                String             // ACTIVE, COMPLETED, EXPIRED
  
  created_at            DateTime           @default(now())
  updated_at            DateTime           @updatedAt

  @@index([user_id])
}

model PromoCode {
  id              String   @id @default(uuid())
  code            String   @unique
  bonus_amount    Decimal  @db.Decimal(15, 2)
  min_deposit     Decimal  @default(0.00) @db.Decimal(15, 2)
  usage_limit     Int      @default(1)
  used_count      Int      @default(0)
  expiry_date     DateTime?
  is_active       Boolean  @default(true)
  
  created_at      DateTime @default(now())
  updated_at      DateTime @updatedAt
  
  usages          PromoCodeUsage[]
}

model PromoCodeUsage {
  id              String     @id @default(uuid())
  promo_code_id   String
  promo_code      PromoCode  @relation(fields: [promo_code_id], references: [id])
  user_id         String
  user            User       @relation(fields: [user_id], references: [id])
  
  created_at      DateTime   @default(now())

  @@index([promo_code_id])
  @@index([user_id])
}

model Banner {
  id              String   @id @default(uuid())
  title           String?
  desktop_image   String
  mobile_image    String?
  link_url        String?
  display_order   Int      @default(0)
  start_date      DateTime?
  end_date        DateTime?
  is_active       Boolean  @default(true)
  
  created_at      DateTime @default(now())
  updated_at      DateTime @updatedAt
}

model Page {
  id              String   @id @default(uuid())
  slug            String   @unique
  title           String
  content         String   @db.Text
  is_published    Boolean  @default(true)
  
  created_at      DateTime @default(now())
  updated_at      DateTime @updatedAt
}

model SystemSetting {
  id              String   @id @default(uuid())
  key             String   @unique
  value           String
  description     String?
  
  created_at      DateTime @default(now())
  updated_at      DateTime @updatedAt
}
`;

schema = schema + '\\n' + newModels;
fs.writeFileSync(schemaFile, schema);
