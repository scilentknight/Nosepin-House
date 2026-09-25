"use client";

import { useMemo, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/Button";
import { WishlistButton } from "@/components/product/WishlistButton";
import { formatPrice } from "@/lib/format";
import { useToast } from "@/context/ToastContext";

interface AttributeValueOption {
  id: number;
  value: string;
  colorHex: string | null;
}

interface VariantGroup {
  id: number;
  name: string;
  type: "TEXT" | "COLOR";
  values: AttributeValueOption[];
}

interface VariantOption {
  id: number;
  price: number | null;
  compareAtPrice: number | null;
  stock: number;
  image: string | null;
  attributeValueIds: number[];
}

export function ProductPurchasePanel({
  productId,
  basePrice,
  baseCompareAtPrice,
  baseStock,
  variantGroups,
  variants,
  initialSelected,
}: {
  productId: number;
  basePrice: number;
  baseCompareAtPrice: number | null;
  baseStock: number;
  variantGroups: VariantGroup[];
  variants: VariantOption[];
  initialSelected?: Record<number, number>;
}) {
  const { addItem } = useCart();
  const showToast = useToast();
  const { status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [selected, setSelected] = useState<Record<number, number>>(initialSelected ?? {});
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isBuyingNow, setIsBuyingNow] = useState(false);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasVariants = variantGroups.length > 0;
  const selectedIds = useMemo(() => Object.values(selected), [selected]);
  const isComplete = hasVariants && variantGroups.every((g) => selected[g.id] !== undefined);

  const matchedVariant = useMemo(() => {
    if (!isComplete) return null;
    return (
      variants.find(
        (v) => v.attributeValueIds.length === selectedIds.length && selectedIds.every((id) => v.attributeValueIds.includes(id))
      ) ?? null
    );
  }, [isComplete, selectedIds, variants]);

  /** A value is unavailable if no variant matches it combined with the rest of the current selection. */
  function isValueAvailable(groupId: number, valueId: number) {
    const trialSelection = { ...selected, [groupId]: valueId };
    const trialIds = Object.values(trialSelection);
    return variants.some((v) => trialIds.every((id) => v.attributeValueIds.includes(id)));
  }

  function selectValue(groupId: number, valueId: number) {
    setError(null);
    setAdded(false);
    setSelected((prev) => (prev[groupId] === valueId ? prev : { ...prev, [groupId]: valueId }));
  }

  const effectivePrice = matchedVariant?.price ?? basePrice;
  const effectiveCompareAtPrice = matchedVariant ? matchedVariant.compareAtPrice : baseCompareAtPrice;
  const effectiveStock = hasVariants ? (matchedVariant?.stock ?? 0) : baseStock;
  const onSale = effectiveCompareAtPrice !== null && effectiveCompareAtPrice > effectivePrice;
  const outOfStock = effectiveStock <= 0;

  async function handleAction(after: () => void) {
    if (hasVariants && !isComplete) {
      setError(`Please select ${variantGroups.map((g) => g.name).join(" and ")}`);
      return false;
    }
    if (hasVariants && !matchedVariant) {
      setError("This combination is not available");
      return false;
    }
    try {
      await addItem(String(productId), quantity, matchedVariant?.id ?? null);
      after();
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not add this item to your cart";
      setError(message);
      showToast(message, "error");
      return false;
    }
  }

  function redirectToLogin() {
    router.push(`/login?callbackUrl=${encodeURIComponent(pathname ?? "/")}`);
  }

  async function handleAdd() {
    if (status !== "authenticated") {
      redirectToLogin();
      return;
    }
    setIsAdding(true);
    setError(null);
    const ok = await handleAction(() => {
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    });
    setIsAdding(false);
    if (!ok) return;
  }

  async function handleBuyNow() {
    if (status !== "authenticated") {
      redirectToLogin();
      return;
    }
    setIsBuyingNow(true);
    setError(null);
    const ok = await handleAction(() => router.push("/cart"));
    if (!ok) setIsBuyingNow(false);
  }

  return (
    <div>
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-bold text-primary-700">{formatPrice(effectivePrice)}</span>
        {onSale && <span className="text-lg text-gray-400 line-through">{formatPrice(effectiveCompareAtPrice!)}</span>}
      </div>

      {hasVariants && (
        <div className="mt-5 flex flex-col gap-4">
          {variantGroups.map((group) => (
            <div key={group.id}>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                {group.name}
                {selected[group.id] !== undefined && (
                  <span className="ml-1.5 font-normal normal-case text-gray-400">
                    — {group.values.find((v) => v.id === selected[group.id])?.value}
                  </span>
                )}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {group.type === "COLOR"
                  ? group.values.map((v) => {
                      const available = isValueAvailable(group.id, v.id);
                      const isSelected = selected[group.id] === v.id;
                      return (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() => selectValue(group.id, v.id)}
                          disabled={!available}
                          title={v.value}
                          aria-label={v.value}
                          aria-current={isSelected}
                          className={`flex h-9 w-9 items-center justify-center rounded-full ring-2 ring-offset-2 transition-shadow disabled:cursor-not-allowed disabled:opacity-30 ${
                            isSelected ? "ring-primary-500" : "ring-transparent hover:ring-gray-200"
                          }`}
                        >
                          <span
                            className="h-7 w-7 rounded-full border border-black/10"
                            style={{ backgroundColor: v.colorHex ?? "#d1d5db" }}
                          />
                        </button>
                      );
                    })
                  : group.values.map((v) => {
                      const available = isValueAvailable(group.id, v.id);
                      const isSelected = selected[group.id] === v.id;
                      return (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() => selectValue(group.id, v.id)}
                          disabled={!available}
                          aria-current={isSelected}
                          className={`rounded-lg border px-3.5 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-30 ${
                            isSelected
                              ? "border-primary-500 bg-primary-50 text-primary-700"
                              : "border-gray-200 text-gray-700 hover:border-gray-300"
                          }`}
                        >
                          {v.value}
                        </button>
                      );
                    })}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-soft">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center rounded-full border border-gray-200">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-3.5 py-2 text-gray-600 transition-colors hover:bg-gray-50"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="w-10 text-center text-sm font-medium">{quantity}</span>
              <button
                type="button"
                onClick={() => {
                  if (quantity >= effectiveStock) {
                    showToast(`Only ${effectiveStock} in stock`, "error");
                    return;
                  }
                  setQuantity((q) => Math.min(Math.max(effectiveStock, 1), q + 1));
                }}
                className="px-3.5 py-2 text-gray-600 transition-colors hover:bg-gray-50"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                outOfStock ? "bg-red-50 text-red-600" : "bg-accent-50 text-accent-700"
              }`}
            >
              {hasVariants && !isComplete ? "Select options" : outOfStock ? "Out of stock" : `${effectiveStock} in stock`}
            </span>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              size="lg"
              className="flex-1"
              disabled={outOfStock && isComplete}
              isLoading={isAdding}
              onClick={handleAdd}
            >
              {added ? "Added ✓" : "Add to Cart"}
            </Button>
            <Button
              variant="primary"
              size="lg"
              className="flex-1"
              disabled={outOfStock && isComplete}
              isLoading={isBuyingNow}
              onClick={handleBuyNow}
            >
              Buy Now
            </Button>
            <WishlistButton
              productId={productId}
              variantId={matchedVariant?.id ?? null}
              size="lg"
              className="border border-gray-200 shadow-none"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  );
}
