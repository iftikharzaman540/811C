const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function run() {
  const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
  if (!admin) return console.log('No user');
  
  const token = await prisma.user.findFirst(); // just to have a user ID

  const https = require('https');
  const data = JSON.stringify({ gameId: 'magic-firekirin:fishing:510001', isDemo: false, userId: admin.id });
  console.log("Mocking payload...");
}
run();
