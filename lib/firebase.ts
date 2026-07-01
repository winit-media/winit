import { initializeApp, getApps } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import type { SiteContent } from "./content";
import { defaultSiteContent } from "./content";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

export { app };

const DOC_PATH = "siteContent/main";

export async function fetchSiteContent(): Promise<SiteContent> {
  try {
    const docRef = doc(db, DOC_PATH);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const raw = snap.data() as Partial<SiteContent>;
      
      // Auto-sync new stats if they don't have the 4 required stats
      if (raw.stats && raw.stats.length !== 4) {
        raw.stats = defaultSiteContent.stats;
        saveSiteContent({ ...defaultSiteContent, ...raw, stats: raw.stats } as SiteContent);
      }

      return {
        ...defaultSiteContent,
        ...raw,
        testimonials:
          raw.testimonials && raw.testimonials.length > 0
            ? raw.testimonials
            : defaultSiteContent.testimonials,
        stats:
          raw.stats && raw.stats.length > 0
            ? raw.stats
            : defaultSiteContent.stats,
        brands:
          raw.brands && raw.brands.length > 0
            ? raw.brands
            : defaultSiteContent.brands,
        services:
          raw.services && raw.services.length > 0
            ? raw.services
            : defaultSiteContent.services,
        carouselVideos:
          raw.carouselVideos && raw.carouselVideos.length > 0
            ? raw.carouselVideos
            : defaultSiteContent.carouselVideos,
        footerQuickLinks:
          raw.footerQuickLinks && raw.footerQuickLinks.length > 0
            ? raw.footerQuickLinks
            : defaultSiteContent.footerQuickLinks,
      } as SiteContent;
    }
    return defaultSiteContent;
  } catch (err) {
    console.error("[Firebase] fetchSiteContent error:", err);
    return defaultSiteContent;
  }
}

export async function saveSiteContent(content: SiteContent): Promise<void> {
  const docRef = doc(db, DOC_PATH);
  await setDoc(docRef, content);
}

export { db };
