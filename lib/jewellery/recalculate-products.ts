import { prisma } from "@/lib/prisma";
import { getCurrentMaterialRate } from "./calculate-product-price";
import { calculateJewelleryPrice } from "./pricing";

export async function recalculateAffectedProducts(
  materialId: string,
  _purityId?: string,
) {
  // Find all products that contain this material (regardless of purity)
  const products = await prisma.product.findMany({
    where: {
      materials: {
        some: {
          materialId,
        },
      },
      deletedAt: null,
    },
    include: {
      materials: true,
    },
  });

  let updatedCount = 0;
  let skippedCount = 0;
  const skippedProductIds: number[] = [];

  for (const product of products) {
    const pricingMaterials = [];
    let hasMissingRate = false;

    for (const material of product.materials) {
      const rateResult = await getCurrentMaterialRate(
        material.materialId,
        material.purityId,
        new Date(),
      );

      if (!rateResult) {
        hasMissingRate = true;
        break;
      }

      pricingMaterials.push({
        quantity: Number(material.quantity),
        rate: rateResult.rate.toNumber(),
        wastagePercent: Number(material.wastagePercent ?? 0),
      });
    }

    if (hasMissingRate) {
      skippedCount++;
      skippedProductIds.push(product.id);
      continue;
    }

    const pricing = calculateJewelleryPrice({
      materials: pricingMaterials,
      labourCharge: Number(product.labourCharge),
      makingCharge: Number(product.makingCharge),
      otherCharge: Number(product.otherCharge),
      markupType: product.markupType ?? "",
      markupValue: Number(product.markupValue ?? 0),
    });

    await prisma.product.update({
      where: {
        id: product.id,
      },
      data: {
        price: pricing.sellingPrice,
        costPrice: pricing.subtotal,
        pricingUpdatedAt: new Date(),
      },
    });

    updatedCount++;
  }

  return {
    total: products.length,
    updatedCount,
    skippedCount,
    skippedProductIds,
  };
}
