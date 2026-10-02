const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function run() {
  await prisma.$executeRawUnsafe('ALTER SEQUENCE "User_player_id_seq" RESTART WITH 10000000;');
  await prisma.$executeRawUnsafe('UPDATE "User" SET player_id = player_id + 10000000 WHERE player_id < 10000000;');
  console.log('Sequence updated and existing users padded.');
}
run().finally(() => process.exit(0));
