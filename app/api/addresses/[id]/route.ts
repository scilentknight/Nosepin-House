import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { ok, fail, handleApiError } from "@/lib/api";
import { addressSchema } from "@/schemas/checkout";
import { validateAddressLocation } from "@/lib/checkoutCore";

const addressInclude = { province: true, district: true, municipality: true };

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser();
    const { id: rawId } = await params;
    const id = Number(rawId);
    if (Number.isNaN(id)) return fail(400, "Invalid address id");

    const existing = await prisma.address.findUnique({ where: { id } });
    if (!existing || existing.userId !== user.id) return fail(404, "Address not found");

    const body = await request.json();
    const parsed = addressSchema.safeParse(body);
    if (!parsed.success) return fail(400, parsed.error.issues[0]?.message ?? "Invalid address");
    await validateAddressLocation(parsed.data.provinceId, parsed.data.districtId, parsed.data.municipalityId, parsed.data.wardNo);

    const isDefault = body.isDefault !== undefined ? Boolean(body.isDefault) : existing.isDefault;
    if (isDefault) {
      await prisma.address.updateMany({ where: { userId: user.id, id: { not: id } }, data: { isDefault: false } });
    }

    const address = await prisma.address.update({
      where: { id },
      data: { ...parsed.data, landmark: parsed.data.landmark || null, isDefault },
      include: addressInclude,
    });

    return ok(address, "Address updated");
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireUser();
    const { id: rawId } = await params;
    const id = Number(rawId);
    if (Number.isNaN(id)) return fail(400, "Invalid address id");

    const address = await prisma.address.findUnique({ where: { id } });
    if (!address || address.userId !== user.id) return fail(404, "Address not found");

    await prisma.address.delete({ where: { id } });
    return ok(null, "Address removed");
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireUser();
    const { id: rawId } = await params;
    const id = Number(rawId);
    if (Number.isNaN(id)) return fail(400, "Invalid address id");
    const { isDefault } = await request.json();

    const address = await prisma.address.findUnique({ where: { id } });
    if (!address || address.userId !== user.id) return fail(404, "Address not found");

    if (isDefault) {
      await prisma.address.updateMany({ where: { userId: user.id }, data: { isDefault: false } });
    }

    const updated = await prisma.address.update({
      where: { id },
      data: { isDefault: Boolean(isDefault) },
    });

    return ok(updated, "Address updated");
  } catch (error) {
    return handleApiError(error);
  }
}
