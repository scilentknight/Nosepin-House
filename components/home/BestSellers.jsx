"use client";

import Image from "next/image";
import { ProductCard } from "@/components/product/ProductCard";
import { useEffect, useState } from "react";

export default function Bestsellers({ products }) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 33,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev;

        if (seconds > 0) {
          seconds--;
        } else {
          seconds = 59;

          if (minutes > 0) {
            minutes--;
          } else {
            minutes = 59;

            if (hours > 0) {
              hours--;
            }
          }
        }

        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="w-full border-t border-[#E8DDD2] bg-[#FBF6EE] py-16">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="mb-2 font-serif text-3xl italic text-[#783F35]">
          Our Bestsellers
        </h2>

        <p className="mb-10 text-[#6F625D]">
          NOSEPIN Customers Love These Jewellery! You Will Love Them Too.
        </p>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Main feature image */}
          <div className="relative hidden h-[500px] overflow-hidden rounded-sm border border-[#E8DDD2] lg:col-span-1 lg:block">
            <Image
              src="/images/hero-banner-img.jpeg"
              alt="NOSEPIN Jewellery"
              fill
              sizes="25vw"
              className="object-cover transition-transform duration-500 hover:scale-105"
            />

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/30" />

            {/* Banner Content */}
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
              {/* Hours */}
              <div className="flex min-w-[34px] flex-col items-center">
                <span className="font-serif text-xl font-bold leading-none">
                  {String(timeLeft.hours).padStart(2, "0")}
                </span>
                <span className="mt-1 text-[9px] uppercase tracking-wider text-gray-500">
                  HRS
                </span>
              </div>

              <span className="pb-3 font-serif text-lg">:</span>

              {/* Minutes */}
              <div className="flex min-w-[34px] flex-col items-center">
                <span className="font-serif text-xl font-bold leading-none">
                  {String(timeLeft.minutes).padStart(2, "0")}
                </span>
                <span className="mt-1 text-[9px] uppercase tracking-wider text-gray-500">
                  MIN
                </span>
              </div>

              <span className="pb-3 font-serif text-lg">:</span>

              {/* Seconds */}
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

          {/* Products */}
          {products.map((product) => (
            <div key={product.id} className="text-left">
              <ProductCard
                product={product}
                className="border border-[#E8DDD2] bg-white transition-all duration-300 hover:border-[#BA8B30] hover:shadow-md"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
