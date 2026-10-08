const fs = require('fs');
let content = fs.readFileSync('schema-vps.prisma', 'utf8');

// 1. Add total_wagered to User if not exists
if (!content.includes('total_wagered')) {
  content = content.replace(
    /(total_deposited\s+Decimal\s+@default\(0\.00\)\s+@db\.Decimal\(15,\s*2\))/,
    '$1\n  total_wagered       Decimal @default(0.00) @db.Decimal(15, 2)'
  );
}

// 2. Add VipBonusClaim relation to User
if (!content.includes('vip_bonus_claims VipBonusClaim[]')) {
  content = content.replace(
    /VipHistory\s+VipHistory\[\]/,
    'VipHistory       VipHistory[]\n  vip_bonus_claims VipBonusClaim[]'
  );
}

// 3. Add min_turnover and bonus configs to VipLevel
if (!content.includes('min_turnover')) {
  content = content.replace(
    /(min_deposit\s+Decimal\s+@default\(0\.00\)\s+@db\.Decimal\(15,\s*2\))/,
    '$1\n  min_turnover        Decimal @default(0.00) @db.Decimal(15, 2)\n  bonus_amount        Decimal @default(0.00) @db.Decimal(15, 2)\n  wagering_multiplier Int     @default(1)\n  auto_upgrade        Boolean @default(true)\n  auto_bonus          Boolean @default(true)'
  );
}

// 4. Add VipBonusClaim model at the bottom if not exists
if (!content.includes('model VipBonusClaim')) {
  content += `\nmodel VipBonusClaim {
  id         String   @id @default(uuid())
  user_id    String
  user       User     @relation(fields: [user_id], references: [id], onDelete: Cascade)
  level      Int
  amount     Decimal  @db.Decimal(15, 2)
  created_at DateTime @default(now())

  @@unique([user_id, level])
}\n`;
}

fs.writeFileSync('schema-vps-updated2.prisma', content);
console.log('Done parsing schema.');
