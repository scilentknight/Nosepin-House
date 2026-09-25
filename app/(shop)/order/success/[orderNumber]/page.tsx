import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/format";

interface OrderSuccessPageProps {
  params: Promise<{ orderNumber: string }>;
}

export default async function OrderSuccessPage({ params }: OrderSuccessPageProps) {
  const { orderNumber } = await params;

  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: { items: true },
  });

  if (!order) notFound();

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 lg:px-8">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-accent-50 text-accent-600 shadow-soft">
        <svg viewBox="0 0 24 24" className="h-9 w-9" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">Order Placed Successfully!</h1>
      <p className="mt-2 text-gray-500">
        Thank you for shopping with DXN. A confirmation has been sent for order{" "}
        <span className="font-semibold text-gray-800">{order.orderNumber}</span>.
      </p>

      <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 text-left shadow-soft">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Payment Method</span>
          <span className="font-medium text-gray-900">
            {order.paymentMethod === "COD" ? "Cash on Delivery" : "eSewa"}
          </span>
        </div>
        <div className="mt-2 flex justify-between text-sm text-gray-600">
          <span>Items</span>
          <span className="font-medium text-gray-900">{order.items.length}</span>
        </div>
        <div className="mt-2 flex justify-between border-t border-gray-100 pt-3 text-base font-bold text-gray-900">
          <span>Total</span>
          <span>{formatPrice(Number(order.total))}</span>
        </div>
      </div>

      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Link href="/account/orders">
          <Button size="lg">Track in My Orders</Button>
        </Link>
        <Link href="/shop">
          <Button variant="outline" size="lg">Continue Shopping</Button>
        </Link>
      </div>
    </div>
  );
}
