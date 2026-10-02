import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const result = await prisma.$executeRawUnsafe(`TRUNCATE TABLE _prisma_migrations`);
  console.log(`Truncated migrations`);
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
