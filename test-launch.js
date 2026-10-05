const { PrismaClient } = require('./node_modules/@prisma/client');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findFirst();
  if (!user) { console.log('No user'); return; }
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'fallback');
  console.log('TOKEN:', token);
  
  const response = await fetch('http://127.0.0.1:4000/api/v1/games/gregmorn/launch', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
    body: JSON.stringify({ gameId: 'greece:3000:200000429', demo: false })
  });
  
  console.log('STATUS:', response.status);
  const data = await response.json();
  console.log('DATA:', data);
}

main().catch(console.error).finally(() => prisma.$disconnect());
