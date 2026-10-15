"use client";

import { useState, useEffect, useRef } from "react";

const statsData = [
  { target: 50, suffix: "K+", label: "Clients who came back" },
  { target: 10, suffix: "K+", label: "Designs on the books" },
  { target: 1, suffix: "", label: "Shop floor in Kathmandu" },
];

function CountUp({ target, suffix, duration = 1600 }) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) setHasStarted(true);
      },
      { threshold: 0.4 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [hasStarted, target, duration]);

  return (
    <span ref={ref} className="font-serif text-4xl text-[#381c19] sm:text-5xl">
      {count}
      {suffix}
    </span>
  );
}

export default function StatsSection() {
  return (
    <section className="bg-[#fbf6ee] py-12 sm:py-16">
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-10 px-4 text-center sm:grid-cols-3 sm:gap-6">
        {statsData.map((stat) => (
          <div key={stat.label} className="flex flex-col items-center">
            <CountUp target={stat.target} suffix={stat.suffix} />
            <span className="mt-2 max-w-[12rem] text-xs uppercase tracking-[0.16em] text-[#6f625d]">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
