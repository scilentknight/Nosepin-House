import { prisma } from "@/lib/prisma";
import { calculateJewelleryPrice } from "./pricing";
import { getDerivedMaterialRate } from "./rate-calculator";
import { convertWeight } from "./unit-converter";
export async function getCurrentMaterialRate(materialId, purityId, targetDate = new Date()) {
    const result = await getDerivedMaterialRate(materialId, purityId, targetDate);
    if (!result)
        return null;
    return {
        rate: result.rate,
        unit: result.unit,
        baseRateRecord: result.baseRateRecord,
        basePurity: result.basePurity,
        targetPurity: result.targetPurity,
    };
}
export async function calculateProductPrice(materials, labourCharge = 0, makingCharge = 0, otherCharge = 0, markupType = "", markupValue = 0, targetDate = new Date()) {
    const pricingMaterials = [];
    const materialBreakdown = [];
    for (const item of materials) {
        if (!item.materialId) {
            throw new Error("Each material entry must specify materialId");
        }
        const mat = await prisma.material.findUnique({
            where: { id: item.materialId },
            include: {
                purities: true,
            },
        });
        if (!mat) {
            throw new Error(`Material with ID "${item.materialId}" not found`);
        }
        // Check if non-precious material has manual gross price
        const hasManualPrice = mat.type !== "PRECIOUS_METAL" &&
            item.manualGrossPrice !== null &&
            item.manualGrossPrice !== undefined &&
            Number(item.manualGrossPrice) > 0;
        if (hasManualPrice) {
            const discPct = item.manualDiscountPercent !== null && item.manualDiscountPercent !== undefined
                ? Number(item.manualDiscountPercent)
                : 40;
            const manualCost = Math.round(Number(item.manualGrossPrice) * (1 - discPct / 100) * 100) / 100;
            pricingMaterials.push({
                quantity: 1,
                rate: manualCost,
                wastagePercent: 0,
            });
            materialBreakdown.push({
                id: item.id,
                materialId: item.materialId,
                materialName: mat.name,
                materialType: mat.type,
                quantity: item.quantity || 1,
                unit: mat.unit,
                rate: manualCost,
                cost: manualCost,
            });
            continue;
        }
        const rateResult = await getCurrentMaterialRate(item.materialId, item.purityId, targetDate);
        if (!rateResult) {
            const pur = item.purityId
                ? await prisma.materialPurity.findUnique({
                    where: { id: item.purityId },
                    select: { name: true },
                })
                : null;
            throw new Error(`No active material rate found for ${mat.name}${pur ? ` (${pur.name})` : ""}`);
        }
        const rateNum = typeof rateResult.rate === "number"
            ? rateResult.rate
            : rateResult.rate.toNumber();
        // 1. Resolve embedded stone material & rate (if stoneMaterialId is specified)
        let stoneMat = null;
        let stoneRateNum = null;
        let stoneCost = 0;
        let stoneUnit = null;
        let convertedStoneWeight = null;
        const rawStoneWeight = item.stoneWeight !== null && item.stoneWeight !== undefined
            ? Number(item.stoneWeight)
            : 0;
        const hasManualStonePrice = item.stoneGrossPrice !== null &&
            item.stoneGrossPrice !== undefined &&
            Number(item.stoneGrossPrice) > 0;
        if (item.stoneMaterialId && item.stoneMaterialId.trim() !== "") {
            const sMatId = item.stoneMaterialId.trim();
            stoneMat = await prisma.material.findUnique({
                where: { id: sMatId },
                include: { purities: true },
            });
            if (!stoneMat) {
                throw new Error(`Stone material with ID "${sMatId}" not found`);
            }
            if (hasManualStonePrice) {
                const discountPct = item.stoneDiscountPercent !== null && item.stoneDiscountPercent !== undefined
                    ? Number(item.stoneDiscountPercent)
                    : 40;
                stoneCost =
                    Math.round(Number(item.stoneGrossPrice) * (1 - discountPct / 100) * 100) / 100;
                stoneUnit = stoneMat.unit;
            }
            else if (rawStoneWeight > 0) {
                const stoneRateResult = await getCurrentMaterialRate(sMatId, null, targetDate);
                if (!stoneRateResult) {
                    throw new Error(`No active material rate found for stone ${stoneMat.name}`);
                }
                stoneRateNum =
                    typeof stoneRateResult.rate === "number"
                        ? stoneRateResult.rate
                        : stoneRateResult.rate.toNumber();
                stoneUnit = stoneMat.unit;
                stoneCost = rawStoneWeight * stoneRateNum;
            }
            // Convert stone weight from stone unit to primary metal unit for mass deduction
            if (rawStoneWeight > 0) {
                convertedStoneWeight = convertWeight(rawStoneWeight, stoneMat.unit, mat.unit).toNumber();
            }
        }
        else if (rawStoneWeight > 0) {
            convertedStoneWeight = rawStoneWeight;
        }
        // Determine effective quantity and weights based on material type
        let netWeight = null;
        let grossWeight = null;
        let effectiveBaseQuantity = item.quantity;
        let wastagePercent = Number(item.wastagePercent || 0);
        if (mat.type === "PRECIOUS_METAL") {
            grossWeight =
                item.grossWeight !== null && item.grossWeight !== undefined
                    ? Number(item.grossWeight)
                    : null;
            if (grossWeight !== null) {
                const deduction = convertedStoneWeight || 0;
                netWeight = Math.max(0, grossWeight - deduction);
                effectiveBaseQuantity = netWeight;
            }
            else if (item.netWeight !== null && item.netWeight !== undefined) {
                netWeight = Number(item.netWeight);
                effectiveBaseQuantity = netWeight;
            }
            else {
                effectiveBaseQuantity = Number(item.quantity || 0);
                netWeight = effectiveBaseQuantity;
            }
        }
        else {
            effectiveBaseQuantity = Number(item.quantity || 0);
            grossWeight = null;
            convertedStoneWeight = null;
            netWeight = null;
            wastagePercent = Number(item.wastagePercent || 0);
        }
        // 2. Primary metal/material cost
        const wastageWeight = (effectiveBaseQuantity * wastagePercent) / 100;
        const chargeableQuantity = effectiveBaseQuantity + wastageWeight;
        const metalCost = chargeableQuantity * rateNum;
        pricingMaterials.push({
            quantity: effectiveBaseQuantity,
            rate: rateNum,
            wastagePercent,
        });
        if (stoneMat && stoneCost > 0) {
            pricingMaterials.push({
                quantity: 1,
                rate: stoneCost,
                wastagePercent: 0,
            });
        }
        const totalLineCost = metalCost + stoneCost;
        materialBreakdown.push({
            id: item.id,
            materialId: item.materialId,
            materialName: mat.name,
            materialType: mat.type,
            purityId: item.purityId || null,
            purityName: rateResult.targetPurity?.name || null,
            grossWeight,
            stoneMaterialId: stoneMat ? stoneMat.id : item.stoneMaterialId || null,
            stoneMaterialName: stoneMat ? stoneMat.name : null,
            stoneMaterialType: stoneMat ? stoneMat.type : null,
            stoneWeight: rawStoneWeight > 0 ? rawStoneWeight : null,
            convertedStoneWeight: convertedStoneWeight && convertedStoneWeight > 0 ? convertedStoneWeight : null,
            stoneUnit: stoneUnit || null,
            stoneRate: stoneRateNum,
            stoneCost: stoneCost > 0 ? stoneCost : null,
            metalCost,
            netWeight,
            quantity: effectiveBaseQuantity,
            unit: mat.unit,
            wastagePercent: wastagePercent > 0 ? wastagePercent : null,
            wastageWeight: wastageWeight > 0 ? wastageWeight : null,
            chargeableQuantity,
            rate: rateNum,
            cost: totalLineCost,
        });
    }
    const pricing = calculateJewelleryPrice({
        materials: pricingMaterials,
        labourCharge,
        makingCharge,
        otherCharge,
        markupType,
        markupValue,
    });
    return {
        ...pricing,
        materialBreakdown,
    };
}
