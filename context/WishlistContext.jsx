"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, } from "react";
import { useSession } from "next-auth/react";
const WishlistContext = createContext(null);
function sameLine(a, productId, variantId) {
    return a.productId === productId && a.variantId === variantId;
}
async function fetchServerWishlist() {
    const res = await fetch("/api/wishlist");
    if (!res.ok)
        return [];
    const json = await res.json();
    return json.data ?? [];
}
export function WishlistProvider({ children }) {
    const { status } = useSession();
    const [lines, setLines] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        let cancelled = false;
        async function load() {
            setIsLoading(true);
            if (status === "authenticated") {
                const serverLines = await fetchServerWishlist();
                if (!cancelled)
                    setLines(serverLines);
            }
            else if (status === "unauthenticated") {
                if (!cancelled)
                    setLines([]);
            }
            if (!cancelled)
                setIsLoading(false);
        }
        if (status !== "loading")
            load();
        return () => {
            cancelled = true;
        };
    }, [status]);
    const addItem = useCallback(async (productId, variantId = null) => {
        if (status !== "authenticated")
            throw new Error("Please log in to save items to your wishlist");
        const res = await fetch("/api/wishlist", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId, variantId }),
        });
        const json = await res.json().catch(() => null);
        if (!res.ok)
            throw new Error(json?.message ?? "Could not add this item to your wishlist");
        setLines(json.data ?? []);
    }, [status]);
    const removeItem = useCallback(async (productId, variantId = null) => {
        if (status !== "authenticated")
            return;
        const params = new URLSearchParams({ productId: String(productId) });
        if (variantId !== null)
            params.set("variantId", String(variantId));
        const res = await fetch(`/api/wishlist?${params.toString()}`, { method: "DELETE" });
        const json = await res.json().catch(() => null);
        if (!res.ok)
            throw new Error(json?.message ?? "Could not remove this item");
        setLines(json.data ?? []);
    }, [status]);
    const toggleItem = useCallback(async (productId, variantId = null) => {
        if (lines.some((l) => sameLine(l, productId, variantId))) {
            await removeItem(productId, variantId);
        }
        else {
            await addItem(productId, variantId);
        }
    }, [lines, addItem, removeItem]);
    const clear = useCallback(async () => {
        if (status === "authenticated") {
            await fetch("/api/wishlist", { method: "DELETE" });
        }
        setLines([]);
    }, [status]);
    const isWishlisted = useCallback((productId, variantId = null) => lines.some((l) => sameLine(l, productId, variantId)), [lines]);
    const totalCount = useMemo(() => lines.length, [lines]);
    const value = {
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
    if (!ctx)
        throw new Error("useWishlist must be used within a WishlistProvider");
    return ctx;
}
