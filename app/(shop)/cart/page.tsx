"use client";

import Link from "next/link";
import { Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { ProductImage } from "@/components/product/ProductImage";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/format";
import { useToast } from "@/context/ToastContext";

export default function CartPage() {
  const { lines, isLoading, subtotal, updateQuantity, removeItem } = useCart();
  const showToast = useToast();

  async function handleQuantityChange(productId: string, quantity: number, variantId: number | null) {
    try {
      await updateQuantity(productId, quantity, variantId);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Could not update quantity", "error");
    }
  }

  if (isLoading) {
    return <div className="mx-auto max-w-5xl px-4 py-16 text-center text-gray-500">Loading your cart…</div>;
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Your cart is empty</h1>
        <p className="mt-2 text-gray-500">Browse our products and add something you love.</p>
        <Link href="/shop">
          <Button className="mt-6">Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">Shopping Cart</h1>

      <div className="mt-8 flex flex-col gap-8 lg:flex-row">
        <div className="flex-1 divide-y divide-gray-100 rounded-2xl border border-gray-200 bg-white p-2 shadow-soft">
          {lines.map((line) => (
            <div key={`${line.productId}-${line.variantId ?? "base"}`} className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:gap-4">
              <div className="flex items-center gap-4">
                <Link href={`/product/${line.slug}`} className="shrink-0 w-20">
                  <ProductImage src={line.image} alt={line.name} colorway={line.colorway} />
                </Link>
                <div className="min-w-0 flex-1 sm:hidden">
                  <Link href={`/product/${line.slug}`} className="font-medium text-gray-900 hover:text-primary-600 line-clamp-2">
                    {line.name}
                  </Link>
                  {line.variantLabel && <p className="text-xs text-gray-500">{line.variantLabel}</p>}
                  <p className="mt-1 text-sm text-gray-500">{formatPrice(line.price)}</p>
                </div>
              </div>

              <div className="hidden min-w-0 flex-1 sm:block">
                <Link href={`/product/${line.slug}`} className="font-medium text-gray-900 hover:text-primary-600 line-clamp-2">
                  {line.name}
                </Link>
                {line.variantLabel && <p className="text-xs text-gray-500">{line.variantLabel}</p>}
                <p className="mt-1 text-sm text-gray-500">{formatPrice(line.price)}</p>
              </div>

              <div className="flex items-center justify-between gap-3 sm:shrink-0">
                <div className="flex items-center rounded-full border border-gray-200">
                  <button
                    onClick={() => handleQuantityChange(line.productId, line.quantity - 1, line.variantId)}
                    className="px-3 py-1.5 text-gray-600 transition-colors hover:bg-gray-50"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-sm">{line.quantity}</span>
                  <button
                    onClick={() => {
                      if (line.quantity >= line.stock) {
                        showToast(`Only ${line.stock} in stock`, "error");
                        return;
                      }
                      handleQuantityChange(line.productId, line.quantity + 1, line.variantId);
                    }}
                    className="px-3 py-1.5 text-gray-600 transition-colors hover:bg-gray-50"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                <p className="w-24 shrink-0 text-right font-semibold text-primary-700">
                  {formatPrice(line.price * line.quantity)}
                </p>

                <button
                  onClick={() => removeItem(line.productId, line.variantId)}
                  aria-label="Remove item"
                  className="shrink-0 rounded-full p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-5 w-5" strokeWidth={1.6} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="w-full shrink-0 self-start rounded-2xl border border-gray-200 bg-white p-6 shadow-soft lg:w-80">
          <h2 className="text-sm font-semibold text-gray-900">Order Summary</h2>
          <div className="mt-4 flex justify-between text-sm text-gray-600">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <p className="mt-1 text-xs text-gray-400">Shipping and coupons calculated at checkout.</p>
          <Link href="/checkout" className="mt-5 block">
            <Button className="w-full" size="lg">
              Proceed to Checkout
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
