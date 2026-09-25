import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function OrderFailedPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 lg:px-8">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-red-600 shadow-soft">
        <svg viewBox="0 0 24 24" className="h-9 w-9" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </div>
      <h1 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">Payment Failed</h1>
      <p className="mt-2 text-gray-500">
        We couldn&apos;t process your payment. Your cart items are still saved — you can try again
        or choose a different payment method.
      </p>

      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Link href="/checkout">
          <Button size="lg">Try Again</Button>
        </Link>
        <Link href="/cart">
          <Button variant="outline" size="lg">Back to Cart</Button>
        </Link>
      </div>
    </div>
  );
}
