"use client";

import { useSyncExternalStore } from "react";
import { isIOS } from "@/lib/isIOS";

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};

  const listeners: Array<() => void> = [];
  const handler = () => callback();

  window.addEventListener("resize", handler);
  listeners.push(() => window.removeEventListener("resize", handler));

  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", handler);
    listeners.push(() => window.visualViewport?.removeEventListener("resize", handler));
  }

  document.addEventListener("visibilitychange", handler);
  listeners.push(() => document.removeEventListener("visibilitychange", handler));

  return () => listeners.forEach((l) => l());
}

function getCanPlayMedia() {
  if (typeof window === "undefined") return true;

  if (document.hidden) return false;

  try {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const nav = navigator as unknown as Record<string, unknown>;
    const conn = nav.connection || nav.mozConnection || nav.webkitConnection;
    const connection = conn as Record<string, unknown> | undefined;
    const saveData = connection?.saveData === true;
    const slowConnection =
      connection?.effectiveType === "slow-2g" ||
      connection?.effectiveType === "2g";

    const lowMemory =
      (nav.deviceMemory as number | undefined) != null &&
      (nav.deviceMemory as number) < 2;
    const lowCPU =
      (nav.hardwareConcurrency as number | undefined) != null &&
      (nav.hardwareConcurrency as number) < 2;

    return !(prefersReducedMotion || saveData || slowConnection || lowMemory || lowCPU);
  } catch {
    return true;
  }
}

function detectDevice(): "ios" | "mobile" | "desktop" {
  if (typeof window === "undefined") return "desktop";
  if (isIOS()) return "ios";
  const ua = navigator.userAgent || "";
  const isMobile = navigator.maxTouchPoints > 0 || /Mobi|Android/i.test(ua);
  if (isMobile) return "mobile";
  return "desktop";
}

export function getMaxConcurrentVideos(): number {
  if (typeof window === "undefined") return 4;
  if (document.hidden) return 0;

  try {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return 0;

    const nav = navigator as unknown as Record<string, unknown>;
    const conn = nav.connection || nav.mozConnection || nav.webkitConnection;
    const connection = conn as Record<string, unknown> | undefined;
    if (connection?.saveData === true) return 0;
    if (
      connection?.effectiveType === "slow-2g" ||
      connection?.effectiveType === "2g"
    )
      return 0;

    const device = detectDevice();
    if (device === "ios") return 1;
    if (device === "mobile") return 3;
    return 5;
  } catch {
    return 3;
  }
}

export function useDeviceCapabilities() {
  return useSyncExternalStore(subscribe, getCanPlayMedia, () => true);
}
