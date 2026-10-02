require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function run() {
  const count = await prisma.user.count();
  console.log('Total users:', count);
  const users = await prisma.user.findMany({ take: 2, select: { id: true, player_id: true } });
  console.log('Users:', JSON.stringify(users, null, 2));
}
run().finally(() => process.exit(0));
