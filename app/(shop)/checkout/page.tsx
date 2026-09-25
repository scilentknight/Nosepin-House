"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { type AddressInput } from "@/schemas/checkout";
import { Button } from "@/components/ui/Button";
import { AddressForm } from "@/components/account/AddressForm";
import { formatPrice } from "@/lib/format";

interface SavedAddress extends AddressInput {
  id: number;
  isDefault: boolean;
  province: { name: string };
  district: { name: string };
  municipality: { name: string };
}

interface ShippingEstimate {
  shippingFee: number;
  shippingLabel: string | null;
  tax: number;
  taxLabel: string | null;
  total: number;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { lines, subtotal, isLoading } = useCart();
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [saveAddress, setSaveAddress] = useState(true);
  const [newAddressMunicipalityId, setNewAddressMunicipalityId] = useState<number | null>(null);

  const municipalityId = showNewForm
    ? newAddressMunicipalityId
    : addresses.find((a) => a.id === selectedId)?.municipalityId ?? null;

  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState<string | null>(null);
  const [discount, setDiscount] = useState(0);
  const [appliedCode, setAppliedCode] = useState<string | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const [shippingEstimate, setShippingEstimate] = useState<ShippingEstimate | null>(null);
  const [isEstimating, setIsEstimating] = useState(false);

  useEffect(() => {
    fetch("/api/addresses")
      .then((res) => res.json())
      .then((json) => {
        const list: SavedAddress[] = json.data ?? [];
        setAddresses(list);
        if (list.length > 0) {
          setSelectedId(list.find((a) => a.isDefault)?.id ?? list[0].id);
        } else {
          setShowNewForm(true);
        }
      });
  }, []);

  useEffect(() => {
    let cancelled = false;
    setIsEstimating(true);
    fetch("/api/shipping-estimate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ country: "Nepal", subtotal, discount, municipalityId }),
    })
      .then((res) => res.json())
      .then((json) => {
        if (!cancelled) setShippingEstimate(json.data ?? null);
      })
      .finally(() => {
        if (!cancelled) setIsEstimating(false);
      });

    return () => {
      cancelled = true;
    };
  }, [subtotal, discount, municipalityId]);

  async function applyCoupon() {
    if (!couponCode.trim()) return;
    setIsApplyingCoupon(true);
    setCouponError(null);
    const res = await fetch("/api/coupons/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: couponCode, subtotal }),
    });
    const json = await res.json();
    setIsApplyingCoupon(false);
    if (!res.ok) {
      setCouponError(json.message ?? "Invalid coupon");
      setDiscount(0);
      setAppliedCode(null);
      return;
    }
    setDiscount(json.data.discount);
    setAppliedCode(json.data.code);
  }

  function proceedWithAddress(payload: { addressId?: number; address?: AddressInput; saveAddress?: boolean }) {
    sessionStorage.setItem(
      "bikesh-checkout-draft",
      JSON.stringify({
        ...payload,
        couponCode: appliedCode,
        discount,
        subtotal,
        shippingFee: shippingEstimate?.shippingFee ?? 0,
        shippingLabel: shippingEstimate?.shippingLabel ?? null,
        tax: shippingEstimate?.tax ?? 0,
        taxLabel: shippingEstimate?.taxLabel ?? null,
      })
    );
    router.push("/checkout/payment");
  }

  function onSubmitNewAddress(values: AddressInput) {
    proceedWithAddress({ address: values, saveAddress });
  }

  function continueWithSavedAddress() {
    if (!selectedId) return;
    proceedWithAddress({ addressId: selectedId });
  }

  if (isLoading) {
    return <div className="mx-auto max-w-7xl px-4 py-16 text-center text-gray-500">Loading…</div>;
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center text-gray-500">
        Your cart is empty. <a href="/shop" className="text-primary-600 underline">Go shopping</a>.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">Checkout</h1>

      <div className="mt-8 flex flex-col gap-8 lg:flex-row">
        <div className="flex-1 space-y-6">
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-soft">
            <h2 className="text-sm font-semibold text-gray-900">Billing Address</h2>

            {addresses.length > 0 && !showNewForm && (
              <div className="mt-4 space-y-3">
                {addresses.map((addr) => (
                  <label
                    key={addr.id}
                    className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 text-sm transition-colors ${
                      selectedId === addr.id ? "border-primary-400 bg-primary-50 ring-1 ring-primary-200" : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="address"
                      checked={selectedId === addr.id}
                      onChange={() => setSelectedId(addr.id)}
                      className="mt-1 accent-primary-600"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{addr.fullName}</p>
                      <p className="text-gray-600">
                        {addr.line1}
                        {addr.landmark ? ` (near ${addr.landmark})` : ""}, {addr.municipality.name} — Ward {addr.wardNo},{" "}
                        {addr.district.name}, {addr.province.name}
                      </p>
                      <p className="text-gray-500">{addr.phone}</p>
                    </div>
                    {selectedId === addr.id && (
                      <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-primary-600" fill="none" stroke="currentColor" strokeWidth={2}>
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </label>
                ))}
                <button
                  type="button"
                  onClick={() => setShowNewForm(true)}
                  className="text-sm font-medium text-primary-600 hover:underline"
                >
                  + Use a new address
                </button>
              </div>
            )}

            {showNewForm && (
              <div className="mt-4">
                <AddressForm
                  onSubmit={onSubmitNewAddress}
                  onCancel={addresses.length > 0 ? () => setShowNewForm(false) : undefined}
                  submitLabel="Continue to Payment"
                  onLocationChange={(loc) => setNewAddressMunicipalityId(loc.municipalityId ?? null)}
                  extraFooter={
                    <label className="flex items-center gap-2 text-sm text-gray-600 sm:col-span-2">
                      <input type="checkbox" checked={saveAddress} onChange={(e) => setSaveAddress(e.target.checked)} />
                      Save this address for next time
                    </label>
                  }
                />
              </div>
            )}

            {addresses.length > 0 && !showNewForm && (
              <Button className="mt-5 w-full" size="lg" onClick={continueWithSavedAddress} disabled={!selectedId}>
                Continue to Payment
              </Button>
            )}
          </section>
        </div>

        <div className="w-full shrink-0 self-start rounded-2xl border border-gray-200 bg-white p-6 shadow-soft lg:w-[30rem]">
          <h2 className="text-sm font-semibold text-gray-900">Order Summary</h2>
          <ul className="mt-4 space-y-2.5 text-sm text-gray-600">
            {lines.map((line) => (
              <li key={line.productId} className="flex items-start justify-between gap-3">
                <span className="min-w-0 flex-1 truncate">{line.name} × {line.quantity}</span>
                <span className="shrink-0 whitespace-nowrap">{formatPrice(line.price * line.quantity)}</span>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex gap-2">
            <input
              type="text"
              placeholder="Coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
            />
            <Button type="button" variant="outline" size="sm" isLoading={isApplyingCoupon} onClick={applyCoupon}>
              Apply
            </Button>
          </div>
          {couponError && <p className="mt-1 text-xs text-red-600">{couponError}</p>}
          {appliedCode && <p className="mt-1 text-xs text-accent-700">Coupon &quot;{appliedCode}&quot; applied</p>}

          <div className="mt-4 space-y-1 border-t border-gray-100 pt-4 text-sm">
            <div className="flex items-start justify-between gap-3 text-gray-600">
              <span>Subtotal</span>
              <span className="shrink-0 whitespace-nowrap">{formatPrice(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex items-start justify-between gap-3 text-accent-700">
                <span>Discount</span>
                <span className="shrink-0 whitespace-nowrap">-{formatPrice(discount)}</span>
              </div>
            )}
            <div className="flex items-start justify-between gap-3 text-gray-600">
              <span className="min-w-0">
                Shipping
                {shippingEstimate?.shippingLabel && (
                  <span className="block truncate text-xs text-gray-400">{shippingEstimate.shippingLabel}</span>
                )}
              </span>
              <span className="shrink-0 whitespace-nowrap">
                {isEstimating
                  ? "…"
                  : shippingEstimate
                    ? shippingEstimate.shippingFee > 0
                      ? formatPrice(shippingEstimate.shippingFee)
                      : "Free"
                    : "—"}
              </span>
            </div>
            {shippingEstimate && shippingEstimate.tax > 0 && (
              <div className="flex items-start justify-between gap-3 text-gray-600">
                <span className="min-w-0 truncate">{shippingEstimate.taxLabel ?? "Tax"}</span>
                <span className="shrink-0 whitespace-nowrap">{formatPrice(shippingEstimate.tax)}</span>
              </div>
            )}
            <div className="flex items-start justify-between gap-3 pt-1 text-base font-bold text-gray-900">
              <span>Total</span>
              <span className="shrink-0 whitespace-nowrap">
                {formatPrice(shippingEstimate ? shippingEstimate.total : Math.max(0, subtotal - discount))}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
