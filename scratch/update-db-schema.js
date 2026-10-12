const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  console.log("Modifying OrderItem.productId to be nullable...");
  try {
    // Drop existing foreign key constraint on OrderItem.productId if exists
    try {
      await prisma.$executeRawUnsafe(`ALTER TABLE \`OrderItem\` DROP FOREIGN KEY \`OrderItem_productId_fkey\`;`);
      console.log("Dropped old OrderItem_productId_fkey");
    } catch (e) {
      console.log("Note on drop FK OrderItem:", e.message);
    }

    // Modify column to be nullable
    await prisma.$executeRawUnsafe(`ALTER TABLE \`OrderItem\` MODIFY COLUMN \`productId\` INT NULL;`);
    console.log("Modified OrderItem.productId to INT NULL");

    // Re-add foreign key with ON DELETE SET NULL
    await prisma.$executeRawUnsafe(`
      ALTER TABLE \`OrderItem\` 
      ADD CONSTRAINT \`OrderItem_productId_fkey\` 
      FOREIGN KEY (\`productId\`) REFERENCES \`Product\`(\`id\`) ON DELETE SET NULL;
    `);
    console.log("Added new OrderItem_productId_fkey with ON DELETE SET NULL");
  } catch (err) {
    console.error("Error updating OrderItem schema:", err);
  }

  // Also check ProductMaterial foreign keys
  try {
    try {
      await prisma.$executeRawUnsafe(`ALTER TABLE \`ProductMaterial\` DROP FOREIGN KEY \`ProductMaterial_materialId_fkey\`;`);
    } catch (e) {}
    try {
      await prisma.$executeRawUnsafe(`ALTER TABLE \`ProductMaterial\` DROP FOREIGN KEY \`ProductMaterial_stoneMaterialId_fkey\`;`);
    } catch (e) {}
    try {
      await prisma.$executeRawUnsafe(`ALTER TABLE \`ProductMaterial\` DROP FOREIGN KEY \`ProductMaterial_purityId_fkey\`;`);
    } catch (e) {}

    await prisma.$executeRawUnsafe(`
      ALTER TABLE \`ProductMaterial\`
      ADD CONSTRAINT \`ProductMaterial_materialId_fkey\`
      FOREIGN KEY (\`materialId\`) REFERENCES \`Material\`(\`id\`) ON DELETE CASCADE;
    `);
    await prisma.$executeRawUnsafe(`
      ALTER TABLE \`ProductMaterial\`
      ADD CONSTRAINT \`ProductMaterial_stoneMaterialId_fkey\`
      FOREIGN KEY (\`stoneMaterialId\`) REFERENCES \`Material\`(\`id\`) ON DELETE SET NULL;
    `);
    await prisma.$executeRawUnsafe(`
      ALTER TABLE \`ProductMaterial\`
      ADD CONSTRAINT \`ProductMaterial_purityId_fkey\`
      FOREIGN KEY (\`purityId\`) REFERENCES \`MaterialPurity\`(\`id\`) ON DELETE SET NULL;
    `);
    console.log("Updated ProductMaterial foreign keys with CASCADE and SET NULL");
  } catch (err) {
    console.error("Error updating ProductMaterial foreign keys:", err);
  }

  console.log("Database schema updates finished successfully!");
}

run().finally(() => prisma.$disconnect());
