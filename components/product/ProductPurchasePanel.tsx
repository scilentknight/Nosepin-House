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
  sku?: string | null;
  price: number | null;
  compareAtPrice: number | null;
  stock: number;
  lowStockAlert?: number | null;
  weight?: number | null;
  image: string | null;
  attributeValueIds: number[];
}

interface ProductPurchasePanelProps {
  productId: number;

  basePrice: number;
  baseCompareAtPrice: number | null;
  baseStock: number;

  minimumOrderQuantity: number;
  maximumOrderQuantity: number | null;

  stockStatus: string;

  forCustomer: boolean;
  customerDiscountPercent: number | null;

  hasDiscount: boolean;
  discountType: string | null;
  discountValue: number | null;

  variantGroups: VariantGroup[];
  variants: VariantOption[];

  initialSelected?: Record<number, number>;
}

export function ProductPurchasePanel({
  productId,

  basePrice,
  baseCompareAtPrice,
  baseStock,

  minimumOrderQuantity,
  maximumOrderQuantity,

  stockStatus,

  forCustomer,
  customerDiscountPercent,

  hasDiscount,
  discountType,
  discountValue,

  variantGroups,
  variants,

  initialSelected,
}: ProductPurchasePanelProps) {
  const { addItem } = useCart();

  const showToast = useToast();

  const { status } = useSession();

  const router = useRouter();

  const pathname = usePathname();

  const [selected, setSelected] = useState<Record<number, number>>(
    initialSelected ?? {},
  );

  const safeMinimumQuantity = Math.max(1, minimumOrderQuantity || 1);

  const [quantity, setQuantity] = useState(safeMinimumQuantity);

  const [isAdding, setIsAdding] = useState(false);

  const [isBuyingNow, setIsBuyingNow] = useState(false);

  const [added, setAdded] = useState(false);

  const [error, setError] = useState<string | null>(null);

  // ============================================================
  // VARIANTS
  // ============================================================

  const hasVariants = variantGroups.length > 0;

  const selectedIds = useMemo(() => Object.values(selected), [selected]);

  const isComplete =
    hasVariants &&
    variantGroups.every((group) => selected[group.id] !== undefined);

  const matchedVariant = useMemo(() => {
    if (!isComplete) {
      return null;
    }

    return (
      variants.find(
        (variant) =>
          variant.attributeValueIds.length === selectedIds.length &&
          selectedIds.every((id) => variant.attributeValueIds.includes(id)),
      ) ?? null
    );
  }, [isComplete, selectedIds, variants]);

  // ============================================================
  // AVAILABILITY
  // ============================================================

  function isValueAvailable(groupId: number, valueId: number) {
    const trialSelection = {
      ...selected,
      [groupId]: valueId,
    };

    const trialIds = Object.values(trialSelection);

    return variants.some((variant) =>
      trialIds.every((id) => variant.attributeValueIds.includes(id)),
    );
  }

  function selectValue(groupId: number, valueId: number) {
    setError(null);

    setAdded(false);

    setSelected((previous) =>
      previous[groupId] === valueId
        ? previous
        : {
            ...previous,
            [groupId]: valueId,
          },
    );
  }

  // ============================================================
  // EFFECTIVE PRICE
  // ============================================================

  const variantPrice = matchedVariant?.price ?? null;

  const effectiveBasePrice = variantPrice ?? basePrice;

  const variantComparePrice = matchedVariant?.compareAtPrice ?? null;

  const effectiveCompareAtPrice = variantComparePrice ?? baseCompareAtPrice;

  // ============================================================
  // CUSTOMER DISCOUNT
  // ============================================================

  const customerDiscount =
    forCustomer &&
    customerDiscountPercent !== null &&
    customerDiscountPercent > 0
      ? customerDiscountPercent
      : null;

  const customerDiscountPrice =
    customerDiscount !== null
      ? effectiveBasePrice - (effectiveBasePrice * customerDiscount) / 100
      : null;

  const effectivePrice = customerDiscountPrice ?? effectiveBasePrice;

  // ============================================================
  // STOCK
  // ============================================================

  const effectiveStock = hasVariants ? (matchedVariant?.stock ?? 0) : baseStock;

  const isExplicitlyOutOfStock = stockStatus === "OUT_OF_STOCK";

  const outOfStock = isExplicitlyOutOfStock || effectiveStock <= 0;

  // ============================================================
  // QUANTITY LIMITS
  // ============================================================

  const maximumByProduct =
    maximumOrderQuantity !== null
      ? maximumOrderQuantity
      : Number.POSITIVE_INFINITY;

  const maximumAllowedQuantity = Math.min(effectiveStock, maximumByProduct);

  const quantityLimitReached = quantity >= maximumAllowedQuantity;

  const quantityBelowMinimum = quantity < safeMinimumQuantity;

  const onSale =
    effectiveCompareAtPrice !== null &&
    effectiveCompareAtPrice > effectivePrice;

  // ============================================================
  // QUANTITY
  // ============================================================

  function decreaseQuantity() {
    setQuantity((current) => Math.max(safeMinimumQuantity, current - 1));
  }

  function increaseQuantity() {
    if (outOfStock) {
      return;
    }

    if (currentQuantityCannotIncrease()) {
      return;
    }

    setQuantity((current) => Math.min(maximumAllowedQuantity, current + 1));
  }

  function currentQuantityCannotIncrease() {
    if (
      Number.isFinite(maximumAllowedQuantity) &&
      quantity >= maximumAllowedQuantity
    ) {
      const reason =
        maximumByProduct !== Number.POSITIVE_INFINITY &&
        maximumAllowedQuantity === maximumByProduct
          ? `Maximum ${maximumByProduct} allowed per order`
          : `Only ${effectiveStock} in stock`;

      showToast(reason, "error");

      return true;
    }

    return false;
  }

  // ============================================================
  // ACTION
  // ============================================================

  async function handleAction(after: () => void) {
    if (hasVariants && !isComplete) {
      setError(
        `Please select ${variantGroups
          .map((group) => group.name)
          .join(" and ")}`,
      );

      return false;
    }

    if (hasVariants && !matchedVariant) {
      setError("This combination is not available");

      return false;
    }

    if (outOfStock) {
      setError("This product is out of stock");

      return false;
    }

    if (quantity < safeMinimumQuantity) {
      setError(`Minimum order quantity is ${safeMinimumQuantity}`);

      return false;
    }

    if (
      maximumByProduct !== Number.POSITIVE_INFINITY &&
      quantity > maximumByProduct
    ) {
      setError(`Maximum order quantity is ${maximumByProduct}`);

      return false;
    }

    if (quantity > effectiveStock) {
      setError(`Only ${effectiveStock} in stock`);

      return false;
    }

    try {
      await addItem(String(productId), quantity, matchedVariant?.id ?? null);

      after();

      return true;
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Could not add this item to your cart";

      setError(message);

      showToast(message, "error");

      return false;
    }
  }

  // ============================================================
  // LOGIN
  // ============================================================

  function redirectToLogin() {
    router.push(`/login?callbackUrl=${encodeURIComponent(pathname ?? "/")}`);
  }

  // ============================================================
  // ADD TO CART
  // ============================================================

  async function handleAdd() {
    if (status !== "authenticated") {
      redirectToLogin();
      return;
    }

    setIsAdding(true);

    setError(null);

    const success = await handleAction(() => {
      setAdded(true);

      setTimeout(() => setAdded(false), 2000);
    });

    setIsAdding(false);

    if (!success) {
      return;
    }
  }

  // ============================================================
  // BUY NOW
  // ============================================================

  async function handleBuyNow() {
    if (status !== "authenticated") {
      redirectToLogin();
      return;
    }

    setIsBuyingNow(true);

    setError(null);

    const success = await handleAction(() => router.push("/cart"));

    if (!success) {
      setIsBuyingNow(false);
    }
  }

  return (
    <div>
      {/* ======================================================
          PRICE
      ====================================================== */}

      <div className="flex flex-wrap items-baseline gap-3">
        <span className="text-3xl font-bold text-primary-700">
          {formatPrice(effectivePrice)}
        </span>

        {onSale && (
          <span className="text-lg text-gray-400 line-through">
            {formatPrice(effectiveCompareAtPrice!)}
          </span>
        )}
      </div>

      {/* CUSTOMER DISCOUNT */}

      {customerDiscount !== null && (
        <div className="mt-2">
          <span className="text-xs font-medium text-green-600">
            {customerDiscount}% customer discount applied
          </span>
        </div>
      )}

      {/* PRODUCT DISCOUNT */}

      {hasDiscount && discountValue !== null && discountValue > 0 && (
        <div className="mt-2">
          <span className="inline-flex rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">
            {discountType === "PERCENTAGE"
              ? `${discountValue}% OFF`
              : `Discount ${formatPrice(discountValue)}`}
          </span>
        </div>
      )}

      {/* ======================================================
          VARIANTS
      ====================================================== */}

      {hasVariants && (
        <div className="mt-5 flex flex-col gap-4">
          {variantGroups.map((group) => (
            <div key={group.id}>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                {group.name}

                {selected[group.id] !== undefined && (
                  <span className="ml-1.5 font-normal normal-case text-gray-400">
                    —{" "}
                    {
                      group.values.find(
                        (value) => value.id === selected[group.id],
                      )?.value
                    }
                  </span>
                )}
              </p>

              <div className="mt-2 flex flex-wrap gap-2">
                {group.type === "COLOR"
                  ? group.values.map((value) => {
                      const available = isValueAvailable(group.id, value.id);

                      const isSelected = selected[group.id] === value.id;

                      return (
                        <button
                          key={value.id}
                          type="button"
                          onClick={() => selectValue(group.id, value.id)}
                          disabled={!available}
                          title={value.value}
                          aria-label={value.value}
                          aria-current={isSelected}
                          className={`flex h-9 w-9 items-center justify-center rounded-full ring-2 ring-offset-2 transition-shadow disabled:cursor-not-allowed disabled:opacity-30 ${
                            isSelected
                              ? "ring-primary-500"
                              : "ring-transparent hover:ring-gray-200"
                          }`}
                        >
                          <span
                            className="h-7 w-7 rounded-full border border-black/10"
                            style={{
                              backgroundColor: value.colorHex ?? "#d1d5db",
                            }}
                          />
                        </button>
                      );
                    })
                  : group.values.map((value) => {
                      const available = isValueAvailable(group.id, value.id);

                      const isSelected = selected[group.id] === value.id;

                      return (
                        <button
                          key={value.id}
                          type="button"
                          onClick={() => selectValue(group.id, value.id)}
                          disabled={!available}
                          aria-current={isSelected}
                          className={`rounded-lg border px-3.5 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-30 ${
                            isSelected
                              ? "border-primary-500 bg-primary-50 text-primary-700"
                              : "border-gray-200 text-gray-700 hover:border-gray-300"
                          }`}
                        >
                          {value.value}
                        </button>
                      );
                    })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ======================================================
          PURCHASE BOX
      ====================================================== */}

      <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-soft">
        <div className="flex flex-col gap-3">
          {/* QUANTITY */}

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-full border border-gray-200">
              <button
                type="button"
                onClick={decreaseQuantity}
                disabled={quantity <= safeMinimumQuantity}
                className="px-3.5 py-2 text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Decrease quantity"
              >
                −
              </button>

              <span className="w-10 text-center text-sm font-medium">
                {quantity}
              </span>

              <button
                type="button"
                onClick={increaseQuantity}
                disabled={outOfStock || quantityLimitReached}
                className="px-3.5 py-2 text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            {/* STOCK STATUS */}

            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                outOfStock
                  ? "bg-red-50 text-red-600"
                  : "bg-accent-50 text-accent-700"
              }`}
            >
              {hasVariants && !isComplete
                ? "Select options"
                : outOfStock
                  ? "Out of stock"
                  : `${effectiveStock} in stock`}
            </span>
          </div>

          {/* QUANTITY INFO */}

          <div className="flex flex-wrap gap-3 text-xs text-gray-500">
            {safeMinimumQuantity > 1 && (
              <span>
                Minimum order:{" "}
                <strong className="text-gray-700">{safeMinimumQuantity}</strong>
              </span>
            )}

            {maximumByProduct !== Number.POSITIVE_INFINITY && (
              <span>
                Maximum order:{" "}
                <strong className="text-gray-700">{maximumByProduct}</strong>
              </span>
            )}
          </div>

          {/* LOW STOCK */}

          {!outOfStock && effectiveStock > 0 && effectiveStock <= 5 && (
            <p className="text-xs font-medium text-orange-600">
              Only {effectiveStock} left in stock
            </p>
          )}

          {/* BUTTONS */}

          <div className="flex gap-3">
            <Button
              variant="outline"
              size="lg"
              className="flex-1"
              disabled={
                outOfStock ||
                quantityBelowMinimum ||
                (hasVariants && !isComplete)
              }
              isLoading={isAdding}
              onClick={handleAdd}
            >
              {added ? "Added ✓" : "Add to Cart"}
            </Button>

            <Button
              variant="primary"
              size="lg"
              className="flex-1"
              disabled={
                outOfStock ||
                quantityBelowMinimum ||
                (hasVariants && !isComplete)
              }
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

          {/* ERROR */}

          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  );
}
