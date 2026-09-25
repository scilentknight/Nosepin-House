import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { ok, fail, handleApiError } from "@/lib/api";
import { bannerSchema } from "@/schemas/admin-banner";

export async function GET() {
  try {
    await requireAdmin();
    const banners = await prisma.homeBannerSlide.findMany({
      orderBy: { sortOrder: "asc" },
    });
    return ok(banners);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const parsed = bannerSchema.safeParse(body);
    if (!parsed.success) return fail(400, parsed.error.issues[0]?.message ?? "Invalid request");

    const data = parsed.data;
    const last = await prisma.homeBannerSlide.findFirst({ orderBy: { sortOrder: "desc" } });
    const sortOrder = (last?.sortOrder ?? 0) + 1;

    const banner = await prisma.homeBannerSlide.create({
      data: {
        title: data.title,
        subtitle: data.subtitle || null,
        image: data.image,
        linkUrl: data.linkUrl || null,
        buttonText: data.buttonText || null,
        active: data.active,
        sortOrder,
      },
    });

    return ok(banner, "Banner created");
  } catch (error) {
    return handleApiError(error);
  }
}
