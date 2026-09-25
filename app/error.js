"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col w-full text-gray-900 bg-white">
      <Header />

      <main className="flex-grow flex flex-col items-center justify-center text-center py-24 px-6 bg-[#faf7f5]">
        <h1 className="text-6xl font-serif text-[#9d363d] mb-4">Oops!</h1>

        <h2 className="text-2xl font-serif text-gray-800 mb-6 uppercase tracking-widest">
          Something went wrong
        </h2>

        <p className="text-gray-600 max-w-md mx-auto mb-10 font-light text-lg">
          We apologize for the inconvenience. An unexpected error has occurred
          while trying to process your request.
        </p>

        <div className="flex space-x-4">
          <button
            onClick={() => reset()}
            className="bg-[#9d363d] text-white font-medium tracking-widest uppercase px-8 py-3 hover:bg-[#852a30] transition-colors"
          >
            Try Again
          </button>

          <Link
            href="/"
            className="bg-white border border-[#9d363d] text-[#9d363d] font-medium tracking-widest uppercase px-8 py-3 hover:bg-gray-50 transition-colors"
          >
            Return Home
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
