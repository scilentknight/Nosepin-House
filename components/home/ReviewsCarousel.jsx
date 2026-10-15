"use client";
import { useRef, useState } from "react";

const PAGE_SIZE = 20;

function Stars({ value, size = 14 }) {
  return (
    <span className="inline-flex gap-0.5" aria-label={`${value.toFixed(1)} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <svg
          key={n}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill={n <= Math.round(value) ? "#ba8b30" : "none"}
          stroke={n <= Math.round(value) ? "#ba8b30" : "#d5bbb3"}
          strokeWidth="1.5"
        >
          <path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1L12 2z" />
        </svg>
      ))}
    </span>
  );
}

export function ReviewsCarousel({ rating, count, url, reviews }) {
  const track = useRef(null);
  const [visible, setVisible] = useState(PAGE_SIZE);
  const shown = reviews.slice(0, visible);
  const remaining = reviews.length - shown.length;

  const scroll = (dir) => {
    const el = track.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  };

  const loadMore = () => {
    setVisible((v) => v + PAGE_SIZE);
    setTimeout(() => scroll(1), 60);
  };

  return (
    <section className="bg-[#fbf6ee] py-14 sm:py-20" aria-label="Google reviews">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#937902]">
              What they said
            </p>
            <h2 className="mt-2 font-serif text-3xl text-[#381c19] sm:text-4xl">
              {rating.toFixed(1)} on Google
            </h2>
            <p className="mt-2 text-sm text-[#6f625d]">
              {count.toLocaleString()} reviews from people who bought the piece, not just browsed it.
            </p>
          </div>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium uppercase tracking-[0.18em] text-[#783f35] underline-offset-4 hover:underline"
          >
            Read on Google
          </a>
        </div>

        {reviews.length > 0 && (
          <div className="relative">
            <div
              ref={track}
              className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {shown.map((r, i) => (
                <article
                  key={i}
                  className="w-[85%] shrink-0 snap-start border border-[#e8ddd2] bg-white p-5 sm:w-[46%] lg:w-[31.5%]"
                >
                  <header className="flex items-baseline justify-between gap-3">
                    <p className="truncate font-serif text-lg text-[#381c19]">{r.name}</p>
                    <p className="shrink-0 text-[11px] uppercase tracking-wide text-[#6f625d]">
                      {r.when}
                    </p>
                  </header>
                  <div className="mt-2">
                    <Stars value={r.rating} />
                  </div>
                  <p className="mt-4 line-clamp-5 text-sm leading-relaxed text-[#4f403b]">
                    {r.text}
                  </p>
                </article>
              ))}

              {remaining > 0 && (
                <div className="flex w-[85%] shrink-0 snap-start flex-col items-center justify-center gap-3 border border-dashed border-[#d5bbb3] p-5 text-center sm:w-[46%] lg:w-[31.5%]">
                  <p className="text-sm text-[#6f625d]">
                    Showing {shown.length.toLocaleString()} of {reviews.length.toLocaleString()}
                  </p>
                  <button
                    onClick={loadMore}
                    className="border border-[#783f35] px-5 py-2 text-xs font-medium uppercase tracking-wider text-[#783f35] hover:bg-[#783f35] hover:text-white"
                  >
                    Load {Math.min(PAGE_SIZE, remaining)} more
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => scroll(1)}
              aria-label="Next reviews"
              className="absolute -right-2 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center border border-[#e8ddd2] bg-white text-[#381c19] lg:flex"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <button
              onClick={() => scroll(-1)}
              aria-label="Previous reviews"
              className="absolute -left-2 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center border border-[#e8ddd2] bg-white text-[#381c19] lg:flex"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M15 5l-7 7 7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
