import { initializeApp, getApps } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

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

export interface SiteContent {
  // Navbar
  logoUrl: string;
  navLinks: { label: string; href: string }[];

  // Hero
  heroHeading: string;
  heroSubtext: string;
  heroCtaText: string;

  // What We Do
  whatWeDoTitle: string;
  services: {
    sub: string;
    content: string;
    bg: string;
  }[];

  // Media Carousel
  carouselTitle: string;

  // Brand Showcase
  brandTitle: string;

  // Why Choose Us
  whyChooseUsTitle: string;
  stats: { number: number; suffix: string; label: string }[];
  reasons: { title: string; desc: string }[];

  // Testimonials
  testimonialsTitle: string;
  testimonialsSubtitle: string;
  testimonials: {
    id: string;
    name: string;
    designation: string;
    company: string;
    service: string;
    review: string;
    website: string;
    logoUrl: string;
  }[];

  // Footer
  footerTitle: string;
  footerTagline: string;
  footerQuickLinksTitle: string;
  footerQuickLinks: { label: string; href: string }[];
  footerContactTitle: string;
  contactPhone: string;
  contactAddress: string;
  contactEmail: string;
  socialLinks: { label: string; href: string }[];
  footerCopyright: string;

  // Brands
  brands: { id: string; name: string; imageUrl: string; link?: string }[];

  // Videos
  defaultVideoUrl: string;
  carouselVideos: { id: string; name: string; url: string }[];

  // Page Metadata
  pageTitle: string;
  pageDescription: string;
}

export const defaultSiteContent: SiteContent = {
  logoUrl: "/logo.png",
  navLinks: [
    { label: "Home", href: "#home" },
    { label: "Services", href: "#services" },
    { label: "Work", href: "#work" },
    { label: "Contact", href: "#contact" },
  ],

  heroHeading: "SHAPING SUCCESS STORIES",
  heroSubtext:
    "We believe every brand has a unique story waiting to be told. Our mission is to transform those stories into powerful narratives that drive success. By connecting your brand with the right audience, we ensure your message isn't just heard, but truly remembered. Let's craft your story together and make it unforgettable.",
  heroCtaText: "Connect Now",

  whatWeDoTitle: "What we do",
  services: [
    {
      sub: "Influencer Marketing",
      content:
        "We specialize in crafting potent campaigns that link brands with the perfect influencers to promote their products or services effectively. Our strategic approach ensures we select influencers tailored to your target market and goals.",
      bg: "bg-blue-500",
    },
    {
      sub: "Celebrity Endorsement",
      content:
        "We connect your brand with top celebrities for authentic endorsements that boost credibility and expand reach. Let's make your brand shine with star power!",
      bg: "bg-red-500",
    },
    {
      sub: "Podcast",
      content:
        "We create engaging podcasts that amplify your brand's voice. Through compelling storytelling and expert insights, we connect you with your audience authentically. Let's bring your brand to life through audio!",
      bg: "bg-purple-400",
    },
    {
      sub: "User Generated Content",
      content:
        "We leverage user-generated content to boost trust and engagement. Partnering with creators, we craft authentic content that resonates with your audience. Let's amplify your brand's impact!",
      bg: "bg-pink-400",
    },
    {
      sub: "Talent Management",
      content:
        "We manage talent to elevate your brand's presence. From collaborations to career growth, we connect influencers and brands for impactful partnerships. Let's build success together!",
      bg: "bg-orange-400",
    },
    {
      sub: "Creative Strategy",
      content:
        "We craft tailored strategies that align with your brand's goals and audience. With industry insights, striking visuals, and compelling stories, we create lasting impact. Let's make your brand unforgettable!",
      bg: "bg-green-400",
    },
    {
      sub: "Event Marketing",
      content:
        "We create unforgettable events that captivate audiences and amplify your brand's impact. From strategy to execution, we turn moments into lasting impressions. Let's make your event a success!",
      bg: "bg-yellow-400",
    },
  ],

  carouselTitle: "Our Work",
  brandTitle: "Our Brands",

  whyChooseUsTitle: "Why Choose Us?",
  stats: [
    { number: 700000, suffix: "+", label: "Creators Association" },
    { number: 50, suffix: "+", label: "Brands" },
    { number: 200, suffix: "+", label: "Campaigns" },
    { number: 500, suffix: "mn+", label: "Views Delivered" },
  ],
  reasons: [
    {
      title: "Data-Driven Approach",
      desc: "Every campaign is backed by analytics and insights to maximize ROI.",
    },
    {
      title: "Creative Excellence",
      desc: "Our team delivers innovative content that stands out in crowded markets.",
    },
    {
      title: "Full-Service Agency",
      desc: "From strategy to execution, we handle everything under one roof.",
    },
  ],

  testimonialsTitle: "Trusted by leading brands",
  testimonialsSubtitle: "Success Stories",
  testimonials: [
    {
      id: "1",
      name: "Sadhu Kamal",
      designation: "Chief Marketing Manager",
      company: "Reliance Retail Limited",
      service: "Influencer Marketing",
      review:
        "Working with Winit Media was a great experience. Their influencer marketing strategy helped increase our brand awareness, engagement, and reach. The team was professional, responsive, and delivered excellent results.",
      website: "https://www.relianceretail.com",
      logoUrl: "https://relianceretail.com/img/RRfavicon.png",
    },
    {
      id: "2",
      name: "Simran Shergill",
      designation: "Assistant Manager - Brand Solutions",
      company: "Lokmat Media Pvt. Ltd.",
      service: "Influencer Marketing",
      review:
        "Harshit and the entire team at Winit Media have been extremely supportive throughout the campaign. Their understanding of the brief, proactive approach, and timely delivery helped us bring the brand's vision to life seamlessly. It was a smooth and collaborative experience from start to finish.",
      website: "https://www.lokmat.com",
      logoUrl: "https://d3pc1xvrcw35tl.cloudfront.net/assets/images/lokmat-logo-white-v0.2.png",
    },
    {
      id: "3",
      name: "Tejas Jadhav",
      designation: "Marketing Manager",
      company: "Brand Concepts Ltd",
      service: "Influencer Marketing",
      review:
        "It was a really good experience working with the Winit team. The team is highly supportive and maintains excellent communication with its clients. Keep up the great work, and we look forward to continuing this successful partnership.",
      website: "https://www.brandconcepts.in/",
      logoUrl: "https://www.brandconcepts.in/wp-content/uploads/2024/02/Brand-Concepts-Logo-new.png",
    },
    {
      id: "4",
      name: "Anika Chirawawala",
      designation: "Product Marketing & Performance Manager",
      company: "Augmont Goldtech Private Limited",
      service: "Influencer Marketing",
      review:
        "The content created by the selected influencer provided high reach and engagement for our recycling awareness campaign. Overall, the experience was great and efficient.",
      website: "https://www.augmont.com/",
      logoUrl: "https://www.augmont.com/assets/logos/augmont-logo.webp",
    },
    {
      id: "5",
      name: "Ekta Lunagariya",
      designation: "Head of Marketing and Communications",
      company: "Everest Fleet Pvt Ltd",
      service: "Influencer Marketing",
      review:
        "Our experience working with Winit has been extremely positive. Influencer marketing has become an important part of our brand-building strategy, and Winit has consistently helped us execute impactful campaigns with the right creator partnerships. Through these initiatives, we have seen a noticeable increase in brand awareness and a significant expansion of our social media reach. Their team's understanding of our objectives, responsiveness, and execution capabilities have made them a valuable marketing partner.",
      website: "https://everestfleet.com/",
      logoUrl: "https://everestfleet.com/wp-content/uploads/2025/04/New-Logo-01-2.png",
    },
  ],

  footerTitle: "Lets WIN-IT",
  footerTagline: "Shaping success stories through powerful brand narratives and strategic marketing solutions.",
  footerQuickLinksTitle: "Quick Links",
  footerQuickLinks: [
    { label: "Home", href: "#home" },
    { label: "Services", href: "#services" },
    { label: "Our Work", href: "#work" },
    { label: "Clients", href: "#clients" },
    { label: "Blogs", href: "#blogs" },
    { label: "Contact", href: "#contact" },
  ],
  footerContactTitle: "Contact Us",
  contactPhone: "+91 8076098248",
  contactAddress: "F- 226, Flat No. 4, Third Floor Block- F, New Delhi South Delhi, DELHI, 110030",
  contactEmail: "harshit@winitmedia.com",
  socialLinks: [
    { label: "Facebook", href: "#" },
    { label: "Instagram", href: "#" },
    { label: "Twitter", href: "#" },
    { label: "LinkedIn", href: "#" },
  ],
  footerCopyright: "© 2026 WiNit. All rights reserved.",

  brands: [
    { id: "1", name: "Reliance Retail Limited", imageUrl: "/brands/RRfavicon.png", link: "https://www.relianceretail.com" },
    { id: "2", name: "Lokmat Media Pvt. Ltd.", imageUrl: "/brands/lokmat.png", link: "https://www.lokmat.com" },
    { id: "3", name: "Brand Concepts Ltd", imageUrl: "/brands/brandconcepts.png", link: "https://www.brandconcepts.in" },
    { id: "4", name: "Augmont Goldtech Private Limited", imageUrl: "/brands/augmont.webp", link: "https://www.augmont.com" },
    { id: "5", name: "Everest Fleet Pvt Ltd", imageUrl: "/brands/everestfleet.png", link: "https://everestfleet.com" },
  ],
  defaultVideoUrl: "/fallback-video.mp4",
  carouselVideos: [],

  pageTitle: "WiNit - Shaping Success Stories",
  pageDescription:
    "We transform brand stories into powerful narratives that drive success.",
};

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
