import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { ok, fail, handleApiError } from "@/lib/api";
import { ensureUniqueSlug } from "@/lib/slug";
import { productSchema } from "@/schemas/admin-product";
import { syncRelations } from "@/lib/product-relations";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id: rawId } = await params;
    const id = Number(rawId);
    if (Number.isNaN(id)) return fail(400, "Invalid product id");

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        relationsFrom: { include: { related: { select: { id: true, name: true } } } },
      },
    });
    if (!product) return fail(404, "Product not found");

    return ok({
      ...product,
      price: Number(product.price),
      costPrice: product.costPrice ? Number(product.costPrice) : null,
      compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
      discountValue: product.discountValue ? Number(product.discountValue) : null,
      weight: product.weight ? Number(product.weight) : null,
      length: product.length ? Number(product.length) : null,
      width: product.width ? Number(product.width) : null,
      height: product.height ? Number(product.height) : null,
      relatedIds: product.relationsFrom.filter((r) => r.type === "RELATED").map((r) => r.relatedId),
      crossSellIds: product.relationsFrom.filter((r) => r.type === "CROSS_SELL").map((r) => r.relatedId),
      upSellIds: product.relationsFrom.filter((r) => r.type === "UP_SELL").map((r) => r.relatedId),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id: rawId } = await params;
    const id = Number(rawId);
    if (Number.isNaN(id)) return fail(400, "Invalid product id");

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) return fail(404, "Product not found");

    const body = await request.json();
    const parsed = productSchema.safeParse(body);
    if (!parsed.success) return fail(400, parsed.error.issues[0]?.message ?? "Invalid request");

    const data = parsed.data;
    const desiredSlug = data.slug?.trim() || data.name;
    const slug = desiredSlug === existing.slug ? existing.slug : await ensureUniqueSlug(prisma.product, desiredSlug, id);
    const sku = data.sku?.trim() || existing.sku;

    const wasPublished = existing.status === "PUBLISHED";
    const isPublished = data.status === "PUBLISHED";

    const product = await prisma.$transaction(async (tx) => {
      await tx.productImage.deleteMany({ where: { productId: id } });

      const updated = await tx.product.update({
        where: { id },
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
          publishedAt: !wasPublished && isPublished ? new Date() : existing.publishedAt,
          images: {
            create: data.images.map((img, i) => ({ url: img.url, alt: img.alt, sortOrder: img.sortOrder ?? i })),
          },
        },
      });

      await syncRelations(tx, id, data.relatedIds, data.crossSellIds, data.upSellIds);
      return updated;
    });

    return ok(product, "Product updated");
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id: rawId } = await params;
    const id = Number(rawId);
    if (Number.isNaN(id)) return fail(400, "Invalid product id");

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) return fail(404, "Product not found");

    await prisma.product.update({ where: { id }, data: { deletedAt: new Date() } });
    return ok(null, "Product moved to trash");
  } catch (error) {
    return handleApiError(error);
  }
}
