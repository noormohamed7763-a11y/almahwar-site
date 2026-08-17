const { PrismaClient } = require('@prisma/client');
require('dotenv').config();
const prisma = new PrismaClient();

async function main() {
  const services = await prisma.service.findMany({
    select: { id: true, slug: true, title: true, description: true, _count: { select: { images: true } } }
  });
  console.log('All Services in DB:', JSON.stringify(services, null, 2));
}

main().finally(() => prisma.$disconnect());
