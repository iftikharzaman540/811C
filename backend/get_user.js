const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.user.findFirst({ orderBy: { created_at: 'desc' } }).then(x => console.log(JSON.stringify(x, null, 2))).finally(() => process.exit(0));
