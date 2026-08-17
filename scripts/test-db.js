const { PrismaClient } = require('@prisma/client');
require('dotenv').config();
const prisma = new PrismaClient();
async function main() {
  const services = await prisma.service.findMany({
    include: { images: true }
  });
  console.log(JSON.stringify(services, null, 2));
}
main().finally(() => prisma.$disconnect());
