"use client";

import { useState } from "react";

export function StarRatingInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (rating: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  const active = hovered || value;

  return (
    <div className="flex items-center gap-1" role="radiogroup" aria-label="Rating">
      {Array.from({ length: 5 }).map((_, i) => {
        const star = i + 1;
        return (
          <button
            key={star}
            type="button"
            aria-label={`${star} star${star > 1 ? "s" : ""}`}
            onClick={() => onChange(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            className="text-amber-400"
          >
            <svg
              viewBox="0 0 20 20"
              className="h-6 w-6"
              fill={star <= active ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth={1.2}
            >
              <path d="M10 1.5l2.6 5.6 6.1.7-4.5 4.1 1.2 6-5.4-3-5.4 3 1.2-6L1.3 7.8l6.1-.7z" />
            </svg>
          </button>
        );
      })}
    </div>
  );
}
