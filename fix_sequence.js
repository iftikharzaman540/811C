const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.$executeRawUnsafe(`SELECT setval(pg_get_serial_sequence('"User"', 'player_id'), coalesce(max(player_id), 1), max(player_id) IS NOT null) FROM "User";`);
  console.log("Sequence fixed!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
