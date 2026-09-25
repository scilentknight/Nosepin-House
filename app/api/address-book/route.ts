import { prisma } from "@/lib/prisma";
import { ok, handleApiError } from "@/lib/api";

export const revalidate = 86400;

export async function GET() {
  try {
    const provinces = await prisma.addressBook.findMany({
      where: { level: "PROVINCE" },
      orderBy: { id: "asc" },
      include: {
        children: {
          orderBy: { id: "asc" },
          include: { children: { orderBy: { id: "asc" } } },
        },
      },
    });

    const data = provinces.map((province) => ({
      id: province.id,
      name: province.name,
      districts: province.children.map((district) => ({
        id: district.id,
        name: district.name,
        municipalities: district.children.map((municipality) => ({
          id: municipality.id,
          name: municipality.name,
          type: municipality.municipalityType,
          wardCount: municipality.wardCount ?? 0,
        })),
      })),
    }));

    return ok({ provinces: data });
  } catch (error) {
    return handleApiError(error);
  }
}
