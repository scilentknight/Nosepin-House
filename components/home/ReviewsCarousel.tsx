"use client";

import { useRef, useState } from "react";

export interface Review {
  name: string;
  photo: string | null;
  profileUrl: string | null;
  when: string;
  rating: number;
  text: string;
}

const PAGE_SIZE = 20;

function Stars({ value, size = 18 }: { value: number; size?: number }) {
  return (
    <span
      className="inline-flex gap-0.5"
      aria-label={`${value.toFixed(1)} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <svg
          key={n}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill={n <= Math.round(value) ? "#fbbc04" : "#dadce0"}
        >
          <path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1L12 2z" />
        </svg>
      ))}
    </span>
  );
}

function GoogleG({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-label="Google">
      <path
        fill="#4285F4"
        d="M45.1 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h11.8c-.5 2.7-2.1 5-4.4 6.6v5.5h7.1c4.2-3.8 6.6-9.5 6.6-16.1z"
      />
      <path
        fill="#34A853"
        d="M24 46c5.9 0 10.9-2 14.5-5.3l-7.1-5.5c-2 1.3-4.5 2.1-7.4 2.1-5.7 0-10.5-3.8-12.2-9H4.5v5.7C8.1 41.1 15.5 46 24 46z"
      />
      <path
        fill="#FBBC05"
        d="M11.8 28.3c-.4-1.3-.7-2.7-.7-4.3s.3-2.9.7-4.3v-5.7H4.5C3 17 2 20.4 2 24s1 7 2.5 10l7.3-5.7z"
      />
      <path
        fill="#EA4335"
        d="M24 10.7c3.2 0 6.1 1.1 8.4 3.3l6.3-6.3C34.9 4.1 29.9 2 24 2 15.5 2 8.1 6.9 4.5 14l7.3 5.7c1.7-5.2 6.5-9 12.2-9z"
      />
    </svg>
  );
}

function Verified() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      aria-label="Verified review"
    >
      <circle cx="12" cy="12" r="11" fill="#4285F4" />
      <path
        d="M7 12.5l3.2 3.2L17 9"
        fill="none"
        stroke="#fff"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const label = (r: number) =>
  r >= 4.5 ? "EXCELLENT" : r >= 4 ? "GREAT" : r >= 3 ? "GOOD" : "REVIEWS";

export function ReviewsCarousel({
  rating,
  count,
  url,
  reviews,
}: {
  rating: number;
  count: number;
  url: string;
  reviews: Review[];
}) {
  const track = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(PAGE_SIZE);
  const shown = reviews.slice(0, visible);
  const remaining = reviews.length - shown.length;

  const scroll = (dir: 1 | -1) => {
    const el = track.current;
    if (el)
      el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  };

  const loadMore = () => {
    setVisible((v) => v + PAGE_SIZE);
    setTimeout(() => scroll(1), 60);
  };

  return (
    <section
      className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"
      aria-label="Google reviews"
    >
      <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-center">
        {/* Summary */}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full shrink-0 flex-col items-center text-center lg:w-56"
        >
          <p className="text-2xl font-bold tracking-tight text-gray-900">
            {label(rating)}
          </p>
          <div className="mt-2">
            <Stars value={rating} size={28} />
          </div>
          <p className="mt-2 text-sm text-gray-700">
            Based on{" "}
            <b className="text-gray-900">{count.toLocaleString()} reviews</b>
          </p>
          <p
            className="mt-1 text-4xl font-medium tracking-tight"
            aria-label="Google"
          >
            <span className="text-[#4285F4]">G</span>
            <span className="text-[#EA4335]">o</span>
            <span className="text-[#FBBC05]">o</span>
            <span className="text-[#4285F4]">g</span>
            <span className="text-[#34A853]">l</span>
            <span className="text-[#EA4335]">e</span>
          </p>
          <p className="mt-1 text-xs text-gray-500">
            {rating.toFixed(1)} rating on Google
          </p>
        </a>

        {/* Scrolling cards */}
        {reviews.length > 0 && (
          <div className="relative min-w-0 flex-1">
            <div
              ref={track}
              className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {shown.map((r, i) => (
                <article
                  key={i}
                  className="w-[85%] shrink-0 snap-start rounded-2xl bg-gray-100 p-5 sm:w-[46%] lg:w-[31.5%]"
                >
                  <header className="flex items-center gap-3">
                    {r.photo ? (
                      <img
                        src={r.photo}
                        alt=""
                        referrerPolicy="no-referrer"
                        className="h-11 w-11 rounded-full object-cover"
                      />
                    ) : (
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-700 font-semibold text-white">
                        {r.name[0]}
                      </span>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-gray-900">
                        {r.name}
                      </p>
                      <p className="text-sm text-gray-500">{r.when}</p>
                    </div>
                    <GoogleG />
                  </header>
                  <div className="mt-3 flex items-center gap-2">
                    <Stars value={r.rating} />
                    <Verified />
                  </div>
                  <p className="mt-3 line-clamp-4 text-[15px] leading-relaxed text-gray-800">
                    {r.text}
                  </p>
                </article>
              ))}

              {/* Last card: load the next 20 */}
              {remaining > 0 && (
                <div className="flex w-[85%] shrink-0 snap-start flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-gray-300 p-5 text-center sm:w-[46%] lg:w-[31.5%]">
                  <p className="text-sm text-gray-600" aria-live="polite">
                    Showing {shown.length.toLocaleString()} of{" "}
                    {reviews.length.toLocaleString()}
                  </p>
                  <button
                    onClick={loadMore}
                    className="rounded-full bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
                  >
                    Load {Math.min(PAGE_SIZE, remaining)} more
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => scroll(1)}
              aria-label="Next reviews"
              className="absolute -right-2 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-black/5 hover:bg-gray-50 lg:flex"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#111"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <button
              onClick={() => scroll(-1)}
              aria-label="Previous reviews"
              className="absolute -left-2 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-black/5 hover:bg-gray-50 lg:flex"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#111"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 5l-7 7 7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
