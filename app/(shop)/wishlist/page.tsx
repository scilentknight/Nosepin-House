"use client";

import Link from "next/link";
import { Trash2, ShoppingCart } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { ProductImage } from "@/components/product/ProductImage";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/format";

export default function WishlistPage() {
  const { lines, isLoading, removeItem } = useWishlist();
  const { addItem } = useCart();

  if (isLoading) {
    return <div className="mx-auto max-w-5xl px-4 py-16 text-center text-gray-500">Loading your wishlist…</div>;
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Your wishlist is empty</h1>
        <p className="mt-2 text-gray-500">Save items you love and find them here later.</p>
        <Link href="/shop">
          <Button className="mt-6">Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  async function moveToCart(line: (typeof lines)[number]) {
    if (line.stock <= 0) return;
    await addItem(String(line.productId), 1, line.variantId);
    await removeItem(line.productId, line.variantId);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">My Wishlist</h1>

      <div className="mt-8 divide-y divide-gray-100 rounded-2xl border border-gray-200 bg-white p-2 shadow-soft">
        {lines.map((line) => (
          <div
            key={`${line.productId}-${line.variantId ?? "base"}`}
            className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:gap-4"
          >
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
              {line.stock <= 0 && <p className="mt-1 text-xs font-medium text-red-600">Out of stock</p>}
            </div>

            <div className="flex items-center justify-between gap-3 sm:shrink-0">
              <Button
                variant="outline"
                size="sm"
                disabled={line.stock <= 0}
                onClick={() => moveToCart(line)}
                className="gap-1.5"
              >
                <ShoppingCart className="h-4 w-4" strokeWidth={1.8} />
                <span className="hidden sm:inline">Move to Cart</span>
              </Button>

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
    </div>
  );
}
