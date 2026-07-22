"use client";

import { useSyncExternalStore, useCallback } from "react";

const STORAGE_KEY = "admin-dark-mode";

let listeners: Array<() => void> = [];

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

function getStoredDark(): boolean | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "true") return true;
    if (stored === "false") return false;
  } catch {
    // localStorage throws in iOS Safari Private Browsing
  }
  return null;
}

function getSystemDark(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function getDarkMode(): boolean {
  const stored = getStoredDark();
  if (stored !== null) return stored;
  return getSystemDark();
}

function subscribe(callback: () => void) {
  listeners.push(callback);

  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  const onMqChange = () => {
    // Only react to system changes when no explicit preference is stored
    if (getStoredDark() === null) {
      emitChange();
    }
  };
  mq.addEventListener("change", onMqChange);

  return () => {
    mq.removeEventListener("change", onMqChange);
    listeners = listeners.filter((l) => l !== callback);
  };
}

export function useDarkMode() {
  const dark = useSyncExternalStore(
    subscribe,
    getDarkMode,
    () => false,
  );

  const toggle = useCallback(() => {
    const next = !dark;
    try {
      localStorage.setItem(STORAGE_KEY, String(next));
    } catch {
      // localStorage throws in iOS Safari Private Browsing
    }
    document.documentElement.classList.toggle("dark", next);
    emitChange();
  }, [dark]);

  return { dark, toggle };
}
