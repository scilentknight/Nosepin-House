// import { prisma } from "@/lib/prisma";
// import { getCurrentMaterialRate } from "./calculate-product-price";
// import { calculateJewelleryPrice } from "./pricing";

// export async function recalculateAffectedProducts(
//   materialId: string,
//   _purityId?: string,
// ) {
//   // Find all products that contain this material (regardless of purity)
//   const products = await prisma.product.findMany({
//     where: {
//       materials: {
//         some: {
//           materialId,
//         },
//       },
//       deletedAt: null,
//     },
//     include: {
//       materials: true,
//     },
//   });

//   let updatedCount = 0;
//   let skippedCount = 0;
//   const skippedProductIds: number[] = [];

//   for (const product of products) {
//     const pricingMaterials = [];
//     let hasMissingRate = false;

//     for (const material of product.materials) {
//       const rateResult = await getCurrentMaterialRate(
//         material.materialId,
//         material.purityId,
//         new Date(),
//       );

//       if (!rateResult) {
//         hasMissingRate = true;
//         break;
//       }

//       pricingMaterials.push({
//         quantity: Number(material.quantity),
//         rate: rateResult.rate.toNumber(),
//         wastagePercent: Number(material.wastagePercent ?? 0),
//       });
//     }

//     if (hasMissingRate) {
//       skippedCount++;
//       skippedProductIds.push(product.id);
//       continue;
//     }

//     const pricing = calculateJewelleryPrice({
//       materials: pricingMaterials,
//       labourCharge: Number(product.labourCharge),
//       makingCharge: Number(product.makingCharge),
//       otherCharge: Number(product.otherCharge),
//       markupType: product.markupType ?? "",
//       markupValue: Number(product.markupValue ?? 0),
//     });

//     await prisma.product.update({
//       where: {
//         id: product.id,
//       },
//       data: {
//         price: pricing.sellingPrice,
//         costPrice: pricing.subtotal,
//         pricingUpdatedAt: new Date(),
//       },
//     });

//     updatedCount++;
//   }

//   return {
//     total: products.length,
//     updatedCount,
//     skippedCount,
//     skippedProductIds,
//   };
// }

import { prisma } from "@/lib/prisma";
import { calculateProductPrice } from "./calculate-product-price";

export async function recalculateAffectedProducts(
  materialId: string,
  purityId?: string,
  targetDate: Date = new Date(),
) {
  /**
   * If a specific purity is supplied, find products using that
   * material + purity.
   *
   * If no purity is supplied, recalculate every product using
   * the material. This is useful when a base purity rate changes
   * and derived purity rates are affected as well.
   */
  const products = await prisma.product.findMany({
    where: {
      materials: {
        some: {
          materialId,
          ...(purityId ? { purityId } : {}),
        },
      },
      deletedAt: null,
    },
    include: {
      materials: {
        orderBy: {
          sortOrder: "asc",
        },
      },
    },
  });

  let updatedCount = 0;
  let skippedCount = 0;

  const skippedProductIds: number[] = [];
  const errors: {
    productId: number;
    productName: string;
    message: string;
  }[] = [];

  for (const product of products) {
    try {
      if (product.materials.length === 0) {
        skippedCount++;
        skippedProductIds.push(product.id);
        continue;
      }

      /**
       * Recalculate the complete product price from:
       *
       * - all product materials
       * - current material rates
       * - wastage
       * - labour charge
       * - making charge
       * - other charge
       * - markup
       *
       * We intentionally do NOT calculate:
       *
       * oldPrice + rateDifference
       *
       * because that can accumulate pricing errors.
       */
      const pricing = await calculateProductPrice(
        product.materials.map((material) => ({
          materialId: material.materialId,
          purityId: material.purityId,
          grossWeight: material.grossWeight !== null && material.grossWeight !== undefined ? Number(material.grossWeight) : null,
          stoneWeight: material.stoneWeight !== null && material.stoneWeight !== undefined ? Number(material.stoneWeight) : null,
          netWeight: material.netWeight !== null && material.netWeight !== undefined ? Number(material.netWeight) : null,
          quantity: Number(material.quantity),
          unit: material.unit,
          wastagePercent: Number(material.wastagePercent ?? 0),
        })),
        Number(product.labourCharge ?? 0),
        Number(product.makingCharge ?? 0),
        Number(product.otherCharge ?? 0),
        product.markupType ?? "",
        Number(product.markupValue ?? 0),
        targetDate,
      );

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
    } catch (error) {
      skippedCount++;
      skippedProductIds.push(product.id);

      errors.push({
        productId: product.id,
        productName: product.name,
        message:
          error instanceof Error
            ? error.message
            : "Unknown pricing recalculation error",
      });
    }
  }

  return {
    total: products.length,
    updatedCount,
    skippedCount,
    skippedProductIds,
    errors,
  };
}
