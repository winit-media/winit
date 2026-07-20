"use client";

import { useLayoutEffect } from "react";

let globalVH = 0;

export function getViewportHeight(): number {
  if (globalVH > 0) return globalVH;
  if (typeof window === "undefined") return 800;
  return window.visualViewport?.height ?? window.innerHeight;
}

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
