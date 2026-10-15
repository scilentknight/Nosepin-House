export async function syncRelations(tx, productId, relatedIds, crossSellIds, upSellIds) {
    await tx.productRelation.deleteMany({ where: { productId } });
    const rows = [
        ...relatedIds.map((relatedId, i) => ({ productId, relatedId, type: "RELATED", sortOrder: i })),
        ...crossSellIds.map((relatedId, i) => ({ productId, relatedId, type: "CROSS_SELL", sortOrder: i })),
        ...upSellIds.map((relatedId, i) => ({ productId, relatedId, type: "UP_SELL", sortOrder: i })),
    ].filter((r) => r.relatedId !== productId);
    if (rows.length > 0)
        await tx.productRelation.createMany({ data: rows });
}
