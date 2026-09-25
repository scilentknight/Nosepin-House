"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Heart } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";

export function WishlistButton({
  productId,
  variantId = null,
  size = "sm",
  className = "",
}: {
  productId: number;
  variantId?: number | null;
  size?: "sm" | "lg";
  className?: string;
}) {
  const { status } = useSession();
  const { isWishlisted, toggleItem } = useWishlist();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, setIsPending] = useState(false);
  const active = isWishlisted(productId, variantId);

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (isPending) return;

    if (status !== "authenticated") {
      router.push(`/login?callbackUrl=${encodeURIComponent(pathname ?? "/")}`);
      return;
    }

    setIsPending(true);
    try {
      await toggleItem(productId, variantId);
    } catch {
      // Silently ignore — the button state simply won't flip.
    } finally {
      setIsPending(false);
    }
  }

  const dimensions = size === "lg" ? "h-11 w-11" : "h-8 w-8";
  const iconSize = size === "lg" ? "h-5 w-5" : "h-4 w-4";

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      aria-pressed={active}
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      className={`flex shrink-0 items-center justify-center rounded-full bg-white/95 text-gray-500 shadow-sm backdrop-blur transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-70 ${dimensions} ${
        active ? "text-secondary-500" : ""
      } ${className}`}
    >
      <Heart className={iconSize} strokeWidth={1.8} fill={active ? "currentColor" : "none"} />
    </button>
  );
}
