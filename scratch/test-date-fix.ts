import { prisma } from "../lib/prisma";

function parseDateOnly(dateInput?: string | Date): Date {
  if (!dateInput) {
    const d = new Date();
    return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  }
  if (typeof dateInput === "string") {
    const parts = dateInput.split("T")[0].split("-").map(Number);
    if (parts.length === 3 && !parts.some(isNaN)) {
      return new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));
    }
  }
  const d = new Date(dateInput);
  return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
}

async function test() {
  const mat = await prisma.material.findFirst({ include: { purities: true } });
  if (!mat || !mat.purities[0]) return;

  const purity = mat.purities[0];
  const rateDate = parseDateOnly("2026-09-28");
  console.log("Normalized rateDate:", rateDate.toISOString());

  // Upsert
  const result = await prisma.materialRate.upsert({
    where: {
      materialId_purityId_rateDate: {
        materialId: mat.id,
        purityId: purity.id,
        rateDate,
      },
    },
    update: {
      rate: 15000,
      unit: mat.unit,
      isBaseRate: true,
      status: "ACTIVE",
      notes: "Testing save",
    },
    create: {
      materialId: mat.id,
      purityId: purity.id,
      rateDate,
      rate: 15000,
      unit: mat.unit,
      isBaseRate: true,
      status: "ACTIVE",
      notes: "Testing save",
    },
  });

  console.log("Upsert SUCCESS:", result);

  // Now run upsert AGAIN on the exact same date to test updating existing record
  const updateResult = await prisma.materialRate.upsert({
    where: {
      materialId_purityId_rateDate: {
        materialId: mat.id,
        purityId: purity.id,
        rateDate,
      },
    },
    update: {
      rate: 15500,
      unit: mat.unit,
      isBaseRate: true,
      status: "ACTIVE",
      notes: "Testing update",
    },
    create: {
      materialId: mat.id,
      purityId: purity.id,
      rateDate,
      rate: 15500,
      unit: mat.unit,
      isBaseRate: true,
      status: "ACTIVE",
      notes: "Testing update",
    },
  });

  console.log("Update SUCCESS:", updateResult);
}

test().catch(console.error).finally(() => prisma.$disconnect());
