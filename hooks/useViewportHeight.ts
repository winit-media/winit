"use client";

import { useLayoutEffect } from "react";

let globalVH = 0;

/**
 * Returns the current viewport height (cached globally).
 * Uses `visualViewport.height` on mobile (accounts for browser chrome),
 * falls back to `window.innerHeight`.
 */
export function getViewportHeight(): number {
  if (globalVH > 0) return globalVH;
  if (typeof window === "undefined") return 800;
  return window.visualViewport?.height ?? window.innerHeight;
}

/**
 * Hook that sets the CSS custom property `--vh` to the actual viewport height.
 * Updates on resize and orientation change to handle mobile browser chrome.
 */
export function useViewportHeight() {
  useLayoutEffect(() => {
    const set = () => {
      const vh = window.visualViewport?.height ?? window.innerHeight;
      globalVH = vh;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };
    set();
    window.visualViewport?.addEventListener("resize", set);
    window.addEventListener("orientationchange", set);
    return () => {
      window.visualViewport?.removeEventListener("resize", set);
      window.removeEventListener("orientationchange", set);
    };
  }, []);
}
