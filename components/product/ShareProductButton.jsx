"use client";
import { Share2 } from "lucide-react";
const SITE_URL = "https://nosepinhouse.com";
export function ShareProductButton({ productName, productSlug, }) {
    async function handleShareProduct() {
        const productUrl = `${SITE_URL}/product/${productSlug}`;
        const shareText = `Check out ${productName}:\n${productUrl}`;
        try {
            if (navigator.share) {
                await navigator.share({
                    title: productName,
                    text: shareText,
                });
                return;
            }
            window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, "_blank", "noopener,noreferrer");
        }
        catch (error) {
            if (error instanceof Error && error.name === "AbortError") {
                return;
            }
            window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, "_blank", "noopener,noreferrer");
        }
    }
    return (<button type="button" onClick={handleShareProduct} aria-label="Share this product" title="Share this product" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition-colors hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700">
      <Share2 className="h-4 w-4"/>
    </button>);
}
