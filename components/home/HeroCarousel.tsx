"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export interface HeroSlide {
  id: number;
  title: string;
  subtitle: string | null;
  image: string;
  linkUrl: string | null;
  buttonText: string | null;
}

interface HeroCarouselProps {
  slides: HeroSlide[];
}

const AUTO_ADVANCE_MS = 5000;

function Slide({ slide, priority }: { slide: HeroSlide; priority: boolean }) {
  const image = (
    <Image
      src={slide.image}
      alt={slide.title}
      fill
      priority={priority}
      sizes="100vw"
      className="object-cover"
    />
  );

  if (slide.linkUrl) {
    return (
      <Link href={slide.linkUrl} className="absolute inset-0 block">
        {image}
      </Link>
    );
  }

  return image;
}

export function HeroCarousel({ slides }: HeroCarouselProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;

    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, AUTO_ADVANCE_MS);

    return () => clearInterval(timer);
  }, [slides.length]);

  if (slides.length === 0) return null;

  if (slides.length === 1) {
    return (
      <section className="relative isolate h-56 overflow-hidden rounded-lg sm:h-68 md:h-72 lg:h-[380px] xl:h-[430px]">
        <Slide slide={slides[0]} priority />
      </section>
    );
  }

  function goTo(i: number) {
    setIndex(((i % slides.length) + slides.length) % slides.length);
  }

  return (
    <section className="relative isolate h-56 overflow-hidden rounded-lg sm:h-68 md:h-72 lg:h-[380px] xl:h-[430px]">
      {/* Slides track */}
      <div
        className="flex h-full w-full transition-transform duration-700 ease-in-out"
        style={{
          transform: `translateX(-${index * 100}%)`,
        }}
      >
        {slides.map((slide, i) => (
          <div
            key={slide.id}
            className="relative h-full w-full shrink-0 grow-0 basis-full"
          >
            <Slide slide={slide} priority={i === 0} />
          </div>
        ))}
      </div>

      {/* Previous button */}
      <button
        type="button"
        onClick={() => goTo(index - 1)}
        aria-label="Previous slide"
        className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur transition-colors hover:bg-white/30"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path d="M15 6l-6 6 6 6" />
        </svg>
      </button>

      {/* Next button */}
      <button
        type="button"
        onClick={() => goTo(index + 1)}
        aria-label="Next slide"
        className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur transition-colors hover:bg-white/30"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path d="M9 6l6 6-6 6" />
        </svg>
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {slides.map((slide, i) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === index ? "w-6 bg-white" : "w-2 bg-white/50 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
