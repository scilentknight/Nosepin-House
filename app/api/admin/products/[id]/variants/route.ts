import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { ok, fail, handleApiError } from "@/lib/api";
import { variantSchema } from "@/schemas/admin-variant";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id: rawId } = await params;
    const id = Number(rawId);
    if (Number.isNaN(id)) return fail(400, "Invalid product id");
    const { searchParams } = new URL(request.url);
    const trashed = searchParams.get("trashed") === "true";

    const variants = await prisma.productVariant.findMany({
      where: { productId: id, deletedAt: trashed ? { not: null } : null },
      orderBy: { createdAt: "asc" },
      include: { attributeValues: { include: { attributeValue: { include: { attribute: true } } } } },
    });

    const data = variants.map((v) => ({
      ...v,
      price: v.price ? Number(v.price) : null,
      compareAtPrice: v.compareAtPrice ? Number(v.compareAtPrice) : null,
      costPrice: v.costPrice ? Number(v.costPrice) : null,
      weight: v.weight ? Number(v.weight) : null,
      attributeValueIds: v.attributeValues.map((av) => av.attributeValueId),
      label: v.attributeValues.map((av) => av.attributeValue.value).join(" / "),
    }));

    return ok(data);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id: rawId } = await params;
    const id = Number(rawId);
    if (Number.isNaN(id)) return fail(400, "Invalid product id");

    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) return fail(404, "Product not found");

    const body = await request.json();
    const parsed = variantSchema.safeParse(body);
    if (!parsed.success) return fail(400, parsed.error.issues[0]?.message ?? "Invalid request");

    const data = parsed.data;
    const variant = await prisma.productVariant.create({
      data: {
        productId: id,
        sku: data.sku || null,
        price: data.price ?? null,
        compareAtPrice: data.compareAtPrice ?? null,
        costPrice: data.costPrice ?? null,
        stockQuantity: data.stockQuantity,
        lowStockAlert: data.lowStockAlert ?? null,
        weight: data.weight ?? null,
        image: data.image || null,
        status: data.status,
        attributeValues: { create: data.attributeValueIds.map((attributeValueId) => ({ attributeValueId })) },
      },
    });

    return ok(variant, "Variant created");
  } catch (error) {
    return handleApiError(error);
  }
}
