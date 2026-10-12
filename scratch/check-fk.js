const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function run() {
  const fks = await prisma.$queryRawUnsafe(`
    SELECT TABLE_NAME, COLUMN_NAME, CONSTRAINT_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME
    FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
    WHERE REFERENCED_TABLE_SCHEMA = DATABASE() AND REFERENCED_TABLE_NAME IN ('Product', 'Material', 'MaterialRate', 'MaterialPurity');
  `);
  console.log("Foreign keys referencing Product and Material:", fks);
}
run().finally(() => prisma.$disconnect());
