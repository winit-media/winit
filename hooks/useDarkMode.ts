"use client";

import { useState, useEffect, useCallback } from "react";

export function useDarkMode() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("admin-dark-mode") === "true";
      queueMicrotask(() => setDark(stored));
    } catch {
      // localStorage throws in iOS Safari Private Browsing
    }
  }, []);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    try {
      localStorage.setItem("admin-dark-mode", String(dark));
    } catch {
      // localStorage throws in iOS Safari Private Browsing
    }
  }, [dark]);

  const toggle = useCallback(() => setDark((prev) => !prev), []);

  return { dark, toggle };
}
