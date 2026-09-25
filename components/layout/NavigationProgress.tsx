"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export function NavigationProgress() {
  const pathname = usePathname();

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const link = target.closest("a");

      if (!link) return;

      const href = link.getAttribute("href");

      // Ignore external / special links
      if (
        !href ||
        href.startsWith("#") ||
        href.startsWith("http") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        link.target === "_blank"
      ) {
        return;
      }

      // Ignore Ctrl/Cmd/Shift/Alt clicks
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) {
        return;
      }

      // Ignore current page
      if (href === window.location.pathname) {
        return;
      }

      // Clear existing timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      setLoading(true);
      setProgress(5);

      // Smoothly increase progress
      timerRef.current = setInterval(() => {
        setProgress((current) => {
          // Never go beyond 90% until navigation finishes
          if (current >= 90) {
            return current;
          }

          // Slow down as it gets closer to 90%
          let increment;

          if (current < 20) {
            increment = 2;
          } else if (current < 50) {
            increment = 1;
          } else if (current < 75) {
            increment = 0.5;
          } else {
            increment = 0.2;
          }

          return Math.min(current + increment, 90);
        });
      }, 100);
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);

      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Navigation completed
  useEffect(() => {
    if (!loading) return;

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Smoothly finish to 100%
    setProgress(100);

    const timer = setTimeout(() => {
      setLoading(false);

      // Reset after fade-out
      setTimeout(() => {
        setProgress(0);
      }, 2000);
    }, 500);

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <div
      className={`fixed left-0 top-0 z-[9999] h-[3px] transition-opacity duration-300 ${
        loading ? "opacity-100" : "opacity-0"
      }`}
      style={{
        width: `${progress}%`,
        backgroundColor: "#ef4444",
        boxShadow: "0 0 8px rgba(239, 68, 68, 0.7)",
        transition: "width 200ms ease-out, opacity 300ms ease-in-out",
      }}
    />
  );
}
