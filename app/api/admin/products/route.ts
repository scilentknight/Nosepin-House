import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { ok, fail, handleApiError } from "@/lib/api";
import { parsePagination } from "@/lib/admin-query";
import { ensureUniqueSlug } from "@/lib/slug";
import { generateSku } from "@/lib/sku";
import { syncRelations } from "@/lib/product-relations";
import { productSchema } from "@/schemas/admin-product";

export async function GET(request: Request) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search")?.trim();
    const categoryIdParam = searchParams.get("categoryId");
    const brandIdParam = searchParams.get("brandId");
    const categoryId = categoryIdParam && !Number.isNaN(Number(categoryIdParam)) ? Number(categoryIdParam) : undefined;
    const brandId = brandIdParam && !Number.isNaN(Number(brandIdParam)) ? Number(brandIdParam) : undefined;
    const status = searchParams.get("status");
    const stockStatus = searchParams.get("stockStatus");
    const featured = searchParams.get("featured");
    const trashed = searchParams.get("trashed") === "true";
    const { page, pageSize, skip } = parsePagination(searchParams);

    const where: Prisma.ProductWhereInput = {
      deletedAt: trashed ? { not: null } : null,
      ...(categoryId ? { categoryId } : {}),
      ...(brandId ? { brandId } : {}),
      ...(status ? { status: status as "DRAFT" | "PUBLISHED" | "ARCHIVED" } : {}),
      ...(stockStatus ? { stockStatus: stockStatus as "IN_STOCK" | "OUT_OF_STOCK" | "ON_BACKORDER" } : {}),
      ...(featured === "true" ? { isFeatured: true } : {}),
      ...(search ? { OR: [{ name: { contains: search } }, { sku: { contains: search } }] } : {}),
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy: { createdAt: "desc" },
        include: {
          category: { select: { id: true, name: true } },
          brand: { select: { id: true, name: true } },
          images: { take: 1, orderBy: { sortOrder: "asc" } },
          _count: { select: { variants: true } },
        },
        skip,
        take: pageSize,
      }),
      prisma.product.count({ where }),
    ]);

    const data = products.map((p) => ({
      ...p,
      price: Number(p.price),
      costPrice: p.costPrice ? Number(p.costPrice) : null,
      compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null,
    }));

    return ok({ products: data, total, page, pageSize });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const parsed = productSchema.safeParse(body);
    if (!parsed.success) return fail(400, parsed.error.issues[0]?.message ?? "Invalid request");

    const data = parsed.data;
    const slug = await ensureUniqueSlug(prisma.product, data.slug || data.name);
    const sku = data.sku?.trim() || generateSku(data.name);

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
          costPrice: data.costPrice ?? null,
          price: data.price,
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
          images: {
            create: data.images.map((img, i) => ({ url: img.url, alt: img.alt, sortOrder: img.sortOrder ?? i })),
          },
        },
      });

      await syncRelations(tx, created.id, data.relatedIds, data.crossSellIds, data.upSellIds);
      return created;
    });

    return ok(product, "Product created");
  } catch (error) {
    return handleApiError(error);
  }
}
