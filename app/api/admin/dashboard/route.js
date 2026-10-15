import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { ok, handleApiError } from "@/lib/api";

const RANGE_DAYS = new Set([7, 30, 90]);

function startOfLocalDay(date = new Date()) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function dateKey(date) {
  const d = new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function money(value) {
  return Number(value ?? 0);
}

function shiftDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function emptyDayMap(start, days) {
  const map = new Map();
  for (let i = 0; i < days; i++) {
    map.set(dateKey(shiftDays(start, i)), { revenue: 0, orders: 0 });
  }
  return map;
}

function summariseOrders(orders) {
  const revenue = orders.reduce((sum, o) => sum + money(o.total), 0);
  return { revenue, orders: orders.length };
}

export async function GET(request) {
  try {
    await requireAdmin();

    const requested = Number(new URL(request.url).searchParams.get("range"));
    const rangeDays = RANGE_DAYS.has(requested) ? requested : 30;

    const todayStart = startOfLocalDay();
    const tomorrow = shiftDays(todayStart, 1);
    const yesterdayStart = shiftDays(todayStart, -1);
    const rangeStart = shiftDays(todayStart, -(rangeDays - 1));
    const prevRangeStart = shiftDays(rangeStart, -rangeDays);

    const notCancelled = { status: { not: "CANCELLED" } };

    const [
      lifetimeAgg,
      lifetimeOrderCount,
      customerCount,
      newCustomers,
      publishedProducts,
      draftProducts,
      statusGroups,
      paymentGroups,
      pendingReviews,
      returnRequested,
      processingOrders,
      recentOrders,
      rangeOrders,
      prevRangeOrders,
      todayOrders,
      yesterdayOrders,
      rangeItems,
      wishlistGroups,
      stockCandidates,
      codUnpaid,
    ] = await Promise.all([
      prisma.order.aggregate({
        where: notCancelled,
        _sum: { total: true },
      }),
      prisma.order.count({ where: notCancelled }),
      prisma.user.count({ where: { role: "USER" } }),
      prisma.user.count({
        where: { role: "USER", createdAt: { gte: rangeStart } },
      }),
      prisma.product.count({ where: { status: "PUBLISHED", deletedAt: null } }),
      prisma.product.count({ where: { status: "DRAFT", deletedAt: null } }),
      prisma.order.groupBy({ by: ["status"], _count: { _all: true } }),
      prisma.order.groupBy({
        by: ["paymentMethod"],
        where: { placedAt: { gte: rangeStart }, ...notCancelled },
        _count: { _all: true },
        _sum: { total: true },
      }),
      prisma.review.count({ where: { status: "PENDING" } }),
      prisma.order.count({
        where: { returnRequested: true, refunded: false, status: { not: "CANCELLED" } },
      }),
      prisma.order.findMany({
        where: { status: "PROCESSING" },
        orderBy: { placedAt: "asc" },
        take: 8,
        select: {
          id: true,
          orderNumber: true,
          fullName: true,
          total: true,
          paymentMethod: true,
          paymentStatus: true,
          placedAt: true,
          _count: { select: { items: true } },
        },
      }),
      prisma.order.findMany({
        orderBy: { placedAt: "desc" },
        take: 8,
        select: {
          id: true,
          orderNumber: true,
          fullName: true,
          status: true,
          paymentMethod: true,
          paymentStatus: true,
          total: true,
          placedAt: true,
          _count: { select: { items: true } },
        },
      }),
      prisma.order.findMany({
        where: { placedAt: { gte: rangeStart }, ...notCancelled },
        select: { placedAt: true, total: true, paymentMethod: true, paymentStatus: true },
      }),
      prisma.order.findMany({
        where: {
          placedAt: { gte: prevRangeStart, lt: rangeStart },
          ...notCancelled,
        },
        select: { total: true },
      }),
      prisma.order.findMany({
        where: {
          placedAt: { gte: todayStart, lt: tomorrow },
          ...notCancelled,
        },
        select: { total: true },
      }),
      prisma.order.findMany({
        where: {
          placedAt: { gte: yesterdayStart, lt: todayStart },
          ...notCancelled,
        },
        select: { total: true },
      }),
      prisma.orderItem.findMany({
        where: {
          order: { placedAt: { gte: rangeStart }, ...notCancelled },
        },
        select: {
          name: true,
          quantity: true,
          price: true,
          productId: true,
          image: true,
          product: {
            select: {
              slug: true,
              featuredImage: true,
              category: { select: { name: true } },
            },
          },
        },
      }),
      prisma.wishlistItem.groupBy({
        by: ["productId"],
        _count: { _all: true },
        orderBy: { _count: { productId: "desc" } },
        take: 5,
      }),
      prisma.product.findMany({
        where: {
          deletedAt: null,
          status: "PUBLISHED",
          OR: [{ stockStatus: "OUT_OF_STOCK" }, { stock: { lte: 30 } }],
        },
        select: {
          id: true,
          name: true,
          sku: true,
          slug: true,
          stock: true,
          lowStockAlert: true,
          featuredImage: true,
          stockStatus: true,
        },
        orderBy: { stock: "asc" },
        take: 80,
      }),
      prisma.order.count({
        where: {
          paymentMethod: "COD",
          paymentStatus: "PENDING",
          status: { notIn: ["CANCELLED", "RETURNED"] },
        },
      }),
    ]);

    const byDay = emptyDayMap(rangeStart, rangeDays);
    for (const order of rangeOrders) {
      const key = dateKey(order.placedAt);
      const bucket = byDay.get(key);
      if (!bucket) continue;
      bucket.revenue += money(order.total);
      bucket.orders += 1;
    }

    const productMap = new Map();
    const categoryMap = new Map();
    for (const item of rangeItems) {
      const line = money(item.price) * item.quantity;
      const key = item.productId ?? item.name;
      const current = productMap.get(key) ?? {
        productId: item.productId,
        name: item.name,
        slug: item.product?.slug ?? null,
        image: item.product?.featuredImage || item.image || null,
        quantity: 0,
        revenue: 0,
      };
      current.quantity += item.quantity;
      current.revenue += line;
      productMap.set(key, current);

      const categoryName = item.product?.category?.name ?? "Uncategorised";
      const cat = categoryMap.get(categoryName) ?? { name: categoryName, revenue: 0, units: 0 };
      cat.revenue += line;
      cat.units += item.quantity;
      categoryMap.set(categoryName, cat);
    }

    const topProducts = Array.from(productMap.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 6);

    const categoryRevenue = Array.from(categoryMap.values()).sort((a, b) => b.revenue - a.revenue);

    const wishlistIds = wishlistGroups.map((g) => g.productId);
    const wishlistProducts = wishlistIds.length
      ? await prisma.product.findMany({
          where: { id: { in: wishlistIds } },
          select: { id: true, name: true, slug: true, featuredImage: true },
        })
      : [];
    const wishlistById = new Map(wishlistProducts.map((p) => [p.id, p]));
    const wishlistHeat = wishlistGroups.map((g) => {
      const product = wishlistById.get(g.productId);
      return {
        productId: g.productId,
        name: product?.name ?? "Removed piece",
        slug: product?.slug ?? null,
        image: product?.featuredImage ?? null,
        saves: g._count._all,
      };
    });

    const lowStock = stockCandidates
      .filter(
        (p) =>
          p.stockStatus === "OUT_OF_STOCK" || p.stock <= (p.lowStockAlert ?? 5),
      )
      .slice(0, 8)
      .map((p) => ({
        id: p.id,
        name: p.name,
        sku: p.sku,
        slug: p.slug,
        stock: p.stock,
        alert: p.lowStockAlert ?? 5,
        image: p.featuredImage,
        out: p.stockStatus === "OUT_OF_STOCK" || p.stock <= 0,
      }));

    const statusCount = (key) =>
      statusGroups.find((g) => g.status === key)?._count._all ?? 0;

    const today = summariseOrders(todayOrders);
    const yesterday = summariseOrders(yesterdayOrders);
    const range = summariseOrders(rangeOrders);
    const previous = summariseOrders(prevRangeOrders);
    const lifetimeRevenue = money(lifetimeAgg._sum.total);

    return ok({
      rangeDays,
      kpis: {
        todayRevenue: today.revenue,
        todayOrders: today.orders,
        yesterdayRevenue: yesterday.revenue,
        yesterdayOrders: yesterday.orders,
        rangeRevenue: range.revenue,
        rangeOrders: range.orders,
        rangeAov: range.orders ? range.revenue / range.orders : 0,
        prevRangeRevenue: previous.revenue,
        prevRangeOrders: previous.orders,
        lifetimeRevenue,
        lifetimeOrders: lifetimeOrderCount,
        lifetimeAov: lifetimeOrderCount ? lifetimeRevenue / lifetimeOrderCount : 0,
        customers: customerCount,
        newCustomers,
        publishedProducts,
        draftProducts,
      },
      work: {
        processing: statusCount("PROCESSING"),
        shipped: statusCount("SHIPPED"),
        delivered: statusCount("DELIVERED"),
        returned: statusCount("RETURNED"),
        cancelled: statusCount("CANCELLED"),
        codUnpaid,
        returnRequested,
        pendingReviews,
        lowStock: lowStock.length,
        outOfStock: lowStock.filter((p) => p.out).length,
      },
      revenueByDay: Array.from(byDay.entries()).map(([date, value]) => ({
        date,
        revenue: value.revenue,
        orders: value.orders,
      })),
      paymentMix: paymentGroups.map((g) => ({
        method: g.paymentMethod,
        orders: g._count._all,
        revenue: money(g._sum.total),
      })),
      ordersByStatus: statusGroups.map((g) => ({
        status: g.status,
        count: g._count._all,
      })),
      categoryRevenue,
      topProducts,
      wishlistHeat,
      lowStock,
      packingQueue: processingOrders.map((o) => ({
        id: o.id,
        orderNumber: o.orderNumber,
        customer: o.fullName,
        total: money(o.total),
        paymentMethod: o.paymentMethod,
        paymentStatus: o.paymentStatus,
        placedAt: o.placedAt,
        itemCount: o._count.items,
      })),
      recentOrders: recentOrders.map((o) => ({
        id: o.id,
        orderNumber: o.orderNumber,
        customer: o.fullName,
        status: o.status,
        paymentMethod: o.paymentMethod,
        paymentStatus: o.paymentStatus,
        total: money(o.total),
        placedAt: o.placedAt,
        itemCount: o._count.items,
      })),
    });
  } catch (error) {
    return handleApiError(error);
  }
}
