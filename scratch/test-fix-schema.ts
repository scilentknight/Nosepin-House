import { prisma } from "../lib/prisma";
import { productSchema } from "../schemas/admin-product";
import { ensureUniqueSlug } from "../lib/slug";
import { generateSku } from "../lib/sku";

async function testFix() {
  const categories = await prisma.category.findMany();
  const categoryId = categories[0].id;

  const body = {
    name: "Test Fix Product",
    slug: "test-fix-product",
    sku: "",
    categoryId: String(categoryId),
    brandId: null,
    shortDescription: "Short desc",
    fullDescription: "<p>Full desc</p>",
    costPrice: null,
    price: null, // sent by toPayload when price input is empty
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
    metaTitle: null,
    metaDescription: null,
    metaKeywords: null,
    warranty: null,
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

  console.log("Testing with null price...");
  const res = productSchema.safeParse(body);
  console.log("Validation result:", res.success ? "SUCCESS" : res.error.issues);
}

testFix().finally(() => prisma.$disconnect());
