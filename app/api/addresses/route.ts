import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { ok, fail, handleApiError } from "@/lib/api";
import { addressSchema } from "@/schemas/checkout";
import { validateAddressLocation } from "@/lib/checkoutCore";

const addressInclude = { province: true, district: true, municipality: true };

export async function GET() {
  try {
    const user = await requireUser();
    const addresses = await prisma.address.findMany({
      where: { userId: user.id },
      include: addressInclude,
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    });
    return ok(addresses);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const body = await request.json();
    const parsed = addressSchema.safeParse(body);
    if (!parsed.success) {
      return fail(400, parsed.error.issues[0]?.message ?? "Invalid address");
    }
    await validateAddressLocation(parsed.data.provinceId, parsed.data.districtId, parsed.data.municipalityId, parsed.data.wardNo);

    const isDefault = Boolean(body.isDefault);
    if (isDefault) {
      await prisma.address.updateMany({ where: { userId: user.id }, data: { isDefault: false } });
    }

    const existingCount = await prisma.address.count({ where: { userId: user.id } });

    const address = await prisma.address.create({
      data: {
        ...parsed.data,
        landmark: parsed.data.landmark || null,
        userId: user.id,
        isDefault: isDefault || existingCount === 0,
      },
      include: addressInclude,
    });

    return ok(address, "Address saved");
  } catch (error) {
    return handleApiError(error);
  }
}
