import { prisma } from "../lib/prisma";
import { recalculateAffectedProducts } from "../lib/jewellery/recalculate-products";
import { getAllDerivedPurityRatesForMaterial } from "../lib/jewellery/rate-calculator";

async function main() {
  try {
    const materials = await prisma.material.findMany({
      include: { purities: true }
    });
    console.log("Found materials:", materials.map(m => ({ id: m.id, name: m.name, purities: m.purities.map(p => ({ id: p.id, name: p.name })) })));

    if (materials.length > 0 && materials[0].purities.length > 0) {
      const mat = materials[0];
      const purity = mat.purities[0];
      console.log(`Testing save rate for material ${mat.name} (${mat.id}), purity ${purity.name} (${purity.id})`);

      const rateDate = new Date();
      rateDate.setHours(0, 0, 0, 0);

      await prisma.materialRate.updateMany({
        where: { materialId: mat.id, rateDate },
        data: { isBaseRate: false }
      });

      const saved = await prisma.materialRate.upsert({
        where: {
          materialId_purityId_rateDate: {
            materialId: mat.id,
            purityId: purity.id,
            rateDate,
          }
        },
        update: {
          rate: 10000,
          unit: mat.unit,
          isBaseRate: true,
          status: "ACTIVE",
        },
        create: {
          materialId: mat.id,
          purityId: purity.id,
          rateDate,
          rate: 10000,
          unit: mat.unit,
          isBaseRate: true,
          status: "ACTIVE",
        }
      });
      console.log("Upsert result:", saved);

      const recalc = await recalculateAffectedProducts(mat.id);
      console.log("Recalc result:", recalc);
    }
  } catch (err) {
    console.error("Error in test-rate:", err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
