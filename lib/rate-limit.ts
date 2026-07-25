/**
 * Simple in-memory rate limiter using a sliding window.
 * Tracks request timestamps per key and enforces a max request count
 * within a configurable time window. Periodically cleans up expired entries.
 */

const rateLimitMap = new Map<string, number[]>();

const CLEANUP_INTERVAL = 60_000;
let lastCleanup = Date.now();

function cleanup(windowMs: number) {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;
  const cutoff = now - windowMs;
  for (const [key, timestamps] of rateLimitMap) {
    const valid = timestamps.filter((t) => t > cutoff);
    if (valid.length === 0) {
      rateLimitMap.delete(key);
    } else {
      rateLimitMap.set(key, valid);
    }
  }
}

/**
 * Checks whether a request is allowed under the rate limit.
 *
 * @param key - Unique identifier for the rate limit bucket (e.g. IP address or user ID)
 * @param windowMs - Time window in milliseconds
 * @param maxRequests - Maximum number of requests allowed within the window
 * @returns An object with `allowed`, `remaining` count, and `retryAfterMs` if denied
 */
export function rateLimit(
  key: string,
  windowMs: number,
  maxRequests: number
): { allowed: boolean; remaining: number; retryAfterMs: number } {
  cleanup(windowMs);

  const now = Date.now();
  const cutoff = now - windowMs;
  const timestamps = rateLimitMap.get(key) || [];
  const valid = timestamps.filter((t) => t > cutoff);

  if (valid.length >= maxRequests) {
    const oldestInWindow = valid[0];
    const retryAfterMs = oldestInWindow + windowMs - now;
    return { allowed: false, remaining: 0, retryAfterMs };
  }

  valid.push(now);
  rateLimitMap.set(key, valid);

  return { allowed: true, remaining: maxRequests - valid.length, retryAfterMs: 0 };
}
