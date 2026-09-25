import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { ok, handleApiError } from "@/lib/api";
import type { OrderStatus, PaymentStatus, PaymentMethod, Prisma } from "@prisma/client";

const VALID_STATUSES: OrderStatus[] = ["PROCESSING", "SHIPPED", "DELIVERED", "RETURNED", "CANCELLED"];
const VALID_PAYMENT_STATUSES: PaymentStatus[] = ["PENDING", "PAID", "FAILED"];
const VALID_PAYMENT_METHODS: PaymentMethod[] = ["COD", "ONLINE"];

export async function GET(request: Request) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(request.url);

    const status = searchParams.get("status");
    const paymentStatus = searchParams.get("paymentStatus");
    const paymentMethod = searchParams.get("paymentMethod");
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const search = searchParams.get("search")?.trim();
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const pageSize = Math.min(100, Math.max(1, Number(searchParams.get("pageSize")) || 20));

    const where: Prisma.OrderWhereInput = {
      ...(status && VALID_STATUSES.includes(status as OrderStatus) ? { status: status as OrderStatus } : {}),
      ...(paymentStatus && VALID_PAYMENT_STATUSES.includes(paymentStatus as PaymentStatus)
        ? { paymentStatus: paymentStatus as PaymentStatus }
        : {}),
      ...(paymentMethod && VALID_PAYMENT_METHODS.includes(paymentMethod as PaymentMethod)
        ? { paymentMethod: paymentMethod as PaymentMethod }
        : {}),
      ...(from || to
        ? {
            placedAt: {
              ...(from ? { gte: new Date(from) } : {}),
              ...(to ? { lte: new Date(to) } : {}),
            },
          }
        : {}),
      ...(search
        ? {
            OR: [
              { orderNumber: { contains: search } },
              { fullName: { contains: search } },
              { email: { contains: search } },
            ],
          }
        : {}),
    };

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        orderBy: { placedAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: { items: true },
      }),
      prisma.order.count({ where }),
    ]);

    const data = orders.map(({ items, ...order }) => ({
      ...order,
      subtotal: Number(order.subtotal),
      discount: Number(order.discount),
      total: Number(order.total),
      itemCount: items.length,
    }));

    return ok({ orders: data, total, page, pageSize });
  } catch (error) {
    return handleApiError(error);
  }
}
