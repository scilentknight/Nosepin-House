import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { ok, fail, handleApiError } from "@/lib/api";
import { generateVariantSku } from "@/lib/sku";
import { generateVariantsSchema } from "@/schemas/admin-variant";

function cartesian<T>(groups: T[][]): T[][] {
  return groups.reduce<T[][]>(
    (acc, group) => acc.flatMap((combo) => group.map((value) => [...combo, value])),
    [[]]
  );
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
    const parsed = generateVariantsSchema.safeParse(body);
    if (!parsed.success) return fail(400, parsed.error.issues[0]?.message ?? "Invalid request");

    const { attributeValueGroups } = parsed.data;
    const combinations = cartesian(attributeValueGroups);

    const allValueIds = Array.from(new Set(attributeValueGroups.flat()));
    const values = await prisma.attributeValue.findMany({ where: { id: { in: allValueIds } } });
    const valueById = new Map(values.map((v) => [v.id, v]));

    const existingVariants = await prisma.productVariant.findMany({
      where: { productId: id, deletedAt: null },
      include: { attributeValues: true },
    });
    const existingKeys = new Set(
      existingVariants.map((v) => v.attributeValues.map((av) => av.attributeValueId).sort().join("|"))
    );

    let created = 0;
    let skipped = 0;

    for (const combo of combinations) {
      const key = [...combo].sort().join("|");
      if (existingKeys.has(key)) {
        skipped += 1;
        continue;
      }

      const label = combo.map((valueId) => valueById.get(valueId)?.value ?? "").join("-");
      await prisma.productVariant.create({
        data: {
          productId: id,
          sku: generateVariantSku(product.sku, label),
          price: product.price,
          compareAtPrice: product.compareAtPrice,
          costPrice: product.costPrice,
          stockQuantity: 0,
          status: "ACTIVE",
          attributeValues: { create: combo.map((attributeValueId) => ({ attributeValueId })) },
        },
      });
      existingKeys.add(key);
      created += 1;
    }

    return ok({ created, skipped }, `${created} variant(s) generated${skipped ? `, ${skipped} already existed` : ""}`);
  } catch (error) {
    return handleApiError(error);
  }
}
