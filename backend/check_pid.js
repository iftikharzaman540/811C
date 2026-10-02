require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function run() {
  const users = await prisma.user.findMany({ take: 2, select: { id: true, player_id: true } });
  console.log(users);
}
run().finally(() => process.exit(0));
