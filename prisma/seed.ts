import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import fs from "fs/promises";
import path from "path";

const prisma = new PrismaClient();

// Verified (downloaded + visually reviewed) unbranded stock photo IDs from Unsplash.
// Each is downloaded once into a local cache, then copied into public/uploads/**
// for every category/brand/product that uses it — the database only ever stores
// the resulting local path, never the remote Unsplash URL.
const IMAGE_POOL: Record<string, string[]> = {
  "ganoderma-coffee": [
    "1447933601403-0c6688de566e",
    "1495474472287-4d71bcdd2085",
    "1442512595331-e89e73853f31",
    "1524350876685-274059332603",
  ],
  "spirulina-supplements": [
    "1584017911766-d451b3d0e843",
    "1607619056574-7b8d3ee536b2",
    "1550572017-edd951b55104",
    "1471864190281-a93a3070b6de",
  ],
  "personal-care": ["1616394584738-fc6e612e71b9", "1607006344380-b6775a0824a7", "1608571423902-eed4a5ad8108"],
  beverages: ["1600271886742-f049cd451bba", "1544787219-7f47ccb76574", "1571934811356-5cc061b6821f"],
};

const ALL_PHOTO_IDS = Object.values(IMAGE_POOL).flat();

const downloadCache = new Map<string, string>();

async function getCachedImage(photoId: string): Promise<string> {
  const cached = downloadCache.get(photoId);
  if (cached) return cached;

  const cacheDir = path.join(process.cwd(), "public", "uploads", "_cache");
  await fs.mkdir(cacheDir, { recursive: true });
  const cachePath = path.join(cacheDir, `${photoId}.jpg`);

  try {
    await fs.access(cachePath);
  } catch {
    const url = `https://images.unsplash.com/photo-${photoId}?w=1200&q=80&auto=format&fit=crop`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to download image ${photoId}: ${res.status}`);
    const buffer = Buffer.from(await res.arrayBuffer());
    await fs.writeFile(cachePath, buffer);
  }

  downloadCache.set(photoId, cachePath);
  return cachePath;
}

async function assignImage(photoId: string, folder: string, filename: string): Promise<string> {
  const cachePath = await getCachedImage(photoId);
  const destDir = path.join(process.cwd(), "public", "uploads", folder);
  await fs.mkdir(destDir, { recursive: true });
  const destPath = path.join(destDir, filename);
  await fs.copyFile(cachePath, destPath);
  return `/uploads/${folder}/${filename}`;
}

function pick<T>(items: T[], index: number): T {
  return items[index % items.length];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomBool(probability: number): boolean {
  return Math.random() < probability;
}

const CATEGORY_TREE = [
  {
    slug: "ganoderma-coffee",
    name: "Ganoderma Coffee",
    children: [
      { slug: "coffee-3-in-1", name: "3-in-1 Coffee" },
      { slug: "coffee-black", name: "Black Coffee" },
    ],
  },
  {
    slug: "spirulina-supplements",
    name: "Spirulina & Supplements",
    children: [
      { slug: "spirulina-tablets", name: "Tablets" },
      { slug: "spirulina-capsules", name: "Capsules" },
    ],
  },
  {
    slug: "personal-care",
    name: "Personal Care",
    children: [
      { slug: "personal-care-oral", name: "Oral Care" },
      { slug: "personal-care-hair", name: "Hair Care" },
      { slug: "personal-care-skin", name: "Skin Care" },
    ],
  },
  {
    slug: "beverages",
    name: "Beverages",
    children: [
      { slug: "beverages-tea", name: "Tea" },
      { slug: "beverages-juice", name: "Juice" },
    ],
  },
];

const BRAND_NAMES = [
  "Vitalis Naturals",
  "PureLeaf Organics",
  "GreenSpore Labs",
  "EverWell Wellness",
  "NutriCore",
  "HerbalRoot Co.",
  "AquaBloom",
  "Solstice Health",
];

interface ProductTemplate {
  leafSlug: string;
  parentSlug: string;
  suffix: string;
  basePrice: number;
  colorway: string;
  tags: string[];
}

const PRODUCT_TEMPLATES: ProductTemplate[] = [
  ...["Classic", "Mocha", "Hazelnut", "Vanilla", "Extra Strength", "Decaf"].map((suffix, i) => ({
    leafSlug: "coffee-3-in-1",
    parentSlug: "ganoderma-coffee",
    suffix,
    basePrice: 780 + i * 40,
    colorway: "amber",
    tags: ["coffee", "ganoderma", "3-in-1"],
  })),
  ...["Original", "Extra Bold", "Mild Roast", "Dark Roast", "Single Origin"].map((suffix, i) => ({
    leafSlug: "coffee-black",
    parentSlug: "ganoderma-coffee",
    suffix,
    basePrice: 700 + i * 35,
    colorway: "amber",
    tags: ["coffee", "ganoderma", "black-coffee"],
  })),
  ...["250mg (100ct)", "250mg (250ct)", "500mg (100ct)", "500mg (250ct)", "500mg (500ct)"].map((suffix, i) => ({
    leafSlug: "spirulina-tablets",
    parentSlug: "spirulina-supplements",
    suffix: `Tablets ${suffix}`,
    basePrice: 900 + i * 120,
    colorway: "green",
    tags: ["spirulina", "supplement", "tablets"],
  })),
  ...["60ct", "90ct", "120ct", "180ct", "240ct"].map((suffix, i) => ({
    leafSlug: "spirulina-capsules",
    parentSlug: "spirulina-supplements",
    suffix: `Capsules ${suffix}`,
    basePrice: 750 + i * 110,
    colorway: "green",
    tags: ["spirulina", "supplement", "capsules"],
  })),
  ...["Toothpaste", "Mouthwash", "Toothbrush Set", "Whitening Gel", "Kids Toothpaste"].map((suffix, i) => ({
    leafSlug: "personal-care-oral",
    parentSlug: "personal-care",
    suffix,
    basePrice: 220 + i * 40,
    colorway: "blue",
    tags: ["oral-care", "ganozhi"],
  })),
  ...["Shampoo", "Conditioner", "Hair Oil", "Anti-Dandruff Shampoo", "Hair Serum"].map((suffix, i) => ({
    leafSlug: "personal-care-hair",
    parentSlug: "personal-care",
    suffix,
    basePrice: 380 + i * 45,
    colorway: "blue",
    tags: ["hair-care", "ganozhi"],
  })),
  ...["Herbal Soap", "Face Wash", "Body Lotion", "Face Cream", "Body Scrub"].map((suffix, i) => ({
    leafSlug: "personal-care-skin",
    parentSlug: "personal-care",
    suffix,
    basePrice: 260 + i * 50,
    colorway: "green",
    tags: ["skin-care", "ganozhi"],
  })),
  ...["Black Tea", "Green Tea", "Herbal Tea", "Iced Tea Mix", "Chamomile Tea"].map((suffix, i) => ({
    leafSlug: "beverages-tea",
    parentSlug: "beverages",
    suffix,
    basePrice: 480 + i * 35,
    colorway: "red",
    tags: ["tea", "beverage"],
  })),
  ...["Roselle Concentrate", "Mixed Berry", "Aloe Vera", "Pomegranate", "Ginger Lemon"].map((suffix, i) => ({
    leafSlug: "beverages-juice",
    parentSlug: "beverages",
    suffix,
    basePrice: 420 + i * 40,
    colorway: "red",
    tags: ["juice", "beverage"],
  })),
];

async function seedAdminAndCoupon() {
  const passwordHash = await bcrypt.hash("Admin@123", 10);
  await prisma.user.upsert({
    where: { email: "admin@dxn.com" },
    update: { name: "Store Admin" },
    create: { name: "Store Admin", email: "admin@dxn.com", passwordHash, role: "ADMIN" },
  });
  console.log("Seeded admin user: admin@dxn.com / Admin@123");

  await prisma.coupon.upsert({
    where: { code: "WELCOME10" },
    update: {},
    create: { code: "WELCOME10", type: "PERCENT", value: 10, minOrderAmount: 1000, active: true },
  });
  console.log("Seeded coupon: WELCOME10 (10% off orders over Rs. 1000)");
}

async function seedCategories(): Promise<Record<string, number>> {
  const categoryIds: Record<string, number> = {};
  let sortOrder = 0;

  for (const parent of CATEGORY_TREE) {
    const pool = IMAGE_POOL[parent.slug];
    const image = await assignImage(pool[0], "categories", `${parent.slug}.jpg`);
    const bannerImage = await assignImage(pool[pool.length - 1], "categories", `${parent.slug}-banner.jpg`);

    const created = await prisma.category.upsert({
      where: { slug: parent.slug },
      update: { name: parent.name, image, bannerImage, sortOrder, status: "ACTIVE" },
      create: {
        name: parent.name,
        slug: parent.slug,
        image,
        bannerImage,
        sortOrder,
        status: "ACTIVE",
        isFeatured: sortOrder < 2,
      },
    });
    categoryIds[parent.slug] = created.id;
    sortOrder += 1;

    let childOrder = 0;
    for (const child of parent.children) {
      const childImage = await assignImage(pick(pool, childOrder + 1), "categories", `${child.slug}.jpg`);
      const createdChild = await prisma.category.upsert({
        where: { slug: child.slug },
        update: { name: child.name, image: childImage, parentCategoryId: created.id, sortOrder: childOrder },
        create: {
          name: child.name,
          slug: child.slug,
          image: childImage,
          parentCategoryId: created.id,
          sortOrder: childOrder,
          status: "ACTIVE",
        },
      });
      categoryIds[child.slug] = createdChild.id;
      childOrder += 1;
    }
  }

  console.log(`Seeded ${Object.keys(categoryIds).length} categories (with parent/child tree)`);
  return categoryIds;
}

async function seedBrands(): Promise<number[]> {
  const brandIds: number[] = [];
  for (let i = 0; i < BRAND_NAMES.length; i++) {
    const name = BRAND_NAMES[i];
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    const logo = await assignImage(pick(ALL_PHOTO_IDS, i), "brands", `${slug}-logo.jpg`);
    const banner = await assignImage(pick(ALL_PHOTO_IDS, i + 3), "brands", `${slug}-banner.jpg`);

    const brand = await prisma.brand.upsert({
      where: { slug },
      update: { name, logo, banner },
      create: {
        name,
        slug,
        logo,
        banner,
        description: `${name} formulates natural wellness products with quality ingredients you can trust.`,
        sortOrder: i,
        isFeatured: i < 3,
        status: "ACTIVE",
      },
    });
    brandIds.push(brand.id);
  }
  console.log(`Seeded ${brandIds.length} brands`);
  return brandIds;
}

async function seedProducts(categoryIds: Record<string, number>, brandIds: number[]) {
  let created = 0;

  for (let i = 0; i < PRODUCT_TEMPLATES.length; i++) {
    const tpl = PRODUCT_TEMPLATES[i];
    const name = `${tpl.suffix} — ${CATEGORY_TREE.find((c) => c.slug === tpl.parentSlug)?.name}`;
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");

    const stock = randomInt(0, 120);
    const isOnSale = randomBool(0.3);
    const price = tpl.basePrice + randomInt(-30, 30);
    const compareAtPrice = isOnSale ? Math.round(price * 1.15) : null;
    const status: "DRAFT" | "PUBLISHED" | "ARCHIVED" = randomBool(0.08)
      ? "DRAFT"
      : randomBool(0.04)
      ? "ARCHIVED"
      : "PUBLISHED";

    const pool = IMAGE_POOL[tpl.parentSlug];
    const featuredImage = await assignImage(pick(pool, i), "products", `${slug}-featured.jpg`);
    const galleryCount = randomInt(2, 3);
    const gallery = [];
    for (let g = 0; g < galleryCount; g++) {
      const url = await assignImage(pick(pool, i + g + 1), "products", `${slug}-${g + 1}.jpg`);
      gallery.push({ url, alt: `${name} photo ${g + 1}`, sortOrder: g });
    }

    const product = await prisma.product.upsert({
      where: { slug },
      update: {
        name,
        categoryId: categoryIds[tpl.leafSlug],
        brandId: pick(brandIds, i),
        price,
        compareAtPrice,
        stock,
        stockStatus: stock === 0 ? "OUT_OF_STOCK" : "IN_STOCK",
        colorway: tpl.colorway,
        status,
      },
      create: {
        name,
        slug,
        sku: `SKU-${slug.slice(0, 6).toUpperCase()}-${1000 + i}`,
        categoryId: categoryIds[tpl.leafSlug],
        brandId: pick(brandIds, i),
        shortDescription: `${tpl.suffix} from our ${CATEGORY_TREE.find((c) => c.slug === tpl.parentSlug)?.name} range.`,
        fullDescription: `<p>${name} is crafted for daily wellness, combining quality ingredients with modern manufacturing standards. Perfect for anyone looking to make natural products part of their routine.</p>`,
        costPrice: Math.round(price * 0.6),
        price,
        compareAtPrice,
        isOnSale,
        stock,
        lowStockAlert: 10,
        stockStatus: stock === 0 ? "OUT_OF_STOCK" : "IN_STOCK",
        minimumOrderQuantity: 1,
        maximumOrderQuantity: 10,
        weight: Math.round((0.1 + Math.random() * 0.9) * 1000) / 1000,
        featuredImage,
        isFeatured: randomBool(0.15),
        isBestSeller: randomBool(0.15),
        isNewArrival: randomBool(0.15),
        isTrending: randomBool(0.1),
        metaTitle: name,
        metaDescription: `Buy ${name} online — natural wellness products with fast delivery.`,
        warranty: null,
        tags: tpl.tags,
        colorway: tpl.colorway,
        status,
        publishedAt: status === "PUBLISHED" ? new Date() : null,
      },
    });

    await prisma.productImage.deleteMany({ where: { productId: product.id } });
    await prisma.productImage.createMany({ data: gallery.map((g) => ({ ...g, productId: product.id })) });

    created += 1;
  }

  console.log(`Seeded ${created} products with locally-stored images`);
}

async function seedProductVariants() {
  const colorAttribute = await prisma.attribute.upsert({
    where: { name: "Color" },
    update: {},
    create: { name: "Color", slug: "color", sortOrder: 0 },
  });
  const sizeAttribute = await prisma.attribute.upsert({
    where: { name: "Pack Size" },
    update: {},
    create: { name: "Pack Size", slug: "pack-size", sortOrder: 1 },
  });

  const colorValues = await Promise.all(
    ["Red", "Blue", "Green"].map((value, i) =>
      prisma.attributeValue.upsert({
        where: { attributeId_value: { attributeId: colorAttribute.id, value } },
        update: {},
        create: { attributeId: colorAttribute.id, value, slug: value.toLowerCase(), sortOrder: i },
      })
    )
  );
  const sizeValues = await Promise.all(
    ["Small", "Medium", "Large"].map((value, i) =>
      prisma.attributeValue.upsert({
        where: { attributeId_value: { attributeId: sizeAttribute.id, value } },
        update: {},
        create: { attributeId: sizeAttribute.id, value, slug: value.toLowerCase(), sortOrder: i },
      })
    )
  );

  // Spread variants across every category (not just personal care) so the variant
  // selector on the product page has plenty of real products to show off.
  const variantProducts = await prisma.product.findMany({
    orderBy: { id: "asc" },
    take: 20,
  });

  let variantCount = 0;
  for (const product of variantProducts) {
    for (const color of colorValues) {
      for (const size of sizeValues) {
        const existing = await prisma.productVariant.findFirst({
          where: {
            productId: product.id,
            attributeValues: { some: { attributeValueId: color.id } },
            AND: [{ attributeValues: { some: { attributeValueId: size.id } } }],
          },
        });
        if (existing) continue;

        await prisma.productVariant.create({
          data: {
            productId: product.id,
            sku: `${product.sku}-${color.value.slice(0, 2).toUpperCase()}-${size.value.slice(0, 1).toUpperCase()}`,
            price: product.price,
            compareAtPrice: product.compareAtPrice,
            costPrice: product.costPrice,
            stockQuantity: randomInt(5, 40),
            status: "ACTIVE",
            attributeValues: { create: [{ attributeValueId: color.id }, { attributeValueId: size.id }] },
          },
        });
        variantCount += 1;
      }
    }
  }

  console.log(`Seeded ${variantCount} product variants across ${variantProducts.length} products`);
}

async function seedHomeBanners() {
  const slides = [
    {
      title: "Live Well with DXN",
      subtitle: "Ganoderma coffee, spirulina & natural wellness essentials",
      image: "/images/hero-banner.jpg",
      linkUrl: "/shop",
      buttonText: "Shop Now",
      sortOrder: 0,
    },
    {
      title: "Spirulina & Supplements",
      subtitle: "Boost your daily wellness routine",
      image: "/images/hero-banner.jpg",
      linkUrl: "/shop?category=spirulina-supplements",
      buttonText: "Explore",
      sortOrder: 1,
    },
  ];

  for (const slide of slides) {
    const existing = await prisma.homeBannerSlide.findFirst({ where: { title: slide.title } });
    if (existing) continue;
    await prisma.homeBannerSlide.create({ data: { ...slide, active: true } });
  }
  console.log(`Seeded ${slides.length} home banner slides`);
}

async function seedShippingAndTax() {
  await prisma.shippingZone.upsert({
    where: { country: "Nepal" },
    update: {},
    create: {
      country: "Nepal",
      label: "Nepal Domestic Shipping",
      rate: 100,
      freeShippingMinOrder: 3000,
      isDefault: false,
    },
  });
  await prisma.shippingZone.upsert({
    where: { country: "International" },
    update: {},
    create: {
      country: "International",
      label: "International Shipping",
      rate: 1500,
      isDefault: true,
    },
  });

  await prisma.taxRate.upsert({
    where: { country: "Nepal" },
    update: {},
    create: { country: "Nepal", label: "VAT", percent: 13 },
  });

  console.log("Seeded shipping zones (Nepal + International) and Nepal VAT (13%)");
}

interface AddressBookProvinceRaw {
  id: number;
  name: string;
}
interface AddressBookDistrictRaw {
  id: number;
  provinceId: number;
  name: string;
}
interface AddressBookMunicipalityRaw {
  id: number;
  districtId: number;
  name: string;
  municipalityType: "METROPOLITAN" | "SUB_METROPOLITAN" | "MUNICIPALITY" | "RURAL_MUNICIPALITY";
  wardCount: number;
}

/** Seeds the Province -> District -> Municipality tree from the official Nepal admin-division dataset. */
async function seedAddressBook() {
  if ((await prisma.addressBook.count()) > 0) {
    console.log("AddressBook already seeded, skipping");
    return;
  }

  const raw = await fs.readFile(path.join(process.cwd(), "prisma", "data", "nepal-address-book.json"), "utf-8");
  const { provinces, districts, municipalities } = JSON.parse(raw) as {
    provinces: AddressBookProvinceRaw[];
    districts: AddressBookDistrictRaw[];
    municipalities: AddressBookMunicipalityRaw[];
  };

  const provinceIdMap = new Map<number, number>();
  for (const p of provinces) {
    const created = await prisma.addressBook.create({ data: { level: "PROVINCE", name: p.name } });
    provinceIdMap.set(p.id, created.id);
  }

  const districtIdMap = new Map<number, number>();
  for (const d of districts) {
    const parentId = provinceIdMap.get(d.provinceId);
    if (!parentId) continue;
    const created = await prisma.addressBook.create({ data: { level: "DISTRICT", name: d.name, parentId } });
    districtIdMap.set(d.id, created.id);
  }

  for (const m of municipalities) {
    const parentId = districtIdMap.get(m.districtId);
    if (!parentId) continue;
    await prisma.addressBook.create({
      data: {
        level: "MUNICIPALITY",
        name: m.name,
        parentId,
        municipalityType: m.municipalityType,
        wardCount: m.wardCount,
      },
    });
  }

  console.log(
    `Seeded AddressBook: ${provinces.length} provinces, ${districts.length} districts, ${municipalities.length} municipalities`
  );
}

/**
 * Backfills any Address row that predates the province/municipality/ward columns (i.e. still has
 * a null provinceId). Raw SQL throughout: the generated client is typed against the final
 * NOT-NULL schema, so its normal model API can't deserialize a row that's still mid-migration.
 */
async function backfillLegacyAddresses() {
  const rows = await prisma.$queryRawUnsafe<{ id: number }[]>("SELECT id FROM `Address` WHERE `provinceId` IS NULL");
  if (rows.length === 0) return;

  const bagmati = await prisma.addressBook.findFirst({ where: { level: "PROVINCE", name: "Bagmati Province" } });
  const kathmandu = await prisma.addressBook.findFirst({
    where: { level: "MUNICIPALITY", name: "Kathmandu Metropolitan City" },
  });
  if (!bagmati || !kathmandu) {
    console.warn("Could not find Bagmati Province / Kathmandu Metropolitan City to backfill legacy addresses");
    return;
  }

  for (const row of rows) {
    await prisma.$executeRawUnsafe(
      "UPDATE `Address` SET `provinceId` = ?, `municipalityId` = ?, `wardNo` = 1 WHERE `id` = ?",
      bagmati.id,
      kathmandu.id,
      row.id
    );
    console.log(`Backfilled legacy address #${row.id} -> Bagmati Province / Kathmandu Metropolitan City / Ward 1`);
  }
}

async function main() {
  await seedAdminAndCoupon();
  const categoryIds = await seedCategories();
  const brandIds = await seedBrands();
  await seedProducts(categoryIds, brandIds);
  await seedProductVariants();
  await seedHomeBanners();
  await seedShippingAndTax();
  await seedAddressBook();
  await backfillLegacyAddresses();
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
