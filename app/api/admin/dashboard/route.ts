import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { ok, handleApiError } from "@/lib/api";

const DAYS = 30;

function dateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

export async function GET() {
  try {
    await requireAdmin();

    const since = new Date();
    since.setDate(since.getDate() - (DAYS - 1));
    since.setHours(0, 0, 0, 0);

    const [totalOrders, totalCustomers, totalProducts, revenueAgg, recentOrders, statusGroups, topItems] =
      await Promise.all([
        prisma.order.count(),
        prisma.user.count({ where: { role: "USER" } }),
        prisma.product.count({ where: { status: "PUBLISHED", deletedAt: null } }),
        prisma.order.aggregate({
          where: { status: { not: "CANCELLED" } },
          _sum: { total: true },
        }),
        prisma.order.findMany({
          where: { placedAt: { gte: since }, status: { not: "CANCELLED" } },
          select: { placedAt: true, total: true },
        }),
        prisma.order.groupBy({ by: ["status"], _count: { _all: true } }),
        prisma.orderItem.groupBy({
          by: ["name"],
          _sum: { quantity: true },
          orderBy: { _sum: { quantity: "desc" } },
          take: 5,
        }),
      ]);

    const byDay = new Map<string, number>();
    for (let i = 0; i < DAYS; i++) {
      const d = new Date(since);
      d.setDate(d.getDate() + i);
      byDay.set(dateKey(d), 0);
    }
    for (const order of recentOrders) {
      const key = dateKey(order.placedAt);
      if (byDay.has(key)) byDay.set(key, (byDay.get(key) ?? 0) + Number(order.total));
    }
    const revenueByDay = Array.from(byDay.entries()).map(([date, revenue]) => ({ date, revenue }));

    const ordersByStatus = statusGroups.map((g) => ({ status: g.status, count: g._count._all }));

    const topProducts = topItems.map((item) => ({ name: item.name, quantity: item._sum.quantity ?? 0 }));

    return ok({
      totalRevenue: Number(revenueAgg._sum.total ?? 0),
      totalOrders,
      totalCustomers,
      totalProducts,
      revenueByDay,
      ordersByStatus,
      topProducts,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
