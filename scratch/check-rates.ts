import { prisma } from "../lib/prisma";

async function main() {
  const rates = await prisma.materialRate.findMany();
  console.log("All material rates in DB:", rates);
}

main().finally(() => prisma.$disconnect());
