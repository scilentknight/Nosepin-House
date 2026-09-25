"use client";

import { useState, useEffect, useRef } from "react";

const statsData = [
  { target: 50, suffix: "K+", label: "HAPPY CLIENTS" },
  { target: 10, suffix: "K+", label: "DESIGNS" },
  { target: 1, suffix: "", label: "STORE RANK" },
];

function CountUp({ target, suffix, duration = 2000 }) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.5 },
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
    <span
      ref={ref}
      className="text-[#B08D79] text-5xl md:text-6xl font-serif mb-3"
    >
      {count}
      {suffix}
    </span>
  );
}

export default function StatsSection() {
  return (
    <section className="border-y border-[#E8DDD2] bg-[#FBF6EE] py-10">
      <div className="mx-auto max-w-5xl px-4">
        <div className="flex flex-col items-center justify-between gap-12 text-center md:flex-row md:gap-4">
          {statsData.map((stat, index) => (
            <div key={index} className="flex flex-col items-center">
              <CountUp target={stat.target} suffix={stat.suffix} />

              <span className="text-xs font-bold uppercase tracking-widest text-[#592D27]">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
