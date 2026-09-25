import type { Prisma } from "@prisma/client";

export async function syncRelations(
  tx: Prisma.TransactionClient,
  productId: number,
  relatedIds: number[],
  crossSellIds: number[],
  upSellIds: number[]
) {
  await tx.productRelation.deleteMany({ where: { productId } });
  const rows = [
    ...relatedIds.map((relatedId, i) => ({ productId, relatedId, type: "RELATED" as const, sortOrder: i })),
    ...crossSellIds.map((relatedId, i) => ({ productId, relatedId, type: "CROSS_SELL" as const, sortOrder: i })),
    ...upSellIds.map((relatedId, i) => ({ productId, relatedId, type: "UP_SELL" as const, sortOrder: i })),
  ].filter((r) => r.relatedId !== productId);
  if (rows.length > 0) await tx.productRelation.createMany({ data: rows });
}
