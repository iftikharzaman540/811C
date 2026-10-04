const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function seed() {
  const levels = [
    { level: 1, name: 'VIP 1', min_deposit: 0, cashback_percentage: 0.1 },
    { level: 2, name: 'VIP 2', min_deposit: 1000, cashback_percentage: 0.2 },
    { level: 3, name: 'VIP 3', min_deposit: 5000, cashback_percentage: 0.3 },
    { level: 4, name: 'VIP 4', min_deposit: 20000, cashback_percentage: 0.5 },
    { level: 5, name: 'VIP 5', min_deposit: 50000, cashback_percentage: 0.8 },
    { level: 6, name: 'VIP 6', min_deposit: 100000, cashback_percentage: 1.0 },
    { level: 7, name: 'VIP 7', min_deposit: 250000, cashback_percentage: 1.5 },
    { level: 8, name: 'VIP 8', min_deposit: 500000, cashback_percentage: 2.0 },
    { level: 9, name: 'VIP 9', min_deposit: 1000000, cashback_percentage: 2.5 },
    { level: 10, name: 'VIP 10', min_deposit: 2000000, cashback_percentage: 3.0 }
  ];

  for (const l of levels) {
    await prisma.vipLevel.upsert({
      where: { level: l.level },
      update: {},
      create: l
    });
  }
  console.log("VIP Levels seeded!");
  await prisma.$disconnect();
}
seed();
