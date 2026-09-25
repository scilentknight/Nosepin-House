"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useSession } from "next-auth/react";

export interface CartLine {
  productId: string;
  variantId: number | null;
  variantLabel: string | null;
  name: string;
  slug: string;
  price: number;
  image: string | null;
  colorway: string;
  stock: number;
  quantity: number;
}

interface GuestLine {
  productId: string;
  variantId: number | null;
  quantity: number;
}

export interface SelectedItem {
  productId: string;
  variantId: number | null;
}

interface CartContextValue {
  lines: CartLine[];
  isLoading: boolean;
  subtotal: number;
  totalCount: number;
  addItem: (productId: string, quantity?: number, variantId?: number | null) => Promise<void>;
  updateQuantity: (productId: string, quantity: number, variantId?: number | null) => Promise<void>;
  removeItem: (productId: string, variantId?: number | null) => Promise<void>;
  clear: () => Promise<void>;
  /** Re-fetches the cart from the server without clearing it — used after a checkout that only
   * purchased some of the cart's items, so whatever wasn't bought stays in the cart. */
  refresh: () => Promise<void>;
  /** Which lines are checked for purchase on the Cart page. Defaults to "everything" so behavior
   * matches a plain full-cart checkout unless the customer deliberately unchecks something. */
  isSelected: (productId: string, variantId: number | null) => boolean;
  toggleSelected: (productId: string, variantId: number | null) => void;
  selectAll: () => void;
  clearSelection: () => void;
  selectedLines: CartLine[];
  selectedSubtotal: number;
  selectedCount: number;
}

const CartContext = createContext<CartContextValue | null>(null);

const GUEST_CART_KEY = "bikesh-guest-cart";
const SELECTION_KEY = "bikesh-cart-selection";

function sameLine(a: { productId: string; variantId: number | null }, productId: string, variantId: number | null) {
  return a.productId === productId && a.variantId === variantId;
}

function lineKey(productId: string, variantId: number | null) {
  return `${productId}:${variantId ?? "base"}`;
}

function readSelection(): Set<string> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(SELECTION_KEY);
    if (!raw) return null;
    return new Set(JSON.parse(raw) as string[]);
  } catch {
    return null;
  }
}

function writeSelection(keys: Set<string>) {
  window.sessionStorage.setItem(SELECTION_KEY, JSON.stringify([...keys]));
}

function readGuestCart(): GuestLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(GUEST_CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as (GuestLine & { variantId?: number | null })[];
    // Older guest carts saved before variant support don't have variantId — treat as null.
    return parsed.map((l) => ({ ...l, variantId: l.variantId ?? null }));
  } catch {
    return [];
  }
}

function writeGuestCart(lines: GuestLine[]) {
  window.localStorage.setItem(GUEST_CART_KEY, JSON.stringify(lines));
}

async function hydrateGuestLines(guestLines: GuestLine[]): Promise<CartLine[]> {
  if (guestLines.length === 0) return [];
  const ids = guestLines.map((l) => l.productId).join(",");
  const res = await fetch(`/api/products?ids=${encodeURIComponent(ids)}`);
  if (!res.ok) return [];
  const json = await res.json();
  const products: {
    id: string;
    name: string;
    slug: string;
    price: number;
    image: string | null;
    colorway: string;
    stock: number;
    variants: { id: number; price: number | null; stock: number; image: string | null; label: string | null }[];
  }[] = json.data ?? [];

  return guestLines
    .map((gl) => {
      const product = products.find((p) => p.id === gl.productId);
      if (!product) return null;
      const variant = gl.variantId ? product.variants.find((v) => v.id === gl.variantId) : undefined;
      if (gl.variantId && !variant) return null;
      return {
        productId: product.id,
        variantId: gl.variantId,
        variantLabel: variant?.label ?? null,
        name: product.name,
        slug: product.slug,
        price: variant?.price ?? product.price,
        image: variant?.image ?? product.image,
        colorway: product.colorway,
        stock: variant?.stock ?? product.stock,
        quantity: gl.quantity,
      };
    })
    .filter((l): l is CartLine => l !== null);
}

async function fetchServerCart(): Promise<CartLine[]> {
  const res = await fetch("/api/cart");
  if (!res.ok) return [];
  const json = await res.json();
  return json.data ?? [];
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // null = "not yet initialized from storage" (SSR, or no prior selection saved) — until then
  // every line counts as selected, so a fresh page load behaves like a plain full-cart checkout
  // unless the customer unchecks something. Lazy-initialized from sessionStorage on mount.
  const [selectedKeys, setSelectedKeys] = useState<Set<string> | null>(() => readSelection());

  // Newly added lines default to selected; lines that leave the cart drop out of the selection too.
  useEffect(() => {
    if (selectedKeys === null) return;
    const currentKeys = new Set(lines.map((l) => lineKey(l.productId, l.variantId)));
    let changed = false;
    const next = new Set<string>();
    for (const key of selectedKeys) {
      if (currentKeys.has(key)) next.add(key);
      else changed = true;
    }
    for (const key of currentKeys) {
      if (!selectedKeys.has(key)) {
        next.add(key);
        changed = true;
      }
    }
    if (changed) {
      setSelectedKeys(next);
      writeSelection(next);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lines]);

  /** Loads (or re-loads) the cart from its source of truth for the current session. Merges any
   * pending guest-cart items on first authenticated load; a no-op merge afterward since the guest
   * cart is cleared once merged. Used for both the initial mount and post-checkout `refresh()`. */
  const load = useCallback(async () => {
    if (status === "loading") return;
    setIsLoading(true);

    if (status === "authenticated") {
      const guestLines = readGuestCart();
      if (guestLines.length > 0) {
        await fetch("/api/cart/merge", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: guestLines }),
        });
        writeGuestCart([]);
      }
      setLines(await fetchServerCart());
    } else if (status === "unauthenticated") {
      setLines(await hydrateGuestLines(readGuestCart()));
    }

    setIsLoading(false);
  }, [status]);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const addItem = useCallback(
    async (productId: string, quantity = 1, variantId: number | null = null) => {
      if (status === "authenticated") {
        const res = await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId, quantity, variantId }),
        });
        const json = await res.json().catch(() => null);
        if (!res.ok) throw new Error(json?.message ?? "Could not add this item to your cart");
        setLines(json.data ?? []);
        return;
      }

      const guestLines = readGuestCart();
      const existing = guestLines.find((l) => sameLine(l, productId, variantId));
      const nextGuestLines = existing
        ? guestLines.map((l) => (sameLine(l, productId, variantId) ? { ...l, quantity: l.quantity + quantity } : l))
        : [...guestLines, { productId, variantId, quantity }];
      const hydrated = await hydrateGuestLines(nextGuestLines);
      const hydratedLine = hydrated.find((l) => sameLine(l, productId, variantId));
      if (!hydratedLine) {
        throw new Error("This product is no longer available");
      }
      if (hydratedLine.quantity > hydratedLine.stock) {
        throw new Error(`Only ${hydratedLine.stock} left in stock`);
      }
      writeGuestCart(nextGuestLines);
      setLines(hydrated);
    },
    [status]
  );

  const removeItem = useCallback(
    async (productId: string, variantId: number | null = null) => {
      if (status === "authenticated") {
        const params = new URLSearchParams({ productId });
        if (variantId !== null) params.set("variantId", String(variantId));
        const res = await fetch(`/api/cart?${params.toString()}`, { method: "DELETE" });
        const json = await res.json().catch(() => null);
        if (!res.ok) throw new Error(json?.message ?? "Could not remove this item");
        setLines(json.data ?? []);
        return;
      }

      const guestLines = readGuestCart().filter((l) => !sameLine(l, productId, variantId));
      writeGuestCart(guestLines);
      setLines(await hydrateGuestLines(guestLines));
    },
    [status]
  );

  const updateQuantity = useCallback(
    async (productId: string, quantity: number, variantId: number | null = null) => {
      if (quantity <= 0) {
        await removeItem(productId, variantId);
        return;
      }

      if (status === "authenticated") {
        const res = await fetch("/api/cart", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId, quantity, variantId }),
        });
        const json = await res.json().catch(() => null);
        if (!res.ok) throw new Error(json?.message ?? "Could not update quantity");
        setLines(json.data ?? []);
        return;
      }

      const guestLines = readGuestCart().map((l) => (sameLine(l, productId, variantId) ? { ...l, quantity } : l));
      const hydrated = await hydrateGuestLines(guestLines);
      const hydratedLine = hydrated.find((l) => sameLine(l, productId, variantId));
      if (hydratedLine && hydratedLine.quantity > hydratedLine.stock) {
        throw new Error(`Only ${hydratedLine.stock} left in stock`);
      }
      writeGuestCart(guestLines);
      setLines(hydrated);
    },
    [status, removeItem]
  );

  const clear = useCallback(async () => {
    if (status === "authenticated") {
      await fetch("/api/cart", { method: "DELETE" });
    } else {
      writeGuestCart([]);
    }
    setLines([]);
  }, [status]);

  const isSelected = useCallback(
    (productId: string, variantId: number | null) => {
      // Before storage has loaded, or once every current line is checked, everything counts as selected.
      if (selectedKeys === null) return true;
      return selectedKeys.has(lineKey(productId, variantId));
    },
    [selectedKeys]
  );

  const toggleSelected = useCallback(
    (productId: string, variantId: number | null) => {
      const key = lineKey(productId, variantId);
      const base = selectedKeys ?? new Set(lines.map((l) => lineKey(l.productId, l.variantId)));
      const next = new Set(base);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      setSelectedKeys(next);
      writeSelection(next);
    },
    [selectedKeys, lines]
  );

  const selectAll = useCallback(() => {
    const next = new Set(lines.map((l) => lineKey(l.productId, l.variantId)));
    setSelectedKeys(next);
    writeSelection(next);
  }, [lines]);

  const clearSelection = useCallback(() => {
    const next = new Set<string>();
    setSelectedKeys(next);
    writeSelection(next);
  }, []);

  const selectedLines = useMemo(
    () => (selectedKeys === null ? lines : lines.filter((l) => selectedKeys.has(lineKey(l.productId, l.variantId)))),
    [lines, selectedKeys]
  );

  const subtotal = useMemo(
    () => lines.reduce((sum, l) => sum + l.price * l.quantity, 0),
    [lines]
  );
  const totalCount = useMemo(
    () => lines.reduce((sum, l) => sum + l.quantity, 0),
    [lines]
  );
  const selectedSubtotal = useMemo(
    () => selectedLines.reduce((sum, l) => sum + l.price * l.quantity, 0),
    [selectedLines]
  );
  const selectedCount = useMemo(
    () => selectedLines.reduce((sum, l) => sum + l.quantity, 0),
    [selectedLines]
  );

  const value: CartContextValue = {
    lines,
    isLoading,
    subtotal,
    totalCount,
    addItem,
    updateQuantity,
    removeItem,
    clear,
    refresh: load,
    isSelected,
    toggleSelected,
    selectAll,
    clearSelection,
    selectedLines,
    selectedSubtotal,
    selectedCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
