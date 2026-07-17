"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { isIOS } from "@/lib/isIOS";

let lenisInstance: Lenis | null = null;

export function useLenis() {
  const rafRef = useRef<ReturnType<typeof requestAnimationFrame> | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // iOS WebKit + Lenis conflict with `position: sticky` and `dvh`-based
    // scroll-linked animations: native touch scroll already provides
    // momentum, and Lenis's RAF loop desyncs framer-motion's `useScroll`
    // sampling, causing sticky sections to clip and overlap. Let iOS use
    // native scrolling; desktop and Android keep Lenis untouched.
    if (isIOS()) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 2,
    });
    lenisInstance = lenis;

    const raf = (time: number) => {
      lenis.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    };
    rafRef.current = requestAnimationFrame(raf);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);

  return lenisInstance;
}

export function scrollToTarget(target: string | number) {
  if (lenisInstance) {
    lenisInstance.scrollTo(target, { offset: -64 });
  } else if (typeof target === "string") {
    const el = document.querySelector(target);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  } else {
    window.scrollTo({ top: target, behavior: "smooth" });
  }
}
