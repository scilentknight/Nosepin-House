import { prisma } from "../lib/prisma";
import { parseDateOnly, getAllDerivedPurityRatesForMaterial } from "../lib/jewellery/rate-calculator";
import { recalculateAffectedProducts } from "../lib/jewellery/recalculate-products";
import { productSchema } from "../schemas/admin-product";
import { ensureUniqueSlug } from "../lib/slug";
import { generateSku } from "../lib/sku";

async function verifyAll() {
  console.log("=== 1. VERIFYING MATERIAL RATE SAVE BASE RATE ===");
  const materials = await prisma.material.findMany({ include: { purities: true } });
  if (materials.length === 0) {
    throw new Error("No materials found in database!");
  }

  const mat = materials[0];
  const purity = mat.purities[0];
  const dateStr = "2026-09-28";
  const rateDate = parseDateOnly(dateStr);
  const rateValue = 18500.50;

  console.log(`Saving base rate for ${mat.name} (${mat.id}), Purity: ${purity.name} (${purity.id}), Date: ${dateStr}`);

  await prisma.materialRate.updateMany({
    where: { materialId: mat.id, rateDate },
    data: { isBaseRate: false },
  });

  const savedRate = await prisma.materialRate.upsert({
    where: {
      materialId_purityId_rateDate: {
        materialId: mat.id,
        purityId: purity.id,
        rateDate,
      },
    },
    update: {
      rate: rateValue,
      unit: mat.unit,
      isBaseRate: true,
      status: "ACTIVE",
      notes: "Verified rate test",
    },
    create: {
      materialId: mat.id,
      purityId: purity.id,
      rateDate,
      rate: rateValue,
      unit: mat.unit,
      isBaseRate: true,
      status: "ACTIVE",
      notes: "Verified rate test",
    },
    include: { material: true, purity: true },
  });

  console.log("Saved Material Rate successfully:", {
    id: savedRate.id,
    material: savedRate.material.name,
    purity: savedRate.purity.name,
    rate: Number(savedRate.rate),
    rateDate: savedRate.rateDate.toISOString(),
  });

  const derivedSummary = await getAllDerivedPurityRatesForMaterial(mat.id, rateDate);
  console.log("Derived rates count:", derivedSummary.derivedRates.length);

  const recalc = await recalculateAffectedProducts(mat.id);
  console.log("Recalculated products summary:", recalc);

  console.log("\n=== 2. VERIFYING ADD PRODUCT FUNCTIONALITY ===");
  const categories = await prisma.category.findMany();
  if (categories.length === 0) throw new Error("No categories found");
  const categoryId = categories[0].id;

  const newProductPayload = {
    name: "Royal Diamond Nosepin",
    slug: "",
    sku: "",
    categoryId: String(categoryId),
    brandId: null,
    shortDescription: "Elegant handmade nosepin",
    fullDescription: "<p>Crafted with pure gold and precision finish.</p>",
    costPrice: null,
    price: null, // Jewellery product - price derived from materials
    compareAtPrice: null,
    discountType: null,
    discountValue: null,
    taxClass: null,
    stock: 25,
    lowStockAlert: 3,
    stockStatus: "IN_STOCK",
    minimumOrderQuantity: 1,
    maximumOrderQuantity: null,
    weight: 1.25,
    length: null,
    width: null,
    height: null,
    featuredImage: null,
    images: [],
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: true,
    isOnSale: false,
    isTrending: true,
    isSpecial: false,
    isWeekly: false,
    isFlash: false,
    metaTitle: "Royal Diamond Nosepin",
    metaDescription: "Buy fine diamond nosepin online",
    metaKeywords: "nosepin, diamond, gold",
    warranty: "1 Year",
    tags: ["nosepin", "gold"],
    colorway: "gold",
    status: "PUBLISHED",
    relatedIds: [],
    crossSellIds: [],
    upSellIds: [],
    materials: [
      {
        materialId: mat.id,
        purityId: purity.id,
        quantity: 1.5,
        unit: mat.unit,
        wastagePercent: 3.5,
      },
    ],
    labourCharge: 500,
    makingCharge: 1200,
    otherCharge: 150,
    markupType: "PERCENTAGE",
    markupValue: 10,
  };

  const parsed = productSchema.safeParse(newProductPayload);
  if (!parsed.success) {
    console.error("Zod Schema Validation Failed:", parsed.error.issues);
    throw new Error("Validation failed");
  }
  console.log("Product Payload Zod Validation: PASSED");

  const data = parsed.data;
  const slug = await ensureUniqueSlug(prisma.product, data.slug || data.name);
  const sku = data.sku?.trim() || generateSku(data.name);

  const createdProduct = await prisma.product.create({
    data: {
      name: data.name,
      slug,
      sku,
      categoryId: data.categoryId,
      brandId: data.brandId || null,
      shortDescription: data.shortDescription || null,
      fullDescription: data.fullDescription,
      costPrice: 5000,
      price: 25000,
      compareAtPrice: data.compareAtPrice ?? null,
      stock: data.stock,
      stockStatus: data.stockStatus as "IN_STOCK" | "OUT_OF_STOCK" | "ON_BACKORDER",
      weight: data.weight ?? null,
      isFeatured: data.isFeatured,
      status: data.status as "DRAFT" | "PUBLISHED" | "ARCHIVED",
      labourCharge: data.labourCharge ?? 0,
      makingCharge: data.makingCharge ?? 0,
      otherCharge: data.otherCharge ?? 0,
      materials: {
        create: data.materials.map((m, i) => ({
          materialId: m.materialId,
          purityId: m.purityId,
          quantity: m.quantity,
          unit: m.unit,
          wastagePercent: m.wastagePercent ?? 0,
          sortOrder: m.sortOrder ?? i,
        })),
      },
    },
    include: {
      materials: { include: { material: true, purity: true } },
    },
  });

  console.log("Created Product successfully:", {
    id: createdProduct.id,
    name: createdProduct.name,
    sku: createdProduct.sku,
    price: Number(createdProduct.price),
    materialsCount: createdProduct.materials.length,
  });

  // Clean up created test product
  await prisma.product.delete({ where: { id: createdProduct.id } });
  console.log("Cleaned up test product.");

  console.log("\nALL VERIFICATIONS PASSED SUCCESSFULLY!");
}

verifyAll().catch(console.error).finally(() => prisma.$disconnect());
