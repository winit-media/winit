import { getAdminDb } from "./firebase-admin";
import { SiteContent, defaultSiteContent, mergeSiteContent } from "./siteContent";

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
