"use client";
import { MessageCircle, ArrowUp } from "lucide-react";

export default function FloatingIcons() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* SALE sticky tag on bottom left */}
      <div className="fixed bottom-0 left-0 bg-[#9d363d] text-white px-6 py-2 text-sm font-bold tracking-widest z-50 rounded-tr-md cursor-pointer hover:bg-[#852a30] transition-colors">
        SALE
      </div>

      {/* Right side floating icons */}
      <div className="fixed bottom-8 right-6 flex flex-col items-center space-y-2 z-50">
        <a
          href="https://wa.me/9779861252006"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition-colors transform hover:scale-110 flex items-center justify-center w-14 h-14"
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle size={28} />
        </a>

        <button
          onClick={scrollToTop}
          className="bg-[#9d363d] text-white p-3 shadow-md hover:bg-[#852a30] transition-colors flex items-center justify-center w-10 h-10 rounded"
          aria-label="Scroll to top"
        >
          <ArrowUp size={20} />
        </button>
      </div>
    </>
  );
}
