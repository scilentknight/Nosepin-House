import { prisma } from "../lib/prisma";
import { parseDateOnly } from "../lib/jewellery/rate-calculator";

async function debugRates() {
  const today = parseDateOnly(); // UTC midnight today
  console.log("Today (UTC):", today.toISOString());

  // Simulate what /api/admin/material-rates GET returns (materialRateSummaries)
  const materials = await prisma.material.findMany({
    where: { isActive: true },
    include: { purities: { where: { isActive: true } } },
    orderBy: { name: "asc" },
  });

  console.log("\n--- /api/admin/material-rates response (materialRateSummaries) ---");
  for (const mat of materials) {
    console.log(`Material: ${mat.name} (${mat.id})`);
    for (const p of mat.purities) {
      console.log(`  Purity: ${p.name} (${p.id})`);
    }
  }

  // Simulate what MaterialComposition builds its ratesMap from
  // It maps: rateJson.data items using r.materialId and r.purityId
  // But /api/admin/material-rates WITHOUT history returns materialRateSummaries
  // which does NOT have a flat list with materialId/purityId at the top level!
  // It returns: { materialId, materialName, ..., derivedRates: [...] }
  // derivedRates items have: { purityId, purityName, purityCode, rate, ... }

  // So the map loop: `map[\`${r.materialId}:${r.purityId}\`] = Number(r.rate)` won't work
  // because r.purityId doesn't exist at the top level of each item in rateJson.data

  const mockRateJson = {
    data: materials.map(mat => ({
      materialId: mat.id,
      materialName: mat.name,
      materialCode: mat.code,
      unit: mat.unit,
      type: mat.type,
      purities: mat.purities,
      baseRateRecord: null,  // simplify
      derivedRates: [],      // simplify
    }))
  };

  console.log("\n--- MaterialComposition ratesMap build (simulating the bug) ---");
  const brokenMap: Record<string, number> = {};
  const rateList = mockRateJson.data ?? [];
  for (const r of rateList) {
    // r.materialId exists, but r.purityId does NOT exist on this shape!
    const key = `${(r as any).materialId}:${(r as any).purityId}`;
    brokenMap[key] = Number((r as any).rate);
    console.log("  Key from broken loop:", key, "->", (r as any).rate);
  }
  console.log("\nBroken map:", brokenMap);
  // The map will have keys like "cmuksh2in0000v9b868xt6ix7:undefined" = NaN

  // What it SHOULD do: iterate derivedRates of each material
  console.log("\n--- What the correct map should look like ---");
  const correctMap: Record<string, number> = {};
  for (const r of rateList) {
    // derivedRates in the real response has: purityId, rate
    // (in our test derivedRates is empty but let's show what it should be)
    // correctMap[`${r.materialId}:${dr.purityId}`] = dr.rate;
    console.log("  Material:", r.materialId, "derivedRates count:", (r as any).derivedRates?.length ?? 0);
  }

  // Now let's actually fetch real derived rates to show what the correct map would be
  const { getAllDerivedPurityRatesForMaterial } = await import("../lib/jewellery/rate-calculator");
  console.log("\n--- Actual derived rates from DB ---");
  for (const mat of materials) {
    const derived = await getAllDerivedPurityRatesForMaterial(mat.id, today);
    console.log(`Material: ${mat.name}, baseRateRecord:`, derived.baseRateRecord ? `${Number(derived.baseRateRecord.rate)} NPR` : "NULL");
    for (const dr of derived.derivedRates) {
      const key = `${mat.id}:${dr.purityId}`;
      correctMap[key] = dr.rate;
      console.log(`  Derived: ${dr.purityName} -> NPR ${dr.rate}  [key: ${key}]`);
    }
  }
  console.log("\nCorrect map:", correctMap);
}

debugRates().catch(console.error).finally(() => import("../lib/prisma").then(m => m.prisma.$disconnect()));
