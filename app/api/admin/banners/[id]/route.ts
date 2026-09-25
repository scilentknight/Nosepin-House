import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { ok, fail, handleApiError } from "@/lib/api";
import { bannerSchema } from "@/schemas/admin-banner";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id: rawId } = await params;
    const id = Number(rawId);
    if (Number.isNaN(id)) return fail(400, "Invalid id");

    const banner = await prisma.homeBannerSlide.findUnique({ where: { id } });
    if (!banner) return fail(404, "Banner not found");
    return ok(banner);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id: rawId } = await params;
    const id = Number(rawId);
    if (Number.isNaN(id)) return fail(400, "Invalid id");

    const existing = await prisma.homeBannerSlide.findUnique({ where: { id } });
    if (!existing) return fail(404, "Banner not found");

    const body = await request.json();
    const parsed = bannerSchema.safeParse(body);
    if (!parsed.success) return fail(400, parsed.error.issues[0]?.message ?? "Invalid request");

    const data = parsed.data;
    const banner = await prisma.homeBannerSlide.update({
      where: { id },
      data: {
        title: data.title,
        subtitle: data.subtitle || null,
        image: data.image,
        linkUrl: data.linkUrl || null,
        buttonText: data.buttonText || null,
        active: data.active,
      },
    });

    return ok(banner, "Banner updated");
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id: rawId } = await params;
    const id = Number(rawId);
    if (Number.isNaN(id)) return fail(400, "Invalid id");

    const existing = await prisma.homeBannerSlide.findUnique({ where: { id } });
    if (!existing) return fail(404, "Banner not found");

    await prisma.homeBannerSlide.delete({ where: { id } });
    return ok(null, "Banner deleted");
  } catch (error) {
    return handleApiError(error);
  }
}
