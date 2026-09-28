import { prisma } from "../lib/prisma";
import { productSchema } from "../schemas/admin-product";
import { ensureUniqueSlug } from "../lib/slug";
import { generateSku } from "../lib/sku";
import { calculateProductPrice } from "../lib/jewellery/calculate-product-price";
import { syncRelations } from "../lib/product-relations";

async function testAddProduct() {
  const categories = await prisma.category.findMany();
  console.log("Categories in DB:", categories.map(c => ({ id: c.id, name: c.name })));

  if (categories.length === 0) {
    console.log("No category found! Creating a test category...");
    const cat = await prisma.category.create({
      data: {
        name: "Test Category",
        slug: "test-category",
      }
    });
    categories.push(cat);
  }

  const categoryId = categories[0].id;

  // Let's create dummy input as sent from front-end ProductForm
  const sampleFrontendBody = {
    name: "Test Nosepin Gold Ring",
    slug: "test-nosepin-gold-ring",
    sku: "",
    categoryId: String(categoryId), // note: frontend sends categoryId as string or number
    brandId: null,
    shortDescription: "A beautiful nosepin",
    fullDescription: "<p>Full description here</p>",
    costPrice: null,
    price: null,
    compareAtPrice: null,
    discountType: null,
    discountValue: null,
    taxClass: null,
    stock: 10,
    lowStockAlert: 5,
    stockStatus: "IN_STOCK",
    minimumOrderQuantity: 1,
    maximumOrderQuantity: null,
    weight: null,
    length: null,
    width: null,
    height: null,
    featuredImage: null,
    images: [],
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: false,
    isOnSale: false,
    isTrending: false,
    isSpecial: false,
    isWeekly: false,
    isFlash: false,
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
    warranty: "",
    tags: [],
    colorway: "green",
    status: "DRAFT",
    relatedIds: [],
    crossSellIds: [],
    upSellIds: [],
    materials: [],
    labourCharge: 0,
    makingCharge: 0,
    otherCharge: 0,
    markupType: null,
    markupValue: null,
  };

  console.log("Testing zod validation...");
  const parsed = productSchema.safeParse(sampleFrontendBody);
  if (!parsed.success) {
    console.error("Zod validation failed:", parsed.error.issues);
    return;
  }

  console.log("Zod validation passed:", parsed.data);
  const data = parsed.data;

  try {
    const slug = await ensureUniqueSlug(prisma.product, data.slug || data.name);
    const sku = data.sku?.trim() || generateSku(data.name);

    let finalPrice = data.price ?? 0;
    let finalCostPrice = data.costPrice ?? null;
    let pricingUpdatedAt: Date | null = null;

    if (data.materials && data.materials.length > 0) {
      const jewelleryPricing = await calculateProductPrice(
        data.materials.map((m) => ({
          materialId: m.materialId,
          purityId: m.purityId,
          quantity: m.quantity,
          wastagePercent: m.wastagePercent ?? 0,
        })),
        data.labourCharge ?? 0,
        data.makingCharge ?? 0,
        data.otherCharge ?? 0,
        (data.markupType as "PERCENTAGE" | "FIXED" | "") ?? "",
        data.markupValue ?? 0,
      );
      finalPrice = jewelleryPricing.sellingPrice;
      finalCostPrice = jewelleryPricing.subtotal;
      pricingUpdatedAt = new Date();
    }

    const product = await prisma.$transaction(async (tx) => {
      const created = await tx.product.create({
        data: {
          name: data.name,
          slug,
          sku,
          categoryId: data.categoryId,
          brandId: data.brandId || null,
          shortDescription: data.shortDescription || null,
          fullDescription: data.fullDescription,
          costPrice: finalCostPrice,
          price: finalPrice,
          compareAtPrice: data.compareAtPrice ?? null,
          discountType: data.discountType ?? null,
          discountValue: data.discountValue ?? null,
          taxClass: data.taxClass || null,
          stock: data.stock,
          lowStockAlert: data.lowStockAlert ?? null,
          stockStatus: data.stockStatus,
          minimumOrderQuantity: data.minimumOrderQuantity,
          maximumOrderQuantity: data.maximumOrderQuantity ?? null,
          weight: data.weight ?? null,
          length: data.length ?? null,
          width: data.width ?? null,
          height: data.height ?? null,
          featuredImage: data.featuredImage || null,
          isFeatured: data.isFeatured,
          isBestSeller: data.isBestSeller,
          isNewArrival: data.isNewArrival,
          isOnSale: data.isOnSale,
          isTrending: data.isTrending,
          isSpecial: data.isSpecial,
          isWeekly: data.isWeekly,
          isFlash: data.isFlash,
          metaTitle: data.metaTitle || null,
          metaDescription: data.metaDescription || null,
          metaKeywords: data.metaKeywords || null,
          warranty: data.warranty || null,
          tags: data.tags,
          colorway: data.colorway,
          status: data.status,
          publishedAt: data.status === "PUBLISHED" ? new Date() : null,
          labourCharge: data.labourCharge ?? 0,
          makingCharge: data.makingCharge ?? 0,
          otherCharge: data.otherCharge ?? 0,
          markupType: data.markupType ?? null,
          markupValue: data.markupValue ?? null,
          pricingUpdatedAt,
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
          images: {
            create: data.images.map((img, i) => ({ url: img.url, alt: img.alt, sortOrder: img.sortOrder ?? i })),
          },
        },
        include: {
          materials: { include: { material: true, purity: true } },
          images: true,
        },
      });

      await syncRelations(tx, created.id, data.relatedIds, data.crossSellIds, data.upSellIds);
      return created;
    });

    console.log("Product created successfully!", product.id, product.name);
  } catch (err) {
    console.error("Error creating product:", err);
  }
}

testAddProduct().finally(() => prisma.$disconnect());
