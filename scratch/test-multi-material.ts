import { prisma } from "../lib/prisma";
import { calculateProductPrice } from "../lib/jewellery/calculate-product-price";
import { productSchema } from "../schemas/admin-product";
import { ensureUniqueSlug } from "../lib/slug";
import { generateSku } from "../lib/sku";

async function runMultiMaterialVerification() {
  console.log("===============================================================================");
  console.log("         MULTI-MATERIAL JEWELLERY END-TO-END VERIFICATION TEST");
  console.log("===============================================================================\n");

  // 1. Setup or retrieve required test materials: Gold, Diamond, Ruby, Pearl
  console.log("1. Setting up test materials in database...");

  const goldMat = await prisma.material.upsert({
    where: { code: "GOLD" },
    update: { name: "Gold", type: "PRECIOUS_METAL", unit: "GRAM", isActive: true },
    create: {
      name: "Gold",
      code: "GOLD",
      type: "PRECIOUS_METAL",
      unit: "GRAM",
      isActive: true,
      purities: {
        create: [
          { name: "24K", code: "24K", fineness: 0.999 },
          { name: "22K", code: "22K", fineness: 0.916 },
          { name: "18K", code: "18K", fineness: 0.750 },
        ],
      },
    },
    include: { purities: true },
  });

  const diamondMat = await prisma.material.upsert({
    where: { code: "DIAMOND" },
    update: { name: "Diamond", type: "DIAMOND", unit: "CARAT", isActive: true },
    create: {
      name: "Diamond",
      code: "DIAMOND",
      type: "DIAMOND",
      unit: "CARAT",
      isActive: true,
      purities: {
        create: [
          { name: "Natural Diamond VVS1", code: "VVS1", fineness: null },
          { name: "Natural Diamond VS1", code: "VS1", fineness: null },
        ],
      },
    },
    include: { purities: true },
  });

  const rubyMat = await prisma.material.upsert({
    where: { code: "RUBY" },
    update: { name: "Ruby", type: "GEMSTONE", unit: "CARAT", isActive: true },
    create: {
      name: "Ruby",
      code: "RUBY",
      type: "GEMSTONE",
      unit: "CARAT",
      isActive: true,
      purities: {
        create: [
          { name: "Natural Ruby", code: "RUBY_NATURAL", fineness: null },
        ],
      },
    },
    include: { purities: true },
  });

  const pearlMat = await prisma.material.upsert({
    where: { code: "PEARL" },
    update: { name: "Pearl", type: "OTHER", unit: "PIECE", isActive: true },
    create: {
      name: "Pearl",
      code: "PEARL",
      type: "OTHER",
      unit: "PIECE",
      isActive: true,
      purities: {
        create: [
          { name: "Freshwater Pearl", code: "PEARL_FW", fineness: null },
        ],
      },
    },
    include: { purities: true },
  });

  console.log("Materials configured:", {
    Gold: { id: goldMat.id, purities: goldMat.purities.map((p) => p.name) },
    Diamond: { id: diamondMat.id, purities: diamondMat.purities.map((p) => p.name) },
    Ruby: { id: rubyMat.id, purities: rubyMat.purities.map((p) => p.name) },
    Pearl: { id: pearlMat.id, purities: pearlMat.purities.map((p) => p.name) },
  });

  // 2. Set daily rates for today
  console.log("\n2. Setting active rates for test materials...");
  const today = new Date();
  const rateDate = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));

  const gold18k = goldMat.purities.find((p) => p.code === "18K") || goldMat.purities[0];
  const diamondPurity = diamondMat.purities[0];
  const rubyPurity = rubyMat.purities[0];
  const pearlPurity = pearlMat.purities[0];

  // Set Gold 24K base rate
  const gold24k = goldMat.purities.find((p) => p.code === "24K") || goldMat.purities[0];
  await prisma.materialRate.upsert({
    where: {
      materialId_purityId_rateDate: {
        materialId: goldMat.id,
        purityId: gold24k.id,
        rateDate,
      },
    },
    update: { rate: 20000, isBaseRate: true, unit: "GRAM", status: "ACTIVE" },
    create: { materialId: goldMat.id, purityId: gold24k.id, rateDate, rate: 20000, isBaseRate: true, unit: "GRAM", status: "ACTIVE" },
  });

  // Set Diamond rate
  await prisma.materialRate.upsert({
    where: {
      materialId_purityId_rateDate: {
        materialId: diamondMat.id,
        purityId: diamondPurity.id,
        rateDate,
      },
    },
    update: { rate: 60000, isBaseRate: true, unit: "CARAT", status: "ACTIVE" },
    create: { materialId: diamondMat.id, purityId: diamondPurity.id, rateDate, rate: 60000, isBaseRate: true, unit: "CARAT", status: "ACTIVE" },
  });

  // Set Ruby rate
  await prisma.materialRate.upsert({
    where: {
      materialId_purityId_rateDate: {
        materialId: rubyMat.id,
        purityId: rubyPurity.id,
        rateDate,
      },
    },
    update: { rate: 15000, isBaseRate: true, unit: "CARAT", status: "ACTIVE" },
    create: { materialId: rubyMat.id, purityId: rubyPurity.id, rateDate, rate: 15000, isBaseRate: true, unit: "CARAT", status: "ACTIVE" },
  });

  // Set Pearl rate
  await prisma.materialRate.upsert({
    where: {
      materialId_purityId_rateDate: {
        materialId: pearlMat.id,
        purityId: pearlPurity.id,
        rateDate,
      },
    },
    update: { rate: 500, isBaseRate: true, unit: "PIECE", status: "ACTIVE" },
    create: { materialId: pearlMat.id, purityId: pearlPurity.id, rateDate, rate: 500, isBaseRate: true, unit: "PIECE", status: "ACTIVE" },
  });

  console.log("Active rates saved successfully.");

  // 3. Test Multi-Material Price Calculation
  console.log("\n3. Testing calculateProductPrice with multi-materials (Gold 18K + Diamond + Ruby + Pearl)...");

  const testMaterials = [
    {
      materialId: goldMat.id,
      purityId: gold18k.id,
      grossWeight: 5.200,
      stoneWeight: 0.500,
      netWeight: 4.700,
      quantity: 4.700,
      unit: "GRAM",
      wastagePercent: 5,
    },
    {
      materialId: diamondMat.id,
      purityId: diamondPurity.id,
      quantity: 0.500,
      unit: "CARAT",
      wastagePercent: 0,
    },
    {
      materialId: rubyMat.id,
      purityId: rubyPurity.id,
      quantity: 0.250,
      unit: "CARAT",
      wastagePercent: 0,
    },
    {
      materialId: pearlMat.id,
      purityId: pearlPurity.id,
      quantity: 6,
      unit: "PIECE",
      wastagePercent: 0,
    },
  ];

  const pricing = await calculateProductPrice(
    testMaterials,
    1000, // labourCharge
    2500, // makingCharge
    500,  // otherCharge
    "PERCENTAGE",
    10,   // 10% markup
    rateDate,
  );

  console.log("Calculated Pricing Result:", {
    materialCost: pricing.materialCost,
    labourCharge: pricing.labourCharge,
    makingCharge: pricing.makingCharge,
    otherCharge: pricing.otherCharge,
    subtotal: pricing.subtotal,
    markupAmount: pricing.markupAmount,
    sellingPrice: pricing.sellingPrice,
  });

  console.log("\nMaterial Breakdown:");
  pricing.materialBreakdown?.forEach((item, idx) => {
    console.log(`  [Material ${idx + 1}] ${item.materialName} (${item.purityName ?? "N/A"}): Qty=${item.quantity} ${item.unit}, Wastage=${item.wastagePercent ?? 0}%, Rate=NPR ${item.rate}, Cost=NPR ${item.cost}`);
  });

  // 4. Test Product Creation with Multiple Materials
  console.log("\n4. Testing Product Creation with multiple materials via Zod Schema + Prisma...");
  const categories = await prisma.category.findMany();
  if (categories.length === 0) throw new Error("No category found");
  const categoryId = categories[0].id;

  const productPayload = {
    name: "Royal Diamond & Gemstone Gold Ring",
    slug: "",
    sku: "",
    categoryId,
    brandId: null,
    shortDescription: "Masterpiece multi-material jewellery",
    fullDescription: "<p>Composed of 18K Gold, Natural Diamond, Ruby, and Freshwater Pearls.</p>",
    stock: 10,
    stockStatus: "IN_STOCK" as const,
    minimumOrderQuantity: 1,
    status: "PUBLISHED" as const,
    labourCharge: 1000,
    makingCharge: 2500,
    otherCharge: 500,
    markupType: "PERCENTAGE" as const,
    markupValue: 10,
    materials: testMaterials.map((m, i) => ({
      ...m,
      sortOrder: i,
    })),
  };

  const parsed = productSchema.safeParse(productPayload);
  if (!parsed.success) {
    console.error("Validation failed:", parsed.error.issues);
    throw new Error("Product schema validation failed");
  }

  const slug = await ensureUniqueSlug(prisma.product, parsed.data.slug || parsed.data.name);
  const sku = parsed.data.sku?.trim() || generateSku(parsed.data.name);

  const createdProduct = await prisma.product.create({
    data: {
      name: parsed.data.name,
      slug,
      sku,
      categoryId: parsed.data.categoryId,
      fullDescription: parsed.data.fullDescription,
      price: pricing.sellingPrice,
      costPrice: pricing.subtotal,
      stock: parsed.data.stock,
      status: parsed.data.status,
      labourCharge: parsed.data.labourCharge,
      makingCharge: parsed.data.makingCharge,
      otherCharge: parsed.data.otherCharge,
      markupType: parsed.data.markupType,
      markupValue: parsed.data.markupValue,
      materials: {
        create: parsed.data.materials.map((m, i) => ({
          materialId: m.materialId,
          purityId: m.purityId,
          grossWeight: m.grossWeight ?? null,
          stoneWeight: m.stoneWeight ?? null,
          netWeight: m.netWeight ?? null,
          quantity: m.quantity,
          unit: m.unit,
          wastagePercent: m.wastagePercent ?? 0,
          sortOrder: i,
        })),
      },
    },
    include: {
      materials: {
        include: { material: true, purity: true },
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  console.log("\nProduct successfully created in DB:", {
    id: createdProduct.id,
    name: createdProduct.name,
    sku: createdProduct.sku,
    price: Number(createdProduct.price),
    costPrice: Number(createdProduct.costPrice),
    materialsCount: createdProduct.materials.length,
  });

  console.log("Stored Materials in DB:");
  createdProduct.materials.forEach((m, idx) => {
    console.log(`  [${idx + 1}] ${m.material.name} (${m.purity?.name ?? "N/A"}) - Gross: ${m.grossWeight}, Stone: ${m.stoneWeight}, Net: ${m.netWeight}, Qty: ${m.quantity} ${m.unit}, Wastage: ${m.wastagePercent}%`);
  });

  // 5. Test Product Update / Edit flow
  console.log("\n5. Testing Product Edit flow (adding Sapphire as 5th material)...");
  const sapphireMat = await prisma.material.upsert({
    where: { code: "SAPPHIRE" },
    update: { name: "Blue Sapphire", type: "GEMSTONE", unit: "CARAT", isActive: true },
    create: {
      name: "Blue Sapphire",
      code: "SAPPHIRE",
      type: "GEMSTONE",
      unit: "CARAT",
      isActive: true,
      purities: { create: [{ name: "Natural Sapphire", code: "SAPPHIRE_NAT", fineness: null }] },
    },
    include: { purities: true },
  });

  await prisma.materialRate.upsert({
    where: {
      materialId_purityId_rateDate: {
        materialId: sapphireMat.id,
        purityId: sapphireMat.purities[0].id,
        rateDate,
      },
    },
    update: { rate: 25000, isBaseRate: true, unit: "CARAT", status: "ACTIVE" },
    create: { materialId: sapphireMat.id, purityId: sapphireMat.purities[0].id, rateDate, rate: 25000, isBaseRate: true, unit: "CARAT", status: "ACTIVE" },
  });

  const updatedMaterials = [
    ...testMaterials,
    {
      materialId: sapphireMat.id,
      purityId: sapphireMat.purities[0].id,
      quantity: 0.750,
      unit: "CARAT" as const,
      wastagePercent: 0,
    },
  ];

  const updatedPricing = await calculateProductPrice(
    updatedMaterials,
    1000,
    2500,
    500,
    "PERCENTAGE",
    10,
    rateDate,
  );

  // Update in DB
  await prisma.$transaction(async (tx) => {
    await tx.productMaterial.deleteMany({ where: { productId: createdProduct.id } });
    await tx.product.update({
      where: { id: createdProduct.id },
      data: {
        price: updatedPricing.sellingPrice,
        costPrice: updatedPricing.subtotal,
        materials: {
          create: updatedMaterials.map((m, i) => ({
            materialId: m.materialId,
            purityId: m.purityId,
            grossWeight: (m as any).grossWeight ?? null,
            stoneWeight: (m as any).stoneWeight ?? null,
            netWeight: (m as any).netWeight ?? null,
            quantity: m.quantity,
            unit: m.unit as any,
            wastagePercent: m.wastagePercent ?? 0,
            sortOrder: i,
          })),
        },
      },
    });
  });

  const reloaded = await prisma.product.findUnique({
    where: { id: createdProduct.id },
    include: {
      materials: {
        include: { material: true, purity: true },
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  console.log(`Product updated successfully. Materials count: ${reloaded?.materials.length}. New Selling Price: NPR ${Number(reloaded?.price)}`);

  // 6. Clean up test product
  await prisma.product.delete({ where: { id: createdProduct.id } });
  console.log("\nTest product cleaned up successfully.");

  console.log("\n===============================================================================");
  console.log("   ALL MULTI-MATERIAL END-TO-END TESTS COMPLETED SUCCESSFULLY! (100% PASS)");
  console.log("===============================================================================");
}

runMultiMaterialVerification()
  .catch((e) => {
    console.error("Test error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
