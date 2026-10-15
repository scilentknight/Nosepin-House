import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { ok, handleApiError } from "@/lib/api";
const VALID_STATUSES = ["PROCESSING", "SHIPPED", "DELIVERED", "RETURNED", "CANCELLED"];
const VALID_PAYMENT_STATUSES = ["PENDING", "PAID", "FAILED"];
const VALID_PAYMENT_METHODS = ["COD", "ONLINE"];
export async function GET(request) {
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
        const where = {
            ...(status && VALID_STATUSES.includes(status) ? { status: status } : {}),
            ...(paymentStatus && VALID_PAYMENT_STATUSES.includes(paymentStatus)
                ? { paymentStatus: paymentStatus }
                : {}),
            ...(paymentMethod && VALID_PAYMENT_METHODS.includes(paymentMethod)
                ? { paymentMethod: paymentMethod }
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
    }
    catch (error) {
        return handleApiError(error);
    }
}
