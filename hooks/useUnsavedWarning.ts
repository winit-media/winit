"use client";

import { useEffect, useCallback } from "react";

/**
 * Warns the user before leaving the page when there are unsaved changes.
 * Handles both `beforeunload` (desktop) and `pagehide` (iOS Safari).
 *
 * @param hasChanges - Whether there are unsaved changes to warn about
 * @returns An object with `confirmNavigation()` that returns `true` if safe to leave
 */
export function useUnsavedWarning(hasChanges: boolean) {
  const message = "You have unsaved changes. Are you sure you want to leave?";

  useEffect(() => {
    if (!hasChanges) return;

    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };

    // iOS Safari fires pagehide instead of beforeunload
    const pageHideHandler = (e: PageTransitionEvent) => {
      if (!e.persisted && hasChanges) {
        e.preventDefault();
      }
    };

    window.addEventListener("beforeunload", handler);
    window.addEventListener("pagehide", pageHideHandler);
    return () => {
      window.removeEventListener("beforeunload", handler);
      window.removeEventListener("pagehide", pageHideHandler);
    };
  }, [hasChanges]);

  const confirmNavigation = useCallback(() => {
    if (!hasChanges) return true;
    return window.confirm(message);
  }, [hasChanges]);

  return { confirmNavigation };
}
