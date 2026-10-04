import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { ok, fail, handleApiError } from "@/lib/api";
import { ensureUniqueSlug } from "@/lib/slug";
import { productSchema } from "@/schemas/admin-product";
import { syncRelations } from "@/lib/product-relations";
import { calculateProductPrice } from "@/lib/jewellery/calculate-product-price";

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
        materials: {
          include: { material: true, purity: true },
          orderBy: { sortOrder: "asc" },
        },
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
      labourCharge: String(product.labourCharge ?? 0),
      makingCharge: String(product.makingCharge ?? 0),
      otherCharge: String(product.otherCharge ?? 0),
      markupType: product.markupType ?? "",
      markupValue: product.markupValue ? String(product.markupValue) : "",
      materials: product.materials.map((m) => ({
        id: m.id,
        materialId: m.materialId,
        purityId: m.purityId ?? "",
        grossWeight: m.grossWeight !== null && m.grossWeight !== undefined ? String(m.grossWeight) : "",
        stoneWeight: m.stoneWeight !== null && m.stoneWeight !== undefined ? String(m.stoneWeight) : "",
        netWeight: m.netWeight !== null && m.netWeight !== undefined ? String(m.netWeight) : "",
        quantity: String(m.quantity),
        unit: m.unit,
        wastagePercent: m.wastagePercent !== null && m.wastagePercent !== undefined ? String(m.wastagePercent) : "0",
        sortOrder: m.sortOrder,
      })),
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

    let finalPrice = data.price ?? Number(existing.price);
    let finalCostPrice = data.costPrice ?? (existing.costPrice ? Number(existing.costPrice) : null);
    let pricingUpdatedAt = existing.pricingUpdatedAt;

    if (data.materials && data.materials.length > 0) {
      const jewelleryPricing = await calculateProductPrice(
        data.materials.map((m) => ({
          materialId: m.materialId,
          purityId: m.purityId,
          grossWeight: m.grossWeight,
          stoneWeight: m.stoneWeight,
          netWeight: m.netWeight,
          quantity: m.quantity,
          unit: m.unit,
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
      await tx.productImage.deleteMany({ where: { productId: id } });
      await tx.productMaterial.deleteMany({ where: { productId: id } });

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
          publishedAt: !wasPublished && isPublished ? new Date() : existing.publishedAt,
          labourCharge: data.labourCharge ?? 0,
          makingCharge: data.makingCharge ?? 0,
          otherCharge: data.otherCharge ?? 0,
          markupType: data.markupType ?? null,
          markupValue: data.markupValue ?? null,
          pricingUpdatedAt,
          materials: {
            create: data.materials.map((m, i) => ({
              materialId: m.materialId,
              purityId: m.purityId && m.purityId.trim() !== "" ? m.purityId : null,
              grossWeight: m.grossWeight !== null && m.grossWeight !== undefined ? m.grossWeight : null,
              stoneWeight: m.stoneWeight !== null && m.stoneWeight !== undefined ? m.stoneWeight : null,
              netWeight: m.netWeight !== null && m.netWeight !== undefined ? m.netWeight : null,
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
