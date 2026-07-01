"use client";

import { useRef, useState, useEffect } from "react";

export default function PatternOverlay({ opacity = 0.16 }: { opacity?: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoaded(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none z-0" style={{ transform: "translateZ(0)" }}>
      {loaded && (
        <img
          src="/pattern.svg"
          alt=""
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover"
          style={{ opacity }}
        />
      )}
    </div>
  );
}
