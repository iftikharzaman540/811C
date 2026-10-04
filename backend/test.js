const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const user = await prisma.user.update({
    where: { email: 'admin@8111c.com' },
    data: { casino_enabled: false }
  });
  console.log('Update success:', user.casino_enabled);
  await prisma.user.update({
    where: { email: 'admin@8111c.com' },
    data: { casino_enabled: true }
  });
}
main().finally(() => prisma.$disconnect());
