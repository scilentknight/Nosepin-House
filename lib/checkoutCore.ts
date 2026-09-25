import type { PaymentMethod, PaymentStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { ApiError } from "@/lib/session";
import { generateOrderNumber } from "@/lib/orderNumber";
import { addressSchema } from "@/schemas/checkout";
import { resolveShippingFee } from "@/lib/shipping";
import { resolveTaxRate, computeTax } from "@/lib/tax";
import {
  computeAutoPv,
  computeDiscountedUnitPrice,
  isPvEligible,
  selectDiscountPercent,
  type PricingProductFlags,
} from "@/lib/pricing";

export interface ShippingSnapshot {
  fullName: string;
  phone: string;
  email: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  /** Not persisted onto Order directly — carried alongside the snapshot so checkout can look up
   * a municipality-specific shipping rate and resolve dealer options (dealer matching is
   * city-level, see lib/dealerSelection.ts — wardNo below is not used for that). */
  municipalityId: number;
  wardNo: number;
}

/** Formats an Address's province/municipality/ward into the flat display strings Order stores. */
function toShippingSnapshot(
  address: {
    fullName: string;
    phone: string;
    line1: string;
    landmark: string | null;
    wardNo: number;
    province: { name: string };
    municipality: { id: number; name: string };
  },
  email: string
): ShippingSnapshot {
  return {
    fullName: address.fullName,
    phone: address.phone,
    email,
    line1: address.line1,
    line2: address.landmark,
    city: `${address.municipality.name} - Ward ${address.wardNo}`,
    state: address.province.name,
    postalCode: "",
    country: "Nepal",
    municipalityId: address.municipality.id,
    wardNo: address.wardNo,
  };
}

/** Validates a province/district/municipality/ward combination against the seeded AddressBook tree, including that each level is actually nested under the one above it. */
export async function validateAddressLocation(
  provinceId: number,
  districtId: number,
  municipalityId: number,
  wardNo: number
) {
  const [province, district, municipality] = await Promise.all([
    prisma.addressBook.findUnique({ where: { id: provinceId } }),
    prisma.addressBook.findUnique({ where: { id: districtId } }),
    prisma.addressBook.findUnique({ where: { id: municipalityId } }),
  ]);
  if (!province || province.level !== "PROVINCE") throw new ApiError(400, "Invalid province");
  if (!district || district.level !== "DISTRICT" || district.parentId !== province.id) {
    throw new ApiError(400, "Invalid district");
  }
  if (!municipality || municipality.level !== "MUNICIPALITY" || municipality.parentId !== district.id) {
    throw new ApiError(400, "Invalid city");
  }
  if (municipality.wardCount && wardNo > municipality.wardCount) {
    throw new ApiError(400, `Ward number must be between 1 and ${municipality.wardCount}`);
  }
  return { province, district, municipality };
}

/**
 * Resolves a saved address by id, or validates+normalizes a fresh one.
 * Pass `persist: false` to validate without saving — used by the eSewa "initiate"
 * step so a fresh address isn't saved twice (once at initiate, once at complete).
 */
export async function resolveShippingAddress(
  user: { id: number; email?: string | null },
  body: { addressId?: number; address?: unknown; saveAddress?: boolean },
  { persist = true }: { persist?: boolean } = {}
): Promise<ShippingSnapshot> {
  const email = user.email ?? "";
  if (body.addressId) {
    const saved = await prisma.address.findUnique({
      where: { id: body.addressId },
      include: { province: true, municipality: true },
    });
    if (!saved || saved.userId !== user.id) throw new ApiError(404, "Address not found");
    return toShippingSnapshot(saved, email);
  }

  const parsed = addressSchema.safeParse(body.address);
  if (!parsed.success) {
    throw new ApiError(400, parsed.error.issues[0]?.message ?? "Invalid shipping address");
  }

  const { province, municipality } = await validateAddressLocation(
    parsed.data.provinceId,
    parsed.data.districtId,
    parsed.data.municipalityId,
    parsed.data.wardNo
  );

  const shipping = toShippingSnapshot(
    { ...parsed.data, landmark: parsed.data.landmark || null, province, municipality },
    email
  );

  if (body.saveAddress && persist) {
    await prisma.address.create({
      data: {
        userId: user.id,
        fullName: parsed.data.fullName,
        phone: parsed.data.phone,
        line1: parsed.data.line1,
        provinceId: parsed.data.provinceId,
        districtId: parsed.data.districtId,
        municipalityId: parsed.data.municipalityId,
        wardNo: parsed.data.wardNo,
        landmark: parsed.data.landmark || null,
        addressType: parsed.data.addressType,
      },
    });
  }

  return shipping;
}

const cartInclude = {
  items: {
    include: {
      product: { include: { images: { take: 1 as const } } },
      variant: { include: { attributeValues: { include: { attributeValue: { include: { attribute: true } } } } } },
    },
  },
} satisfies Prisma.CartInclude;

type ValidatedCart = Prisma.CartGetPayload<{ include: typeof cartInclude }>;

interface VariantWithAttributeValues {
  attributeValues: { attributeValue: { value: string; attribute: { sortOrder: number } } }[];
}

/** Builds a display label like "Red / Medium" from a variant's attribute values, in attribute sortOrder. */
export function variantLabel(variant: VariantWithAttributeValues | null | undefined): string | null {
  if (!variant) return null;
  const sorted = [...variant.attributeValues].sort(
    (a, b) => a.attributeValue.attribute.sortOrder - b.attributeValue.attribute.sortOrder
  );
  const label = sorted.map((av) => av.attributeValue.value).join(" / ");
  return label || null;
}

export interface SelectedCartItem {
  productId: number;
  variantId: number | null;
}

/**
 * Parses the Cart page's `selectedItems` from a request body (an array of `{productId, variantId}`).
 * Returns undefined when absent, so every checkout route can pass this straight into
 * `loadValidatedCart` without special-casing "no selection was sent" — that path checks out the
 * whole cart, matching behavior from before per-item selection existed.
 */
export function parseSelectedItems(body: { selectedItems?: unknown }): SelectedCartItem[] | undefined {
  if (!Array.isArray(body.selectedItems)) return undefined;
  return body.selectedItems
    .map((item) => ({
      productId: Number((item as { productId?: unknown })?.productId),
      variantId:
        (item as { variantId?: unknown })?.variantId != null
          ? Number((item as { variantId?: unknown }).variantId)
          : null,
    }))
    .filter((item): item is SelectedCartItem => Number.isFinite(item.productId));
}

/**
 * Loads the user's cart and throws if it's empty or any line exceeds available stock. Pass
 * `selectedItems` (from the Cart page's checkboxes) to check out only that subset — the rest of
 * the cart is left untouched, both here and by `createOrderFromCart`'s cart cleanup below.
 * Omitting it checks out the whole cart, preserving the pre-selection behavior.
 */
export async function loadValidatedCart(userId: number, selectedItems?: SelectedCartItem[]): Promise<ValidatedCart> {
  const cart = await prisma.cart.findUnique({ where: { userId }, include: cartInclude });

  if (!cart || cart.items.length === 0) throw new ApiError(400, "Your cart is empty");

  let items = cart.items;
  if (selectedItems) {
    const keys = new Set(selectedItems.map((s) => `${s.productId}:${s.variantId ?? "base"}`));
    items = items.filter((item) => keys.has(`${item.productId}:${item.variantId ?? "base"}`));
    if (items.length === 0) throw new ApiError(400, "No items were selected to check out");
  }

  for (const item of items) {
    if (item.product.status !== "PUBLISHED" || item.product.deletedAt) {
      throw new ApiError(400, `${item.product.name} is no longer available. Please remove it from your cart.`);
    }
    if (item.variantId && (!item.variant || item.variant.status !== "ACTIVE" || item.variant.deletedAt)) {
      throw new ApiError(400, `The selected option for ${item.product.name} is no longer available. Please remove it from your cart.`);
    }
    const availableStock = item.variant ? item.variant.stockQuantity : item.product.stock;
    const label = variantLabel(item.variant);
    if (item.quantity > availableStock) {
      throw new ApiError(400, `${item.product.name}${label ? ` (${label})` : ""} only has ${availableStock} left in stock`);
    }
  }

  return { ...cart, items };
}

export interface CartItemPricing {
  unitPrice: number;
  discountPercent: number | null;
  pvPerUnit: number;
}

export { computeDiscountedUnitPrice };

/**
 * Pure selection rule, isolated from Prisma so it's directly unit-testable — see
 * selectDiscountPercent/isPvEligible in lib/pricing.ts for the actual selection rule.
 */
export function selectItemPricing(
  productId: number,
  basePrice: number,
  product: PricingProductFlags,
  isDistributor: boolean,
  distributorDiscounts: Map<number, number>,
  distributorPvEligible: Set<number>
): CartItemPricing {
  const discountPercent = selectDiscountPercent(productId, product, isDistributor, distributorDiscounts);
  const unitPrice = computeDiscountedUnitPrice(basePrice, discountPercent);
  // PV is 0.2% of what the distributor actually pays — their own discounted price, not the list price.
  const pvPerUnit = isPvEligible(productId, product, isDistributor, distributorPvEligible) ? computeAutoPv(unitPrice) : 0;

  return {
    unitPrice,
    discountPercent,
    pvPerUnit,
  };
}

/**
 * Resolves the per-cart-item unit price, discount%, and PV for the purchasing user, keyed by
 * cartItem.id. See selectItemPricing for the actual selection rule.
 */
export async function resolveCartPricing(
  cart: ValidatedCart,
  user: { id: number; role: string }
): Promise<Map<number, CartItemPricing>> {
  const isDistributor = user.role === "DISTRIBUTOR";
  const productIds = [...new Set(cart.items.map((item) => item.productId))];

  const distributorDiscounts = new Map<number, number>();
  const distributorPvEligible = new Set<number>();

  if (isDistributor && productIds.length > 0) {
    const [discountRules, pvRules] = await Promise.all([
      prisma.productDistributorDiscount.findMany({
        where: { distributorId: user.id, productId: { in: productIds } },
      }),
      prisma.productDistributorPv.findMany({
        where: { distributorId: user.id, productId: { in: productIds } },
        select: { productId: true },
      }),
    ]);
    for (const rule of discountRules) distributorDiscounts.set(rule.productId, Number(rule.discountPercent));
    for (const rule of pvRules) distributorPvEligible.add(rule.productId);
  }

  const pricing = new Map<number, CartItemPricing>();
  for (const item of cart.items) {
    const product = item.product;
    const basePrice = Number(item.variant?.price ?? product.price);
    pricing.set(
      item.id,
      selectItemPricing(
        product.id,
        basePrice,
        {
          hasDiscount: product.hasDiscount,
          forCustomer: product.forCustomer,
          customerDiscountPercent: product.customerDiscountPercent != null ? Number(product.customerDiscountPercent) : null,
          forDistributor: product.forDistributor,
          hasPointValue: product.hasPointValue,
        },
        isDistributor,
        distributorDiscounts,
        distributorPvEligible
      )
    );
  }

  return pricing;
}

export interface ViewerProductPricing {
  discountPercent: number | null;
  pvEligible: boolean;
}

/**
 * Resolves, for a single viewer (or an anonymous/plain-customer visitor), the discount% and PV
 * eligibility for a batch of products — used to show a distributor "your price"/"earn X PV" line
 * on product cards and the product detail page, ahead of checkout. Only ever queries the DB for a
 * DISTRIBUTOR viewer; a customer's discount (if any) comes straight from the already-loaded product
 * flags. Never call this from a statically-cached/shared page — the result is viewer-specific.
 */
export async function resolveViewerProductPricing(
  products: (PricingProductFlags & { id: number })[],
  user: { id: number; role: string } | null
): Promise<Map<number, ViewerProductPricing>> {
  const isDistributor = user?.role === "DISTRIBUTOR";
  const result = new Map<number, ViewerProductPricing>();

  const distributorDiscounts = new Map<number, number>();
  const distributorPvEligible = new Set<number>();

  if (isDistributor && user && products.length > 0) {
    const productIds = products.map((p) => p.id);
    const [discountRules, pvRules] = await Promise.all([
      prisma.productDistributorDiscount.findMany({
        where: { distributorId: user.id, productId: { in: productIds } },
      }),
      prisma.productDistributorPv.findMany({
        where: { distributorId: user.id, productId: { in: productIds } },
        select: { productId: true },
      }),
    ]);
    for (const rule of discountRules) distributorDiscounts.set(rule.productId, Number(rule.discountPercent));
    for (const rule of pvRules) distributorPvEligible.add(rule.productId);
  }

  for (const product of products) {
    // An anonymous (logged-out) visitor is neither a customer nor a distributor account —
    // they get no personalized pricing at all, unlike an actual logged-in customer.
    result.set(
      product.id,
      user
        ? {
            discountPercent: selectDiscountPercent(product.id, product, isDistributor, distributorDiscounts),
            pvEligible: isPvEligible(product.id, product, isDistributor, distributorPvEligible),
          }
        : { discountPercent: null, pvEligible: false }
    );
  }

  return result;
}

export function computeSubtotal(cart: ValidatedCart, pricing: Map<number, CartItemPricing>): number {
  return cart.items.reduce((sum, item) => sum + pricing.get(item.id)!.unitPrice * item.quantity, 0);
}

export async function applyCoupon(subtotal: number, couponCode?: string | null) {
  let discount = 0;
  let couponId: number | null = null;

  if (couponCode) {
    const coupon = await prisma.coupon.findUnique({ where: { code: couponCode.trim().toUpperCase() } });
    if (coupon && coupon.active && (!coupon.expiresAt || coupon.expiresAt >= new Date())) {
      const minOk = !coupon.minOrderAmount || subtotal >= Number(coupon.minOrderAmount);
      if (minOk) {
        discount =
          coupon.type === "PERCENT"
            ? Math.round(subtotal * (Number(coupon.value) / 100) * 100) / 100
            : Number(coupon.value);
        discount = Math.min(discount, subtotal);
        couponId = coupon.id;
      }
    }
  }

  return { discount, couponId };
}

export interface ShippingAndTax {
  shippingFee: number;
  shippingLabel: string | null;
  tax: number;
  taxLabel: string | null;
  total: number;
}

/**
 * Resolves shipping + tax for a destination country, both computed off the
 * post-discount amount. `total` is the fully-loaded order total: subtotal -
 * discount + shipping + tax. Used identically by COD checkout, eSewa initiate,
 * and eSewa complete so the charged amount never drifts between steps.
 * `municipalityId`, when given, lets an admin-assigned municipality-specific
 * shipping rate override the country-level zone.
 */
export async function computeShippingAndTax(
  country: string,
  subtotal: number,
  discount: number,
  municipalityId?: number | null
): Promise<ShippingAndTax> {
  const taxableAmount = Math.max(0, subtotal - discount);
  const [shipping, taxRate] = await Promise.all([
    resolveShippingFee(country, taxableAmount, municipalityId),
    resolveTaxRate(country),
  ]);
  const tax = taxRate ? computeTax(taxableAmount, taxRate.percent) : 0;
  const taxLabel = taxRate ? `${taxRate.label} (${taxRate.percent}%)` : null;

  return {
    shippingFee: shipping.fee,
    shippingLabel: shipping.label,
    tax,
    taxLabel,
    total: taxableAmount + shipping.fee + tax,
  };
}

/** Creates the Order + OrderItems + initial history entry, decrements stock, and clears the cart — all in one transaction. */
export async function createOrderFromCart(params: {
  orderNumber?: string;
  userId: number;
  shipping: ShippingSnapshot;
  cart: ValidatedCart;
  pricing: Map<number, CartItemPricing>;
  subtotal: number;
  discount: number;
  shippingFee: number;
  tax: number;
  taxLabel: string | null;
  couponId: number | null;
  paymentMethod: PaymentMethod;
  paymentSubMethod: string | null;
  paymentStatus: PaymentStatus;
  paymentReference?: string | null;
  historyNote: string;
  /** Set when the city has an active dealer network and the customer picked one — see lib/dealerSelection.ts. Omitted entirely outside dealer-served cities, preserving the pre-dealer checkout flow. */
  dealer?: { id: number; name: string; phone: string | null } | null;
}) {
  const total = Math.max(0, params.subtotal - params.discount) + params.shippingFee + params.tax;
  const orderNumber = params.orderNumber ?? generateOrderNumber();
  const totalPv = params.cart.items.reduce(
    (sum, item) => sum + params.pricing.get(item.id)!.pvPerUnit * item.quantity,
    0
  );

  return prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        orderNumber,
        userId: params.userId,
        fullName: params.shipping.fullName,
        phone: params.shipping.phone,
        email: params.shipping.email,
        line1: params.shipping.line1,
        line2: params.shipping.line2,
        city: params.shipping.city,
        state: params.shipping.state,
        postalCode: params.shipping.postalCode,
        country: params.shipping.country,
        dealerId: params.dealer?.id ?? null,
        dealerName: params.dealer?.name ?? null,
        dealerPhone: params.dealer?.phone ?? null,
        subtotal: params.subtotal,
        discount: params.discount,
        shippingFee: params.shippingFee,
        tax: params.tax,
        taxLabel: params.taxLabel,
        total,
        couponId: params.couponId,
        paymentMethod: params.paymentMethod,
        paymentSubMethod: params.paymentSubMethod,
        paymentStatus: params.paymentStatus,
        paymentReference: params.paymentReference ?? null,
        status: "PROCESSING",
        totalPv,
        items: {
          create: params.cart.items.map((item) => {
            const label = variantLabel(item.variant);
            const itemPricing = params.pricing.get(item.id)!;
            return {
              productId: item.productId,
              variantId: item.variantId,
              name: label ? `${item.product.name} (${label})` : item.product.name,
              image: item.variant?.image ?? item.product.images[0]?.url ?? null,
              price: itemPricing.unitPrice,
              quantity: item.quantity,
              discountPercent: itemPricing.discountPercent,
              pvEarned: itemPricing.pvPerUnit * item.quantity,
            };
          }),
        },
        history: {
          create: { status: "PROCESSING", note: params.historyNote },
        },
      },
    });

    for (const item of params.cart.items) {
      if (item.variantId) {
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: { stockQuantity: { decrement: item.quantity } },
        });
      } else {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      // Dealer stock is a separate, per-location allocation tracked alongside the master count
      // above — decremented here with an explicit concurrency guard (unlike the master count,
      // which relies on MySQL's row lock) so two simultaneous orders can never both succeed
      // against the last unit of a dealer's stock.
      if (params.dealer) {
        const decremented = await tx.dealerInventory.updateMany({
          where: {
            dealerId: params.dealer.id,
            productId: item.productId,
            variantId: item.variantId,
            stock: { gte: item.quantity },
          },
          data: { stock: { decrement: item.quantity } },
        });
        if (decremented.count === 0) {
          throw new ApiError(409, `${item.product.name} is no longer available from the selected dealer`);
        }
      }
    }

    // Only removes the items actually purchased — if the customer checked out a subset of their
    // cart, whatever wasn't selected stays behind (see loadValidatedCart's `selectedItems`).
    await tx.cartItem.deleteMany({ where: { id: { in: params.cart.items.map((item) => item.id) } } });

    return created;
  });
}
