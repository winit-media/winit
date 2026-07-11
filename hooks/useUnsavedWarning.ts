"use client";

import { useEffect, useCallback } from "react";

export function useUnsavedWarning(hasChanges: boolean) {
  const message = "You have unsaved changes. Are you sure you want to leave?";

  useEffect(() => {
    if (!hasChanges) return;

    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [hasChanges]);

  const confirmNavigation = useCallback(() => {
    if (!hasChanges) return true;
    return window.confirm(message);
  }, [hasChanges]);

  return { confirmNavigation };
}
