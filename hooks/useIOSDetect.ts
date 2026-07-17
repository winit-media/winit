"use client";

import { useEffect } from "react";
import { isIOS } from "@/lib/isIOS";

export { isIOS };

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
