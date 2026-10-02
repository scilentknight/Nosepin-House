"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trash2, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { ProductImage } from "@/components/product/ProductImage";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/format";
import { useToast } from "@/context/ToastContext";

export default function CartPage() {
  const {
    lines,
    isLoading,
    updateQuantity,
    removeItem,
    isSelected,
    toggleSelected,
    selectAll,
    clearSelection,
    selectedLines,
    selectedSubtotal,
    selectedCount,
  } = useCart();

  const showToast = useToast();
  const router = useRouter();

  async function handleQuantityChange(
    productId: string,
    quantity: number,
    variantId: number | null,
  ) {
    try {
      await updateQuantity(productId, quantity, variantId);
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "Could not update quantity",
        "error",
      );
    }
  }

  function handleSelectAll() {
    if (lines.length > 0 && selectedLines.length === lines.length) {
      clearSelection();
    } else {
      selectAll();
    }
  }

  function handleCheckout() {
    if (selectedLines.length === 0) {
      showToast("Please select at least one item to checkout.", "error");
      return;
    }

    router.push("/checkout");
  }

  const allSelected = lines.length > 0 && selectedLines.length === lines.length;

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 text-center text-gray-500">
        Loading your cart…
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Your cart is empty
        </h1>

        <p className="mt-2 text-gray-500">
          Browse our products and add something you love.
        </p>

        <Link href="/jewellery">
          <Button className="mt-6">Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">
        Shopping Cart
      </h1>

      <div className="mt-8 flex flex-col gap-8 lg:flex-row">
        {/* CART ITEMS */}
        <div className="flex-1 divide-y divide-gray-100 rounded-2xl border border-gray-200 bg-white p-2 shadow-soft">
          {/* SELECT ALL */}
          <div className="flex items-center gap-3 border-b border-gray-100 px-3 py-3">
            <button
              type="button"
              onClick={handleSelectAll}
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors ${
                allSelected
                  ? "border-primary-600 bg-primary-600 text-white"
                  : "border-gray-300 bg-white"
              }`}
              aria-label={
                allSelected ? "Unselect all items" : "Select all items"
              }
            >
              {allSelected && <Check className="h-3.5 w-3.5" />}
            </button>

            <span className="text-sm font-medium text-gray-700">
              Select All
            </span>

            <span className="text-xs text-gray-400">
              ({selectedCount} items)
            </span>
          </div>

          {lines.map((line) => {
            const checked = isSelected(line.productId, line.variantId);

            return (
              <div
                key={`${line.productId}-${line.variantId ?? "base"}`}
                className={`flex flex-col gap-3 p-3 transition-opacity sm:flex-row sm:items-center sm:gap-4 ${
                  checked ? "opacity-100" : "opacity-60"
                }`}
              >
                {/* CHECKBOX + IMAGE */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      toggleSelected(line.productId, line.variantId)
                    }
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors ${
                      checked
                        ? "border-primary-600 bg-primary-600 text-white"
                        : "border-gray-300 bg-white"
                    }`}
                    aria-label={
                      checked ? `Unselect ${line.name}` : `Select ${line.name}`
                    }
                  >
                    {checked && <Check className="h-3.5 w-3.5" />}
                  </button>

                  <Link
                    href={`/product/${line.slug}`}
                    className="h-20 w-20 shrink-0"
                  >
                    <ProductImage
                      src={line.image}
                      alt={line.name}
                      colorway={line.colorway}
                    />
                  </Link>

                  {/* MOBILE PRODUCT INFO */}
                  <div className="min-w-0 flex-1 sm:hidden">
                    <Link
                      href={`/product/${line.slug}`}
                      className="line-clamp-2 font-medium text-gray-900 hover:text-primary-600"
                    >
                      {line.name}
                    </Link>

                    {line.variantLabel && (
                      <p className="text-xs text-gray-500">
                        {line.variantLabel}
                      </p>
                    )}

                    <p className="mt-1 text-sm text-gray-500">
                      {formatPrice(line.price)}
                    </p>
                  </div>
                </div>

                {/* DESKTOP PRODUCT INFO */}
                <div className="hidden min-w-0 flex-1 sm:block">
                  <Link
                    href={`/product/${line.slug}`}
                    className="line-clamp-2 font-medium text-gray-900 hover:text-primary-600"
                  >
                    {line.name}
                  </Link>

                  {line.variantLabel && (
                    <p className="text-xs text-gray-500">{line.variantLabel}</p>
                  )}

                  <p className="mt-1 text-sm text-gray-500">
                    {formatPrice(line.price)}
                  </p>
                </div>

                {/* QUANTITY + PRICE + REMOVE */}
                <div className="flex items-center justify-between gap-3 sm:shrink-0">
                  <div className="flex items-center rounded-full border border-gray-200">
                    <button
                      onClick={() =>
                        handleQuantityChange(
                          line.productId,
                          line.quantity - 1,
                          line.variantId,
                        )
                      }
                      className="px-3 py-1.5 text-gray-600 transition-colors hover:bg-gray-50"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>

                    <span className="w-8 text-center text-sm">
                      {line.quantity}
                    </span>

                    <button
                      onClick={() => {
                        if (line.quantity >= line.stock) {
                          showToast(`Only ${line.stock} in stock`, "error");
                          return;
                        }

                        handleQuantityChange(
                          line.productId,
                          line.quantity + 1,
                          line.variantId,
                        );
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
            );
          })}
        </div>

        {/* ORDER SUMMARY */}
        <div className="w-full shrink-0 self-start rounded-2xl border border-gray-200 bg-white p-6 shadow-soft lg:w-80">
          <h2 className="text-sm font-semibold text-gray-900">Order Summary</h2>

          <div className="mt-4 flex justify-between text-sm text-gray-600">
            <span>Selected Items</span>
            <span>{selectedCount}</span>
          </div>

          {/* SELECTED PRODUCTS */}
          <div className="mt-4 space-y-3">
            {selectedLines.map((line) => (
              <div
                key={`${line.productId}-${line.variantId ?? "base"}`}
                className="flex items-center gap-3"
              >
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-gray-100">
                  <ProductImage
                    src={line.image}
                    alt={line.name}
                    colorway={line.colorway}
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-gray-800">
                    {line.name}
                  </p>

                  {line.variantLabel && (
                    <p className="truncate text-[11px] text-gray-400">
                      {line.variantLabel}
                    </p>
                  )}

                  <p className="text-xs text-gray-500">
                    {line.quantity} × {formatPrice(line.price)}
                  </p>
                </div>

                <p className="shrink-0 text-xs font-semibold text-gray-800">
                  {formatPrice(line.price * line.quantity)}
                </p>
              </div>
            ))}
          </div>

          <div className="my-4 border-t border-gray-100" />

          <div className="flex justify-between text-base font-semibold text-gray-900">
            <span>Subtotal</span>
            <span>{formatPrice(selectedSubtotal)}</span>
          </div>

          <p className="mt-1 text-xs text-gray-400">
            Shipping and coupons calculated at checkout.
          </p>

          <Button
            type="button"
            onClick={handleCheckout}
            disabled={selectedLines.length === 0}
            className="mt-5 w-full disabled:cursor-not-allowed disabled:opacity-50"
            size="lg"
          >
            Proceed to Checkout
          </Button>
        </div>
      </div>
    </div>
  );
}
