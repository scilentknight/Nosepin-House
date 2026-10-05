import { prisma } from "../lib/prisma";
import { calculateProductPrice } from "../lib/jewellery/calculate-product-price";
import { recalculateAffectedProducts } from "../lib/jewellery/recalculate-products";
import { convertWeight, convertWeightToNumber } from "../lib/jewellery/unit-converter";
import { productSchema } from "../schemas/admin-product";

async function runComprehensiveVerification() {
  console.log("===============================================================================");
  console.log("      JEWELLERY UNIT-CONVERTED STONE PRICING SYSTEM VERIFICATION");
  console.log("===============================================================================\n");

  // 1. Setup materials: Gold, Silver, Diamond, Ruby
  console.log("1. Setting up test materials and rates in database...");

  const goldMat = await prisma.material.upsert({
    where: { code: "GOLD_TEST" },
    update: { name: "Gold Test", type: "PRECIOUS_METAL", unit: "GRAM", isActive: true },
    create: {
      name: "Gold Test",
      code: "GOLD_TEST",
      type: "PRECIOUS_METAL",
      unit: "GRAM",
      isActive: true,
      purities: {
        create: [
          { name: "24K", code: "24K_TEST", fineness: 0.999 },
          { name: "22K", code: "22K_TEST", fineness: 0.916 },
        ],
      },
    },
    include: { purities: true },
  });

  const silverMat = await prisma.material.upsert({
    where: { code: "SILVER_TEST" },
    update: { name: "Silver Test", type: "PRECIOUS_METAL", unit: "GRAM", isActive: true },
    create: {
      name: "Silver Test",
      code: "SILVER_TEST",
      type: "PRECIOUS_METAL",
      unit: "GRAM",
      isActive: true,
      purities: {
        create: [
          { name: "999 Fine", code: "999_TEST", fineness: 0.999 },
        ],
      },
    },
    include: { purities: true },
  });

  const diamondMat = await prisma.material.upsert({
    where: { code: "DIAMOND_TEST" },
    update: { name: "Diamond Test", type: "DIAMOND", unit: "CARAT", isActive: true },
    create: {
      name: "Diamond Test",
      code: "DIAMOND_TEST",
      type: "DIAMOND",
      unit: "CARAT",
      isActive: true,
      purities: {
        create: [
          { name: "VVS1 Test", code: "VVS1_TEST", fineness: null },
        ],
      },
    },
    include: { purities: true },
  });

  const rubyMat = await prisma.material.upsert({
    where: { code: "RUBY_TEST" },
    update: { name: "Ruby Test", type: "GEMSTONE", unit: "CARAT", isActive: true },
    create: {
      name: "Ruby Test",
      code: "RUBY_TEST",
      type: "GEMSTONE",
      unit: "CARAT",
      isActive: true,
      purities: {
        create: [
          { name: "Natural Ruby Test", code: "RUBY_TEST_P", fineness: null },
        ],
      },
    },
    include: { purities: true },
  });

  const gold24k = goldMat.purities.find((p) => p.name === "24K")!;
  const silver999 = silverMat.purities[0];
  const diamondPurity = diamondMat.purities[0];
  const rubyPurity = rubyMat.purities[0];

  const today = new Date();
  const rateDate = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));

  // Rates:
  // Gold 24K: 15,000 / g
  // Silver 999: 200 / g
  // Diamond: 50,000 / carat
  // Ruby: 20,000 / carat

  await prisma.materialRate.upsert({
    where: { materialId_purityId_rateDate: { materialId: goldMat.id, purityId: gold24k.id, rateDate } },
    update: { rate: 15000, status: "ACTIVE", isBaseRate: true },
    create: { materialId: goldMat.id, purityId: gold24k.id, rateDate, rate: 15000, unit: "GRAM", status: "ACTIVE", isBaseRate: true },
  });

  await prisma.materialRate.upsert({
    where: { materialId_purityId_rateDate: { materialId: silverMat.id, purityId: silver999.id, rateDate } },
    update: { rate: 200, status: "ACTIVE", isBaseRate: true },
    create: { materialId: silverMat.id, purityId: silver999.id, rateDate, rate: 200, unit: "GRAM", status: "ACTIVE", isBaseRate: true },
  });

  await prisma.materialRate.upsert({
    where: { materialId_purityId_rateDate: { materialId: diamondMat.id, purityId: diamondPurity.id, rateDate } },
    update: { rate: 50000, status: "ACTIVE", isBaseRate: true },
    create: { materialId: diamondMat.id, purityId: diamondPurity.id, rateDate, rate: 50000, unit: "CARAT", status: "ACTIVE", isBaseRate: true },
  });

  await prisma.materialRate.upsert({
    where: { materialId_purityId_rateDate: { materialId: rubyMat.id, purityId: rubyPurity.id, rateDate } },
    update: { rate: 20000, status: "ACTIVE", isBaseRate: true },
    create: { materialId: rubyMat.id, purityId: rubyPurity.id, rateDate, rate: 20000, unit: "CARAT", status: "ACTIVE", isBaseRate: true },
  });

  console.log("Rates set successfully.\n");

  // ==========================================================================
  // Unit conversion tests
  // ==========================================================================
  console.log("--- Unit Conversion Unit Tests ---");
  const c1 = convertWeightToNumber(2, "CARAT", "GRAM");
  console.log("2 CARAT in GRAM:", c1);
  if (c1 !== 0.4) throw new Error(`Unit conversion failed: Expected 0.4, got ${c1}`);

  const c2 = convertWeightToNumber(10, "CARAT", "GRAM");
  console.log("10 CARAT in GRAM:", c2);
  if (c2 !== 2) throw new Error(`Unit conversion failed: Expected 2, got ${c2}`);

  const c3 = convertWeightToNumber(5, "GRAM", "CARAT");
  console.log("5 GRAM in CARAT:", c3);
  if (c3 !== 25) throw new Error(`Unit conversion failed: Expected 25, got ${c3}`);
  console.log("✔ Unit Conversion Tests Passed!\n");

  // ==========================================================================
  // Test 1: Gold only
  // ==========================================================================
  console.log("--- TEST 1: Gold only (10g @ 15,000/g) ---");
  const res1 = await calculateProductPrice([
    {
      materialId: goldMat.id,
      purityId: gold24k.id,
      grossWeight: 10,
      stoneMaterialId: null,
      stoneWeight: 0,
      quantity: 10,
      unit: "GRAM",
      wastagePercent: 0,
    },
  ]);
  console.log("Test 1 Result:", {
    netWeight: res1.materialBreakdown?.[0].netWeight,
    metalCost: res1.materialBreakdown?.[0].metalCost,
    stoneCost: res1.materialBreakdown?.[0].stoneCost,
    totalCost: res1.materialCost,
  });
  if (res1.materialCost !== 150000) throw new Error(`Test 1 failed: Expected 150,000, got ${res1.materialCost}`);
  console.log("✔ Test 1 Passed: Net Gold 10g, Gold Cost NPR 150,000\n");

  // ==========================================================================
  // Test 2: Gold + Diamond (Exact Business Example)
  // Gold: 10g Gross @ 15,000/g, Diamond: 2ct @ 50,000/ct
  // 2ct = 0.4g -> Net Gold = 9.6g -> Gold = 144,000, Diamond = 100,000, Total = 244,000
  // ==========================================================================
  console.log("--- TEST 2: Gold + Diamond (Exact Business Example) ---");
  const res2 = await calculateProductPrice([
    {
      materialId: goldMat.id,
      purityId: gold24k.id,
      grossWeight: 10,
      stoneMaterialId: diamondMat.id,
      stoneWeight: 2,
      quantity: 9.6,
      unit: "GRAM",
      wastagePercent: 0,
    },
  ]);
  console.log("Test 2 Result:", {
    grossWeight: res2.materialBreakdown?.[0].grossWeight,
    stoneWeight: res2.materialBreakdown?.[0].stoneWeight,
    convertedStoneWeight: res2.materialBreakdown?.[0].convertedStoneWeight,
    netWeight: res2.materialBreakdown?.[0].netWeight,
    metalCost: res2.materialBreakdown?.[0].metalCost,
    stoneCost: res2.materialBreakdown?.[0].stoneCost,
    totalCost: res2.materialCost,
  });
  if (res2.materialBreakdown?.[0].convertedStoneWeight !== 0.4) {
    throw new Error(`Test 2 convertedStoneWeight failed: Expected 0.4, got ${res2.materialBreakdown?.[0].convertedStoneWeight}`);
  }
  if (res2.materialBreakdown?.[0].netWeight !== 9.6) {
    throw new Error(`Test 2 netWeight failed: Expected 9.6, got ${res2.materialBreakdown?.[0].netWeight}`);
  }
  if (res2.materialBreakdown?.[0].metalCost !== 144000) {
    throw new Error(`Test 2 metalCost failed: Expected 144,000, got ${res2.materialBreakdown?.[0].metalCost}`);
  }
  if (res2.materialBreakdown?.[0].stoneCost !== 100000) {
    throw new Error(`Test 2 stoneCost failed: Expected 100,000, got ${res2.materialBreakdown?.[0].stoneCost}`);
  }
  if (res2.materialCost !== 244000) {
    throw new Error(`Test 2 totalCost failed: Expected 244,000, got ${res2.materialCost}`);
  }
  console.log("✔ Test 2 Passed: 2ct -> 0.4g, Net Gold = 9.6g (NPR 144,000) + Diamond (NPR 100,000) = Total NPR 244,000\n");

  // ==========================================================================
  // Test 3: Diamond rate changes to 60,000/ct
  // ==========================================================================
  console.log("--- TEST 3: Diamond rate changes to 60,000/ct ---");
  await prisma.materialRate.update({
    where: { materialId_purityId_rateDate: { materialId: diamondMat.id, purityId: diamondPurity.id, rateDate } },
    data: { rate: 60000 },
  });
  const res3 = await calculateProductPrice([
    {
      materialId: goldMat.id,
      purityId: gold24k.id,
      grossWeight: 10,
      stoneMaterialId: diamondMat.id,
      stoneWeight: 2,
      quantity: 9.6,
      unit: "GRAM",
      wastagePercent: 0,
    },
  ]);
  console.log("Test 3 Result:", {
    metalCost: res3.materialBreakdown?.[0].metalCost,
    stoneCost: res3.materialBreakdown?.[0].stoneCost,
    totalCost: res3.materialCost,
  });
  if (res3.materialBreakdown?.[0].metalCost !== 144000) throw new Error(`Test 3 failed: Expected Gold 144,000, got ${res3.materialBreakdown?.[0].metalCost}`);
  if (res3.materialBreakdown?.[0].stoneCost !== 120000) throw new Error(`Test 3 failed: Expected Diamond 120,000, got ${res3.materialBreakdown?.[0].stoneCost}`);
  if (res3.materialCost !== 264000) throw new Error(`Test 3 failed: Expected Total 264,000, got ${res3.materialCost}`);
  console.log("✔ Test 3 Passed: Gold NPR 144,000 + Diamond NPR 120,000 = Total NPR 264,000\n");

  // Reset diamond rate to 50000
  await prisma.materialRate.update({
    where: { materialId_purityId_rateDate: { materialId: diamondMat.id, purityId: diamondPurity.id, rateDate } },
    data: { rate: 50000 },
  });

  // ==========================================================================
  // Test 4: Gold rate changes to 16,000/g
  // ==========================================================================
  console.log("--- TEST 4: Gold rate changes to 16,000/g ---");
  await prisma.materialRate.update({
    where: { materialId_purityId_rateDate: { materialId: goldMat.id, purityId: gold24k.id, rateDate } },
    data: { rate: 16000 },
  });
  const res4 = await calculateProductPrice([
    {
      materialId: goldMat.id,
      purityId: gold24k.id,
      grossWeight: 10,
      stoneMaterialId: diamondMat.id,
      stoneWeight: 2,
      quantity: 9.6,
      unit: "GRAM",
      wastagePercent: 0,
    },
  ]);
  // 9.6 * 16,000 = 153,600, Diamond = 100,000 -> Total = 253,600
  console.log("Test 4 Result:", {
    metalCost: res4.materialBreakdown?.[0].metalCost,
    stoneCost: res4.materialBreakdown?.[0].stoneCost,
    totalCost: res4.materialCost,
  });
  if (res4.materialBreakdown?.[0].metalCost !== 153600) throw new Error(`Test 4 failed: Expected Gold 153,600, got ${res4.materialBreakdown?.[0].metalCost}`);
  if (res4.materialBreakdown?.[0].stoneCost !== 100000) throw new Error(`Test 4 failed: Expected Diamond 100,000, got ${res4.materialBreakdown?.[0].stoneCost}`);
  if (res4.materialCost !== 253600) throw new Error(`Test 4 failed: Expected Total 253,600, got ${res4.materialCost}`);
  console.log("✔ Test 4 Passed: Gold NPR 153,600 + Diamond NPR 100,000 = Total NPR 253,600\n");

  // Reset gold rate to 15000
  await prisma.materialRate.update({
    where: { materialId_purityId_rateDate: { materialId: goldMat.id, purityId: gold24k.id, rateDate } },
    data: { rate: 15000 },
  });

  // ==========================================================================
  // Test 5: Gold + Ruby (10g gross, 1.5ct Ruby @ 20,000/ct, Gold @ 15,000/g)
  // 1.5ct = 0.3g -> Net Gold = 9.7g -> Gold = 9.7 * 15,000 = 145,500, Ruby = 1.5 * 20,000 = 30,000 -> Total = 175,500
  // ==========================================================================
  console.log("--- TEST 5: Gold + Ruby ---");
  const res5 = await calculateProductPrice([
    {
      materialId: goldMat.id,
      purityId: gold24k.id,
      grossWeight: 10,
      stoneMaterialId: rubyMat.id,
      stoneWeight: 1.5,
      quantity: 9.7,
      unit: "GRAM",
      wastagePercent: 0,
    },
  ]);
  console.log("Test 5 Result:", {
    convertedStoneWeight: res5.materialBreakdown?.[0].convertedStoneWeight,
    netWeight: res5.materialBreakdown?.[0].netWeight,
    metalCost: res5.materialBreakdown?.[0].metalCost,
    stoneCost: res5.materialBreakdown?.[0].stoneCost,
    totalCost: res5.materialCost,
  });
  if (res5.materialBreakdown?.[0].convertedStoneWeight !== 0.3) throw new Error(`Test 5 failed: Expected 0.3g stone, got ${res5.materialBreakdown?.[0].convertedStoneWeight}`);
  if (res5.materialBreakdown?.[0].netWeight !== 9.7) throw new Error(`Test 5 failed: Expected 9.7g net, got ${res5.materialBreakdown?.[0].netWeight}`);
  if (res5.materialBreakdown?.[0].metalCost !== 145500) throw new Error(`Test 5 failed: Expected Gold 145,500, got ${res5.materialBreakdown?.[0].metalCost}`);
  if (res5.materialBreakdown?.[0].stoneCost !== 30000) throw new Error(`Test 5 failed: Expected Ruby 30,000, got ${res5.materialBreakdown?.[0].stoneCost}`);
  if (res5.materialCost !== 175500) throw new Error(`Test 5 failed: Expected Total 175,500, got ${res5.materialCost}`);
  console.log("✔ Test 5 Passed: 1.5ct Ruby = 0.3g -> Gold NPR 145,500 + Ruby NPR 30,000 = Total NPR 175,500\n");

  // ==========================================================================
  // Test 6: Multi-material (Gold + Diamond and Silver + Ruby)
  // ==========================================================================
  console.log("--- TEST 6: Multi-material product ---");
  const res6 = await calculateProductPrice([
    {
      materialId: goldMat.id,
      purityId: gold24k.id,
      grossWeight: 10,
      stoneMaterialId: diamondMat.id,
      stoneWeight: 2,
      quantity: 9.6,
      unit: "GRAM",
      wastagePercent: 0,
    },
    {
      materialId: silverMat.id,
      purityId: silver999.id,
      grossWeight: 20,
      stoneMaterialId: rubyMat.id,
      stoneWeight: 1.5,
      quantity: 19.7,
      unit: "GRAM",
      wastagePercent: 0,
    },
  ]);
  // Row 1: Gold 9.6g (144k) + Diamond (100k) = 244,000
  // Row 2: Silver (20 - 0.3 = 19.7g * 200 = 3,940) + Ruby (30,000) = 33,940
  // Total = 277,940
  const expectedTotal6 = 244000 + 33940;
  console.log("Test 6 Result:", {
    row1Cost: res6.materialBreakdown?.[0].cost,
    row2Cost: res6.materialBreakdown?.[1].cost,
    totalCost: res6.materialCost,
  });
  if (res6.materialCost !== expectedTotal6) throw new Error(`Test 6 failed: Expected ${expectedTotal6}, got ${res6.materialCost}`);
  console.log(`✔ Test 6 Passed: Multi-material Total NPR ${expectedTotal6.toLocaleString("en-NP")}\n`);

  // ==========================================================================
  // Test 7: Invalid weight validation
  // Gold = 1g, Diamond = 10ct (10ct = 2g > 1g)
  // ==========================================================================
  console.log("--- TEST 7: Invalid Weight Validation ---");
  const invalidSchemaInput = {
    name: "Invalid Ring",
    categoryId: 1,
    fullDescription: "Invalid weight product",
    materials: [
      {
        materialId: goldMat.id,
        purityId: gold24k.id,
        grossWeight: 1,
        stoneMaterialId: diamondMat.id,
        stoneWeight: 10, // 10ct = 2g > 1g
        quantity: 1,
        unit: "GRAM",
      },
    ],
  };
  const parseResult = productSchema.safeParse(invalidSchemaInput);
  console.log("Validation rejection result:", parseResult.success === false ? "REJECTED (as expected)" : "ACCEPTED (error)");
  if (parseResult.success) {
    throw new Error("Test 7 failed: Schema should have rejected 10ct stone on 1g gross weight!");
  }
  console.log("✔ Test 7 Passed: Invalid stone mass (2g > 1g) rejected by Zod schema!\n");

  // ==========================================================================
  // Test 8: Wastage on Metal with converted stone mass
  // Gold 10g gross, 2ct Diamond, Wastage = 5%
  // Net Gold = 9.6g -> Wastage = 9.6 * 0.05 = 0.48g -> Chargeable = 10.08g
  // Gold Cost = 10.08 * 15,000 = 151,200
  // Diamond Cost = 100,000
  // Total = 251,200
  // ==========================================================================
  console.log("--- TEST 8: Wastage on Metal ---");
  const res8 = await calculateProductPrice([
    {
      materialId: goldMat.id,
      purityId: gold24k.id,
      grossWeight: 10,
      stoneMaterialId: diamondMat.id,
      stoneWeight: 2,
      quantity: 9.6,
      unit: "GRAM",
      wastagePercent: 5,
    },
  ]);
  console.log("Test 8 Result:", {
    netWeight: res8.materialBreakdown?.[0].netWeight,
    wastageWeight: res8.materialBreakdown?.[0].wastageWeight,
    chargeableQuantity: res8.materialBreakdown?.[0].chargeableQuantity,
    metalCost: res8.materialBreakdown?.[0].metalCost,
    stoneCost: res8.materialBreakdown?.[0].stoneCost,
    totalCost: res8.materialCost,
  });
  if (res8.materialBreakdown?.[0].metalCost !== 151200) throw new Error(`Test 8 failed: Expected Gold 151,200, got ${res8.materialBreakdown?.[0].metalCost}`);
  if (res8.materialBreakdown?.[0].stoneCost !== 100000) throw new Error(`Test 8 failed: Expected Diamond 100,000, got ${res8.materialBreakdown?.[0].stoneCost}`);
  if (res8.materialCost !== 251200) throw new Error(`Test 8 failed: Expected Total 251,200, got ${res8.materialCost}`);
  console.log("✔ Test 8 Passed: Gold 9.6g + 5% wastage = NPR 151,200 + Diamond NPR 100,000 = Total NPR 251,200\n");

  // ==========================================================================
  // Test 9: Persistence & Recalculation Engine
  // ==========================================================================
  console.log("--- TEST 9: DB Persistence & Recalculation Engine ---");
  let category = await prisma.category.findFirst();
  if (!category) {
    category = await prisma.category.create({
      data: { name: "Test Category", slug: "test-category" },
    });
  }

  const testProduct = await prisma.product.create({
    data: {
      name: "Gold & Diamond Ring Unit Conversion Test",
      slug: "gold-diamond-ring-unit-conv-test-" + Date.now(),
      categoryId: category.id,
      fullDescription: "Test product with embedded diamond and unit conversion",
      price: res2.sellingPrice, // 244,000
      costPrice: res2.subtotal,
      materials: {
        create: [
          {
            materialId: goldMat.id,
            purityId: gold24k.id,
            grossWeight: 10,
            stoneMaterialId: diamondMat.id,
            stoneWeight: 2,
            netWeight: 9.6,
            quantity: 9.6,
            unit: "GRAM",
            wastagePercent: 0,
            sortOrder: 0,
          },
        ],
      },
    },
    include: {
      materials: {
        include: { material: true, purity: true, stoneMaterial: true },
      },
    },
  });

  console.log("Saved product initial price:", Number(testProduct.price));
  if (Number(testProduct.price) !== 244000) {
    throw new Error(`Test 9 failed: Expected initial price 244,000, got ${Number(testProduct.price)}`);
  }

  // Update Diamond rate to 60,000/ct
  console.log("Updating Diamond rate to 60,000/ct and recalculating affected products...");
  await prisma.materialRate.update({
    where: { materialId_purityId_rateDate: { materialId: diamondMat.id, purityId: diamondPurity.id, rateDate } },
    data: { rate: 60000 },
  });

  const recalcResult = await recalculateAffectedProducts(diamondMat.id);
  console.log("Recalculate result:", recalcResult);

  const updatedProduct = await prisma.product.findUnique({
    where: { id: testProduct.id },
  });

  // Expected price: Gold 9.6g @ 15,000 = 144,000 + Diamond 2ct @ 60,000 = 120,000 -> Total = 264,000
  console.log("Recalculated product price in DB:", Number(updatedProduct?.price));
  if (Number(updatedProduct?.price) !== 264000) {
    throw new Error(`Test 9 failed: Expected recalculated price 264,000, got ${Number(updatedProduct?.price)}`);
  }
  console.log("✔ Test 9 Passed: Database product automatically recalculated to NPR 264,000 on stone rate change!\n");

  // Cleanup test product
  await prisma.product.delete({ where: { id: testProduct.id } });

  console.log("===============================================================================");
  console.log("      ALL TESTS 1 THROUGH 9 PASSED WITH 100% ACCURACY AND PRECISION!");
  console.log("===============================================================================");
}

runComprehensiveVerification()
  .catch((e) => {
    console.error("Verification failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
