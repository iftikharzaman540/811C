const fs = require('fs');
let content = fs.readFileSync('schema-vps.prisma', 'utf8');

// Add fields to User
content = content.replace(
  '  total_deposited  Decimal   @default(0.00) @db.Decimal(15, 2)',
  '  total_deposited  Decimal   @default(0.00) @db.Decimal(15, 2)\n  total_wagered    Decimal   @default(0.00) @db.Decimal(15, 2)'
);

// Add VipBonusClaim relation to User
content = content.replace(
  '  VipHistory       VipHistory[]',
  '  VipHistory       VipHistory[]\n  vip_bonus_claims VipBonusClaim[]'
);

// Add fields to Wallet
content = content.replace(
  '  bonus_balance Decimal   @default(0.00) @db.Decimal(15, 2)',
  '  bonus_balance        Decimal   @default(0.00) @db.Decimal(15, 2)\n  wagering_requirement Decimal   @default(0.00) @db.Decimal(15, 2)\n  wagering_completed   Decimal   @default(0.00) @db.Decimal(15, 2)'
);

// Add fields to VipLevel
content = content.replace(
  '  min_deposit         Decimal @default(0.00) @db.Decimal(15, 2)',
  '  min_deposit         Decimal @default(0.00) @db.Decimal(15, 2)\n  min_turnover        Decimal @default(0.00) @db.Decimal(15, 2)\n  bonus_amount        Decimal @default(0.00) @db.Decimal(15, 2)\n  wagering_multiplier Int     @default(1)\n  auto_upgrade        Boolean @default(true)\n  auto_bonus          Boolean @default(true)'
);

// Add VipBonusClaim model at the end
content += `\nmodel VipBonusClaim {
  id         String   @id @default(uuid())
  user_id    String
  user       User     @relation(fields: [user_id], references: [id], onDelete: Cascade)
  level      Int
  amount     Decimal  @db.Decimal(15, 2)
  created_at DateTime @default(now())

  @@unique([user_id, level])
}\n`;

fs.writeFileSync('schema-vps-updated.prisma', content);
console.log('Updated schema saved to schema-vps-updated.prisma');
