import Image from "next/image";
import { ProductImagePlaceholder } from "@/components/product/ProductImagePlaceholder";

export function ProductImage({
  src,
  alt,
  colorway,
  categorySlug,
  className = "",
  sizes = "(min-width: 1024px) 25vw, 50vw",
  rounded = true,
}: {
  src?: string | null;
  alt: string;
  colorway?: string;
  categorySlug?: string;
  className?: string;
  sizes?: string;
  rounded?: boolean;
}) {
  if (!src) {
    return (
      <ProductImagePlaceholder colorway={colorway} categorySlug={categorySlug} className={className} rounded={rounded} />
    );
  }

  return (
    <div className={`relative aspect-square overflow-hidden ${rounded ? "rounded-2xl" : ""} bg-gray-100 ${className}`}>
      <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" />
    </div>
  );
}
