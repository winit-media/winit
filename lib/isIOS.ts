/**
 * Detects iOS devices including Safari, Chrome (CriOS), Firefox (FxiOS),
 * and iPadOS 13+ (which reports as Macintosh but has touch support).
 * Returns false during SSR.
 *
 * @returns `true` if running on an iOS device
 */
export function isIOS(): boolean {
  if (typeof window === "undefined") return false;
  const ua = navigator.userAgent || "";
  if (/iPhone|iPad|iPod/i.test(ua)) return true;
  return navigator.maxTouchPoints > 1 && /Macintosh/i.test(ua);
}
