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

export interface WishlistLine {
  productId: number;
  variantId: number | null;
  variantLabel: string | null;
  name: string;
  slug: string;
  price: number;
  image: string | null;
  colorway: string;
  stock: number;
}

interface WishlistContextValue {
  lines: WishlistLine[];
  isLoading: boolean;
  totalCount: number;
  isWishlisted: (productId: number, variantId?: number | null) => boolean;
  addItem: (productId: number, variantId?: number | null) => Promise<void>;
  removeItem: (productId: number, variantId?: number | null) => Promise<void>;
  toggleItem: (productId: number, variantId?: number | null) => Promise<void>;
  clear: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

function sameLine(a: { productId: number; variantId: number | null }, productId: number, variantId: number | null) {
  return a.productId === productId && a.variantId === variantId;
}

async function fetchServerWishlist(): Promise<WishlistLine[]> {
  const res = await fetch("/api/wishlist");
  if (!res.ok) return [];
  const json = await res.json();
  return json.data ?? [];
}

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const [lines, setLines] = useState<WishlistLine[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);

      if (status === "authenticated") {
        const serverLines = await fetchServerWishlist();
        if (!cancelled) setLines(serverLines);
      } else if (status === "unauthenticated") {
        if (!cancelled) setLines([]);
      }

      if (!cancelled) setIsLoading(false);
    }

    if (status !== "loading") load();

    return () => {
      cancelled = true;
    };
  }, [status]);

  const addItem = useCallback(
    async (productId: number, variantId: number | null = null) => {
      if (status !== "authenticated") throw new Error("Please log in to save items to your wishlist");
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, variantId }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error(json?.message ?? "Could not add this item to your wishlist");
      setLines(json.data ?? []);
    },
    [status]
  );

  const removeItem = useCallback(
    async (productId: number, variantId: number | null = null) => {
      if (status !== "authenticated") return;
      const params = new URLSearchParams({ productId: String(productId) });
      if (variantId !== null) params.set("variantId", String(variantId));
      const res = await fetch(`/api/wishlist?${params.toString()}`, { method: "DELETE" });
      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error(json?.message ?? "Could not remove this item");
      setLines(json.data ?? []);
    },
    [status]
  );

  const toggleItem = useCallback(
    async (productId: number, variantId: number | null = null) => {
      if (lines.some((l) => sameLine(l, productId, variantId))) {
        await removeItem(productId, variantId);
      } else {
        await addItem(productId, variantId);
      }
    },
    [lines, addItem, removeItem]
  );

  const clear = useCallback(async () => {
    if (status === "authenticated") {
      await fetch("/api/wishlist", { method: "DELETE" });
    }
    setLines([]);
  }, [status]);

  const isWishlisted = useCallback(
    (productId: number, variantId: number | null = null) => lines.some((l) => sameLine(l, productId, variantId)),
    [lines]
  );

  const totalCount = useMemo(() => lines.length, [lines]);

  const value: WishlistContextValue = {
    lines,
    isLoading,
    totalCount,
    isWishlisted,
    addItem,
    removeItem,
    toggleItem,
    clear,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within a WishlistProvider");
  return ctx;
}
