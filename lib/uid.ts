export function uid(): string {
  try {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      return crypto.randomUUID();
    }
  } catch {
    // crypto.randomUUID may throw in insecure contexts or old browsers
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}
