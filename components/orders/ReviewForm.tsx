"use client";

import { useState } from "react";
import { StarRatingInput } from "@/components/ui/StarRatingInput";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/context/ToastContext";

export function ReviewForm({
  orderItemId,
  onSubmitted,
}: {
  orderItemId: string;
  onSubmitted: () => void;
}) {
  const showToast = useToast();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) {
      setError("Please select a rating");
      return;
    }
    setIsSubmitting(true);
    setError(null);

    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderItemId, rating, comment }),
    });
    const json = await res.json();
    setIsSubmitting(false);

    if (!res.ok) {
      const message = json.message ?? "Could not submit review";
      setError(message);
      showToast(message, "error");
      return;
    }
    showToast("Review submitted", "success");
    onSubmitted();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 space-y-2 rounded-lg border border-gray-200 p-3">
      <StarRatingInput value={rating} onChange={setRating} />
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your experience with this product..."
        rows={3}
        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-primary-400"
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
      <Button type="submit" size="sm" isLoading={isSubmitting}>
        Submit Review
      </Button>
    </form>
  );
}
