const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function check() {
  const levels = await prisma.vipLevel.findMany();
  console.log("VIP Levels count:", levels.length);
  await prisma.$disconnect();
}
check();
