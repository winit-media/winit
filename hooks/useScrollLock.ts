"use client";

import { useEffect } from "react";

/**
 * Locks page scroll without using `position: fixed` on <body>.
 * The old approach (position:fixed + top:-scrollY) causes iOS Safari to
 * auto-reveal the address bar and jitter on unlock. Locking <html> with
 * overflow:hidden keeps the scroll position stable and avoids that bug.
 */
export function useScrollLock(isLocked: boolean) {
  useEffect(() => {
    if (!isLocked) return;

    const scrollY = window.scrollY ?? window.pageYOffset ?? 0;
    const html = document.documentElement;
    const body = document.body;

    const originalHtmlOverflow = html.style.overflow;
    const originalBodyOverflow = body.style.overflow;
    const originalHtmlPaddingRight = html.style.paddingRight;

    // Compensate for scrollbar disappearing so content doesn't shift
    const scrollbarWidth = window.innerWidth - html.clientWidth;

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      html.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      html.style.overflow = originalHtmlOverflow;
      body.style.overflow = originalBodyOverflow;
      html.style.paddingRight = originalHtmlPaddingRight;
      // Restore scroll position after styles are removed
      window.scrollTo(0, scrollY);
    };
  }, [isLocked]);
}
