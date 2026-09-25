import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { ok, fail, handleApiError } from "@/lib/api";
import { ensureUniqueSlug } from "@/lib/slug";
import { generateSku } from "@/lib/sku";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id: rawId } = await params;
    const id = Number(rawId);
    if (Number.isNaN(id)) return fail(400, "Invalid product id");

    const source = await prisma.product.findUnique({
      where: { id },
      include: {
        images: true,
        variants: { include: { attributeValues: true }, where: { deletedAt: null } },
      },
    });
    if (!source) return fail(404, "Product not found");

    const slug = await ensureUniqueSlug(prisma.product, `${source.name}-copy`);

    const duplicate = await prisma.$transaction(async (tx) => {
      const created = await tx.product.create({
        data: {
          name: `${source.name} (Copy)`,
          slug,
          sku: generateSku(source.name),
          categoryId: source.categoryId,
          brandId: source.brandId,
          shortDescription: source.shortDescription,
          fullDescription: source.fullDescription,
          costPrice: source.costPrice,
          price: source.price,
          compareAtPrice: source.compareAtPrice,
          discountType: source.discountType,
          discountValue: source.discountValue,
          taxClass: source.taxClass,
          stock: source.stock,
          lowStockAlert: source.lowStockAlert,
          stockStatus: source.stockStatus,
          minimumOrderQuantity: source.minimumOrderQuantity,
          maximumOrderQuantity: source.maximumOrderQuantity,
          weight: source.weight,
          length: source.length,
          width: source.width,
          height: source.height,
          featuredImage: source.featuredImage,
          isFeatured: source.isFeatured,
          isBestSeller: source.isBestSeller,
          isNewArrival: source.isNewArrival,
          isOnSale: source.isOnSale,
          isTrending: source.isTrending,
          isSpecial: source.isSpecial,
          isWeekly: source.isWeekly,
          isFlash: source.isFlash,
          metaTitle: source.metaTitle,
          metaDescription: source.metaDescription,
          metaKeywords: source.metaKeywords,
          warranty: source.warranty,
          tags: source.tags ?? undefined,
          colorway: source.colorway,
          status: "DRAFT",
          images: {
            create: source.images.map((img) => ({ url: img.url, alt: img.alt, sortOrder: img.sortOrder })),
          },
        },
      });

      for (const variant of source.variants) {
        await tx.productVariant.create({
          data: {
            productId: created.id,
            sku: variant.sku ? `${variant.sku}-COPY` : null,
            price: variant.price,
            compareAtPrice: variant.compareAtPrice,
            costPrice: variant.costPrice,
            stockQuantity: variant.stockQuantity,
            lowStockAlert: variant.lowStockAlert,
            weight: variant.weight,
            image: variant.image,
            status: variant.status,
            attributeValues: {
              create: variant.attributeValues.map((av) => ({ attributeValueId: av.attributeValueId })),
            },
          },
        });
      }

      return created;
    });

    return ok(duplicate, "Product duplicated");
  } catch (error) {
    return handleApiError(error);
  }
}
