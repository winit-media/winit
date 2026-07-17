/**
 * Reliable iOS detection covering Safari, Chrome (CriOS), Firefox (FxiOS),
 * and iPadOS 13+ (which reports as Macintosh but has touch support).
 */
export function isIOS(): boolean {
  if (typeof window === "undefined") return false;
  const ua = navigator.userAgent || "";
  if (/iPhone|iPad|iPod/i.test(ua)) return true;
  return navigator.maxTouchPoints > 1 && /Macintosh/i.test(ua);
}
