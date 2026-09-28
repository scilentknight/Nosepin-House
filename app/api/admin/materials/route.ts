import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { ok, fail, handleApiError } from "@/lib/api";

export async function GET() {
  try {
    await requireAdmin();

    const materials = await prisma.material.findMany({
      where: {
        isActive: true,
      },
      include: {
        purities: {
          where: {
            isActive: true,
          },
          orderBy: {
            name: "asc",
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return ok(materials);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();

    const { name, code, type, unit, description, purities } = body;

    if (!name?.trim()) {
      return fail(400, "Material name is required");
    }

    if (!code?.trim()) {
      return fail(400, "Material code is required");
    }

    if (!type) {
      return fail(400, "Material type is required");
    }

    if (!unit) {
      return fail(400, "Material unit is required");
    }

    if (!Array.isArray(purities) || purities.length === 0) {
      return fail(400, "At least one purity or grade is required");
    }

    // Check code uniqueness
    const existingCode = await prisma.material.findUnique({
      where: { code: code.trim().toUpperCase() },
    });

    if (existingCode) {
      return fail(400, `Material code "${code.trim().toUpperCase()}" already exists`);
    }

    const material = await prisma.material.create({
      data: {
        name: name.trim(),
        code: code.trim().toUpperCase(),
        type,
        unit,
        description: description?.trim() || null,
        purities: {
          create: purities.map(
            (purity: {
              name: string;
              code: string;
              fineness?: number | null;
            }) => ({
              name: purity.name.trim(),
              code: purity.code.trim().toUpperCase(),
              fineness:
                purity.fineness === null ||
                purity.fineness === undefined ||
                (purity.fineness as any) === ""
                  ? null
                  : Number(purity.fineness),
            }),
          ),
        },
      },
      include: {
        purities: true,
      },
    });

    return ok(material, "Material created successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
