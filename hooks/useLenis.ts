"use client";

import { useEffect, useRef, useState } from "react";
import { isIOS } from "@/lib/isIOS";

type LenisInstance = {
  raf: (time: number) => void;
  destroy: () => void;
  scrollTo: (target: string | number, opts?: { offset?: number }) => void;
};

let globalLenis: LenisInstance | null = null;

export function useLenis() {
  const rafRef = useRef<ReturnType<typeof requestAnimationFrame> | null>(null);
  const [instance, setInstance] = useState<LenisInstance | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isIOS()) return;

    let destroyed = false;

    import("lenis")
      .then(({ default: Lenis }) => {
        if (destroyed) return;

        const lenis = new Lenis({
          duration: 1.2,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true,
          touchMultiplier: 2,
        });
        globalLenis = lenis;
        setInstance(lenis);

        const raf = (time: number) => {
          lenis.raf(time);
          rafRef.current = requestAnimationFrame(raf);
        };
        rafRef.current = requestAnimationFrame(raf);
      })
      .catch(() => {
        // Lenis chunk failed to load; fall back to native scrolling
      });

    return () => {
      destroyed = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      globalLenis?.destroy();
      globalLenis = null;
      setInstance(null);
    };
  }, []);

  return instance;
}

export function scrollToTarget(target: string | number) {
  if (globalLenis) {
    globalLenis.scrollTo(target, { offset: -64 });
  } else if (typeof target === "string") {
    const el = document.querySelector(target);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  } else {
    window.scrollTo({ top: Number(target), behavior: "smooth" });
  }
}
