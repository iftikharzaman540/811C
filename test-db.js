const { PrismaClient } = require('./node_modules/@prisma/client');
const prisma = new PrismaClient();
async function main() {
  console.time('query');
  const [data, total] = await Promise.all([
    prisma.ticket.findMany({
      take: 50,
      orderBy: { updated_at: 'desc' },
      include: { user: { select: { email: true, username: true } } }
    }),
    prisma.ticket.count()
  ]);
  console.timeEnd('query');
  console.log('total tickets:', total);
}
main().catch(console.error).finally(() => prisma.$disconnect());
