import { ReviewsCarousel, type Review } from "./ReviewsCarousel";
import {
  STATIC_REVIEWS,
  SUMMARY_OVERRIDE,
  GOOGLE_REVIEWS_URL,
} from "./reviews.data";

function relative(date: string) {
  const days = Math.max(
    0,
    Math.floor((Date.now() - new Date(date).getTime()) / 86400000),
  );
  if (days < 1) return "today";
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;
  if (days < 30)
    return `${Math.floor(days / 7)} week${days < 14 ? "" : "s"} ago`;
  if (days < 365)
    return `${Math.floor(days / 30)} month${days < 60 ? "" : "s"} ago`;
  const y = Math.floor(days / 365);
  return `${y} year${y === 1 ? "" : "s"} ago`;
}

export function GoogleReviews() {
  const sorted = [...STATIC_REVIEWS].sort((a, b) =>
    b.date.localeCompare(a.date),
  );
  if (sorted.length === 0 && !SUMMARY_OVERRIDE) return null;

  const count = SUMMARY_OVERRIDE?.count ?? sorted.length;
  const rating =
    SUMMARY_OVERRIDE?.rating ??
    sorted.reduce((s, r) => s + r.rating, 0) / Math.max(1, sorted.length);

  const reviews: Review[] = sorted.map((r) => ({
    name: r.name,
    photo: null,
    profileUrl: null,
    when: relative(r.date),
    rating: r.rating,
    text: r.text,
  }));

  return (
    <ReviewsCarousel
      rating={rating}
      count={count}
      url={GOOGLE_REVIEWS_URL}
      reviews={reviews}
    />
  );
}
