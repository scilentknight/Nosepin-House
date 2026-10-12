import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { ok, fail, handleApiError } from "@/lib/api";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();
    const { id } = await params;

    const material = await prisma.material.findUnique({
      where: { id },
      include: {
        purities: {
          orderBy: { name: "asc" },
        },
      },
    });

    if (!material) {
      return fail(404, "Material not found");
    }

    return ok(material);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await request.json();

    const { name, code, type, unit, description, isActive, purities } = body;

    const existingMaterial = await prisma.material.findUnique({
      where: { id },
      include: { purities: true },
    });

    if (!existingMaterial) {
      return fail(404, "Material not found");
    }

    if (code && code.trim().toUpperCase() !== existingMaterial.code) {
      const codeCheck = await prisma.material.findUnique({
        where: { code: code.trim().toUpperCase() },
      });
      if (codeCheck) {
        return fail(400, `Material code "${code.trim().toUpperCase()}" is already in use`);
      }
    }

    // Process purities update
    const updatedMaterial = await prisma.$transaction(async (tx) => {
      // Update core material fields
      const mat = await tx.material.update({
        where: { id },
        data: {
          name: name ? name.trim() : existingMaterial.name,
          code: code ? code.trim().toUpperCase() : existingMaterial.code,
          type: type || existingMaterial.type,
          unit: unit || existingMaterial.unit,
          description: description !== undefined ? description?.trim() || null : existingMaterial.description,
          isActive: typeof isActive === "boolean" ? isActive : existingMaterial.isActive,
        },
      });

      // Upsert purities if provided
      if (Array.isArray(purities)) {
        for (const purity of purities) {
          const pName = purity.name.trim();
          const pCode = purity.code.trim().toUpperCase();
          const pFine =
            purity.fineness === null || purity.fineness === undefined || purity.fineness === ""
              ? null
              : Number(purity.fineness);
          const pActive = typeof purity.isActive === "boolean" ? purity.isActive : true;

          if (purity.id) {
            await tx.materialPurity.update({
              where: { id: purity.id },
              data: {
                name: pName,
                code: pCode,
                fineness: pFine,
                isActive: pActive,
              },
            });
          } else {
            await tx.materialPurity.create({
              data: {
                materialId: id,
                name: pName,
                code: pCode,
                fineness: pFine,
                isActive: pActive,
              },
            });
          }
        }
      }

      return tx.material.findUnique({
        where: { id },
        include: { purities: true },
      });
    });

    return ok(updatedMaterial, "Material updated successfully");
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();
    const { id } = await params;

    const material = await prisma.material.findUnique({
      where: { id },
    });

    if (!material) {
      return fail(404, "Material not found");
    }

    // Completely delete the material and cascade delete/unlink all relations
    await prisma.$transaction(async (tx) => {
      // 1. Clear stone references where this material was used as an embedded stone
      await tx.productMaterial.updateMany({
        where: { stoneMaterialId: id },
        data: {
          stoneMaterialId: null,
          stoneWeight: null,
          stoneGrossPrice: null,
          stoneDiscountPercent: null,
        },
      });

      // 2. Delete any product material rows using this material as primary
      await tx.productMaterial.deleteMany({
        where: { materialId: id },
      });

      // 3. Delete historical rates for this material
      await tx.materialRate.deleteMany({
        where: { materialId: id },
      });

      // 4. Delete purities for this material
      await tx.materialPurity.deleteMany({
        where: { materialId: id },
      });

      // 5. Delete the material itself
      await tx.material.delete({
        where: { id },
      });
    });

    return ok({ id }, `Material "${material.name}" deleted successfully`);
  } catch (error) {
    return handleApiError(error);
  }
}
