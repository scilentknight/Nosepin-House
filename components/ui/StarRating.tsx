export function StarRating({ rating, count }: { rating: number; count?: number }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex text-amber-400" aria-label={`Rated ${rating} out of 5`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <svg
            key={i}
            viewBox="0 0 20 20"
            className="h-4 w-4"
            fill={i < Math.round(rating) ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth={1.2}
          >
            <path d="M10 1.5l2.6 5.6 6.1.7-4.5 4.1 1.2 6-5.4-3-5.4 3 1.2-6L1.3 7.8l6.1-.7z" />
          </svg>
        ))}
      </div>
      {typeof count === "number" && (
        <span className="text-xs text-gray-500">({count})</span>
      )}
    </div>
  );
}
