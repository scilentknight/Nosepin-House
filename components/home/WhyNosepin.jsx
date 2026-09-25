"use client";

import {
  ShieldCheck,
  Award,
  Gem,
  Truck,
  RefreshCcw,
  Headphones,
} from "lucide-react";

const TRUST_ITEMS = [
  {
    title: "100% Genuine\nJewellery",
    icon: <Gem className="h-8 w-8" strokeWidth={1.5} />,
  },
  {
    title: "Certified\nProducts",
    icon: <Award className="h-8 w-8" strokeWidth={1.5} />,
  },
  {
    title: "Secure & Safe\nShopping",
    icon: <ShieldCheck className="h-8 w-8" strokeWidth={1.5} />,
  },
  {
    title: "Fast & Safe\nDelivery",
    icon: <Truck className="h-8 w-8" strokeWidth={1.5} />,
  },
  {
    title: "Easy Returns",
    icon: <RefreshCcw className="h-8 w-8" strokeWidth={1.5} />,
  },
  {
    title: "Dedicated\nSupport",
    icon: <Headphones className="h-8 w-8" strokeWidth={1.5} />,
  },
];

export default function WhyNosepin() {
  return (
    <section className="w-full bg-[#FBF6EE] py-1 ">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="mb-2 font-serif text-3xl italic text-[#783F35]">
          Why NOSEPIN?
        </h2>

        <p className="mb-12 text-[#6F625D]">
          Enjoy Best-in-class Benefits When You Buy Our Jewellery. Peace of Mind
          Assured!
        </p>

        <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6 mb-10">
          {TRUST_ITEMS.map((item, index) => (
            <div key={index} className="flex flex-col items-center">
              {/* Icon */}
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full border border-[#E2D3A5] bg-white shadow-sm transition-all duration-300 hover:scale-105 hover:border-[#BA8B30] hover:shadow-md">
                <div className="text-[#BA8B30]">{item.icon}</div>
              </div>

              {/* Title */}
              <p className="whitespace-pre-line text-sm leading-snug text-[#4F403B]">
                {item.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
