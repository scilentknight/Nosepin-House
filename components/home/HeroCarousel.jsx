"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

const AUTO_ADVANCE_MS = 6000;

function SlideMedia({ slide, priority }) {
  return (
    <Image
      src={slide.image}
      alt={slide.title || "NOSEPIN jewellery"}
      fill
      priority={priority}
      sizes="100vw"
      className="object-cover"
    />
  );
}

export function HeroCarousel({ slides }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (slides.length === 0) return null;

  function goTo(i) {
    setIndex(((i % slides.length) + slides.length) % slides.length);
  }

  const current = slides[index];
  const href = current.linkUrl || "/jewellery";

  return (
    <section className="relative isolate h-[58vh] min-h-[380px] overflow-hidden sm:h-[68vh] sm:min-h-[460px] lg:h-[78vh] lg:min-h-[520px]">
      <div
        className="flex h-full w-full transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {slides.map((slide, i) => (
          <div key={slide.id} className="relative h-full w-full shrink-0 grow-0 basis-full">
            <SlideMedia slide={slide} priority={i === 0} />
          </div>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#24120f]/80 via-[#24120f]/25 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 z-10 mx-auto max-w-7xl px-4 pb-14 sm:px-6 sm:pb-16 lg:px-8 lg:pb-20">
        <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#e7d49a]">
          NOSEPIN HOUSE · Kathmandu
        </p>
        <h1 className="mt-3 max-w-xl font-serif text-3xl leading-tight text-white sm:text-5xl">
          {current.title || "Jewellery made to be worn"}
        </h1>
        {current.subtitle && (
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/80 sm:text-base">
            {current.subtitle}
          </p>
        )}
        <Link
          href={href}
          className="pointer-events-auto mt-6 inline-block border border-[#e7d49a] bg-transparent px-6 py-2.5 text-xs font-medium uppercase tracking-[0.2em] text-white transition-colors hover:bg-[#e7d49a] hover:text-[#24120f]"
        >
          {current.buttonText || "See the pieces"}
        </Link>
      </div>

      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            aria-label="Previous slide"
            className="absolute left-3 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center border border-white/30 text-white sm:flex"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.6}>
              <path d="M15 6l-6 6 6 6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            aria-label="Next slide"
            className="absolute right-3 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center border border-white/30 text-white sm:flex"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.6}>
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
          <div className="absolute right-4 top-4 z-10 flex gap-1.5 sm:right-8 sm:top-6">
            {slides.map((slide, i) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-px transition-all ${i === index ? "w-8 bg-[#e7d49a]" : "w-4 bg-white/40"}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
