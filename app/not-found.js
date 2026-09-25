import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col w-full text-gray-900 bg-white">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center text-center py-24 px-6 bg-[#faf7f5]">
        <h1 className="text-9xl font-serif text-[#9d363d] mb-4">404</h1>
        <h2 className="text-3xl font-serif text-gray-800 mb-6 uppercase tracking-widest">
          Page Not Found
        </h2>
        <p className="text-gray-600 max-w-md mx-auto mb-10 font-light text-lg">
          We can't seem to find the page you're looking for. It might have been
          removed, had its name changed, or is temporarily unavailable.
        </p>

        <div className="relative mb-10 max-w-md w-full">
          <input
            type="text"
            placeholder="Search for jewellery..."
            className="w-full border border-gray-300 py-3 px-4 pr-10 focus:outline-none focus:border-[#9d363d] bg-white"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>

        <Link
          href="/"
          className="bg-[#9d363d] text-white font-medium tracking-widest uppercase px-8 py-3 hover:bg-[#852a30] transition-colors"
        >
          Return Home
        </Link>
      </main>
      <Footer />
    </div>
  );
}
