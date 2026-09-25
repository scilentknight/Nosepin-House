"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ProductImagePlaceholder } from "@/components/product/ProductImagePlaceholder";

interface GalleryImage {
  url: string | null;
  alt: string;
}

export function ProductGallery({
  images,
  productName,
  colorway,
  categorySlug,
}: {
  images: GalleryImage[];
  productName: string;
  colorway?: string;
  categorySlug?: string;
}) {
  const validImages = images.filter((img): img is { url: string; alt: string } => Boolean(img.url));
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZooming, setIsZooming] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const thumbStripRef = useRef<HTMLDivElement>(null);

  if (validImages.length === 0) {
    return <ProductImagePlaceholder colorway={colorway} categorySlug={categorySlug} className="max-w-md shadow-soft" />;
  }

  const active = validImages[Math.min(activeIndex, validImages.length - 1)];

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  }

  function scrollThumbs(direction: 1 | -1) {
    thumbStripRef.current?.scrollBy({ left: direction * 140, behavior: "smooth" });
  }

  return (
    <div className="max-w-md">
      <div className="relative">
        <div
          className="relative aspect-square cursor-zoom-in overflow-hidden rounded-2xl bg-gray-100 shadow-soft"
          onMouseEnter={() => setIsZooming(true)}
          onMouseLeave={() => setIsZooming(false)}
          onMouseMove={handleMouseMove}
        >
          <Image
            src={active.url}
            alt={active.alt || productName}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
            priority
          />
        </div>

        {/* Daraz-style magnifier: a same-size panel showing a 2x-zoomed crop that tracks the cursor. */}
        {isZooming && (
          <div
            aria-hidden
            className="absolute left-full top-0 z-20 ml-4 hidden aspect-square w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-soft-lg lg:block"
            style={{
              backgroundImage: `url(${active.url})`,
              backgroundSize: "200%",
              backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
              backgroundRepeat: "no-repeat",
            }}
          />
        )}
      </div>

      {validImages.length > 1 && (
        <div className="mt-4 flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollThumbs(-1)}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition-colors hover:bg-gray-50"
            aria-label="Scroll thumbnails left"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          <div ref={thumbStripRef} className="flex flex-1 gap-2 overflow-x-auto scroll-smooth scrollbar-none">
            {validImages.map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveIndex(i)}
                onMouseEnter={() => setActiveIndex(i)}
                className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                  i === activeIndex ? "border-primary-500" : "border-transparent hover:border-gray-300"
                }`}
                aria-label={`View photo ${i + 1}`}
                aria-current={i === activeIndex}
              >
                <Image src={img.url} alt={img.alt || `${productName} photo ${i + 1}`} fill sizes="64px" className="object-cover" />
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => scrollThumbs(1)}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition-colors hover:bg-gray-50"
            aria-label="Scroll thumbnails right"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
