import Image from "next/image";
import { ProductImagePlaceholder } from "@/components/product/ProductImagePlaceholder";
export function ProductImage({ src, alt, colorway, categorySlug, className = "", sizes = "(min-width: 1024px) 25vw, 50vw", rounded = true, }) {
    if (!src) {
        return (<ProductImagePlaceholder colorway={colorway} categorySlug={categorySlug} className={className} rounded={rounded}/>);
    }
    return (<div className={`relative aspect-square overflow-hidden ${rounded ? "rounded-2xl" : ""} bg-gray-100 ${className}`}>
      <Image src={src} alt={alt} fill sizes={sizes} unoptimized={src.includes("/uploads/")} className="object-cover"/>
    </div>);
}
