"use client";

import Link from "next/link";
import { Logo } from "@/components/layout/Logo";
import { ArrowUp } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[#E8DDD2] bg-[#FBF6EE] text-[#6F625D] ps-5">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 grid-cols-2 sm:px-6 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        {/* Brand */}
        <div>
          <Logo className="-mt-6" />

          <p className="mt-3 text-sm leading-6 text-[#6F625D]">
            Timeless jewellery crafted with elegance, quality, and attention to
            detail.
          </p>
        </div>

        {/* Shop */}
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-[#783F35]">
            Shop
          </h4>

          <ul className="mt-3 space-y-2 text-sm text-[#6F625D]">
            <li>
              <Link
                href="/shop"
                className="transition-colors hover:text-[#BA8B30]"
              >
                All Products
              </Link>
            </li>

            <li>
              <Link
                href="/cart"
                className="transition-colors hover:text-[#BA8B30]"
              >
                Cart
              </Link>
            </li>

            <li>
              <Link
                href="/faq"
                className="transition-colors hover:text-[#BA8B30]"
              >
                FAQ
              </Link>
            </li>
          </ul>
        </div>

        {/* Account */}
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-[#783F35]">
            Account
          </h4>

          <ul className="mt-3 space-y-2 text-sm text-[#6F625D]">
            <li>
              <Link
                href="/account/orders"
                className="transition-colors hover:text-[#BA8B30]"
              >
                My Orders
              </Link>
            </li>

            <li>
              <Link
                href="/login"
                className="transition-colors hover:text-[#BA8B30]"
              >
                Login
              </Link>
            </li>

            <li>
              <Link
                href="/register"
                className="transition-colors hover:text-[#BA8B30]"
              >
                Create Account
              </Link>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-[#783F35]">
            Support
          </h4>

          <div className="mt-3 space-y-1 text-sm leading-6 text-[#6F625D]">
            <p>nosepinhouse2068@gmail.com</p>
            <p>General Line: 01-5332279</p>
            <p>Sales Counter: 01-5331582</p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative border-t border-[#E8DDD2] px-4 py-4 text-center text-xs text-[#8A7C75]">
        <p>&copy; {new Date().getFullYear()} NOSEPIN. All rights reserved.</p>

        <p className="mt-1">
          Cash on Delivery &amp; secure online checkout available.
        </p>

        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
          className="absolute right-35 top-1/2 -translate-y-1/2 cursor-pointer text-[#783F35] transition-colors hover:text-[#BA8B30]"
        >
          <ArrowUp className="h-6 w-6" strokeWidth={2} />
        </button>
      </div>
    </footer>
  );
}
