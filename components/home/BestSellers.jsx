"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { useEffect, useState } from "react";

export default function Bestsellers({ products }) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // Nepal is UTC+5:45 (no daylight-saving adjustment).
    const NEPAL_OFFSET_MS = (5 * 60 + 45) * 60 * 1000;

    function updateCountdown() {
      const now = Date.now();
      const nepalNow = new Date(now + NEPAL_OFFSET_MS);

      const targetNepal = new Date(nepalNow);
      targetNepal.setUTCHours(10, 0, 0, 0);

      if (nepalNow.getTime() >= targetNepal.getTime()) {
        targetNepal.setUTCDate(targetNepal.getUTCDate() + 1);
      }

      const targetTime = targetNepal.getTime() - NEPAL_OFFSET_MS;
      const remainingSeconds = Math.max(
        0,
        Math.ceil((targetTime - now) / 1000),
      );

      setTimeLeft({
        hours: Math.floor(remainingSeconds / 3600),
        minutes: Math.floor((remainingSeconds % 3600) / 60),
        seconds: remainingSeconds % 60,
      });
    }

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  const visibleProducts = products.slice(0, 5);

  return (
    <section className="w-full border-t border-[#E8DDD2] bg-[#FBF6EE] py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
          {/* Left: feature banner (desktop only) */}
          <div className="relative hidden min-h-[420px] overflow-hidden rounded-sm border border-[#E8DDD2] lg:block">
            <Image
              src="/images/hero-banner-img.jpeg"
              alt="NOSEPIN Jewellery"
              fill
              sizes="280px"
              className="object-cover transition-transform duration-500 hover:scale-105"
            />

            <div className="absolute inset-0 bg-black/30" />

            <div className="absolute inset-0 flex flex-col items-center justify-center px-5 text-center text-white">
              <span className="mb-3 text-xs font-medium tracking-[0.25em]">
                LIMITED TIME
              </span>
              <h3 className="font-serif text-3xl font-bold leading-tight">
                Bestseller
              </h3>
              <p className="mt-2 text-sm">Shop our most-loved jewellery</p>
            </div>

            {/* Countdown Timer */}
            <div className="absolute bottom-5 left-1/2 flex w-max -translate-x-1/2 items-center gap-3 rounded-sm bg-white/95 px-4 py-3 text-black shadow-lg backdrop-blur-sm">
              <div className="flex min-w-[34px] flex-col items-center">
                <span className="font-serif text-xl font-bold leading-none">
                  {String(timeLeft.hours).padStart(2, "0")}
                </span>
                <span className="mt-1 text-[9px] uppercase tracking-wider text-gray-500">
                  HRS
                </span>
              </div>

              <span className="pb-3 font-serif text-lg">:</span>

              <div className="flex min-w-[34px] flex-col items-center">
                <span className="font-serif text-xl font-bold leading-none">
                  {String(timeLeft.minutes).padStart(2, "0")}
                </span>
                <span className="mt-1 text-[9px] uppercase tracking-wider text-gray-500">
                  MIN
                </span>
              </div>

              <span className="pb-3 font-serif text-lg">:</span>

              <div className="flex min-w-[34px] flex-col items-center">
                <span className="font-serif text-xl font-bold leading-none">
                  {String(timeLeft.seconds).padStart(2, "0")}
                </span>
                <span className="mt-1 text-[9px] uppercase tracking-wider text-gray-500">
                  SEC
                </span>
              </div>
            </div>
          </div>

          {/* Right: heading + 5 products */}
          <div className="min-w-0">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div className="text-left">
                <h2 className="font-serif text-3xl italic text-[#783F35]">
                  Our Bestsellers
                </h2>
                <p className="mt-1 text-sm text-[#6F625D]">
                  NOSEPIN Customers Love These Jewellery! You Will Love Them
                  Too.
                </p>
              </div>

              <Link
                href="/jewellery"
                className="flex shrink-0 items-center gap-2 whitespace-nowrap font-serif text-sm text-[#6F625D] transition-colors hover:text-[#783F35]"
              >
                See All Products
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {visibleProducts.map((product) => (
                <div key={product.id} className="text-left">
                  <ProductCard
                    product={product}
                    className="h-full border border-[#E8DDD2] bg-white transition-all duration-300 hover:border-[#BA8B30] hover:shadow-md"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}