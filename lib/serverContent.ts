/**
 * Server-side content fetcher using Firebase Admin SDK.
 * Reads site content from Firestore and merges with defaults.
 */

import { getAdminDb } from "./firebase-admin";
import { SiteContent, defaultSiteContent, mergeSiteContent } from "./siteContent";

/** Fetches the main site content document from Firestore, falling back to defaults. */
export async function getSiteContent(): Promise<SiteContent> {
  try {
    const db = getAdminDb();
    const doc = await db.collection("siteContent").doc("main").get();
    if (!doc.exists) return defaultSiteContent;
    return mergeSiteContent(doc.data() as Partial<SiteContent>);
  } catch (err) {
    console.error("[ServerContent] getSiteContent error:", err);
    return defaultSiteContent;
  }
}
