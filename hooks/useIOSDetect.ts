"use client";

import { useEffect } from "react";

/**
 * Reliable iOS detection covering Safari, Chrome (CriOS), Firefox (FxiOS),
 * and iPadOS 13+ (which reports as Macintosh but has touch support).
 */
export function isIOS(): boolean {
  if (typeof window === "undefined") return false;
  const ua = navigator.userAgent || "";
  if (/iPhone|iPad|iPod/i.test(ua)) return true;
  // iPadOS 13+ spoofs a Mac UA but has multitouch
  return navigator.maxTouchPoints > 1 && /Macintosh/i.test(ua);
}

/**
 * Adds `is-ios` class to <html> on iOS devices so CSS can provide
 * performant fallbacks (e.g. disabling backdrop-filter).
 * Call this once from the root page/layout component.
 */
export function useIOSBodyClass() {
  useEffect(() => {
    if (isIOS()) {
      document.documentElement.classList.add("is-ios");
    }
  }, []);
}
