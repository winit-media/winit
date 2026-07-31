import { SiteContent, SITE_LOGO_URL } from "@/lib/siteContent";

interface JsonLdProps {
  content: SiteContent;
}

const PIN_CODE = /\b\d{6}\b/;

export default function JsonLd({ content }: JsonLdProps) {
  const postalCode = content.contactAddress.match(PIN_CODE)?.[0] || "110017";
  const address = {
    "@type": "PostalAddress",
    streetAddress: content.contactAddress,
    addressLocality: "New Delhi",
    addressRegion: "Delhi",
    postalCode,
    addressCountry: "IN",
  };
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "WinIt Media",
    url: "https://winitmedia.com",
    logo: SITE_LOGO_URL,
    description: content.pageDescription,
    address,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: content.contactPhone,
      contactType: "customer service",
      email: content.contactEmail,
    },
    sameAs: content.socialLinks
      .filter((l) => l.href && l.href !== "#")
      .map((l) => l.href),
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "WinIt Media",
    url: "https://winitmedia.com",
  };

  const navItems = content.navLinks
    .filter((l) => l.description)
    .map((l) => ({
      "@type": "SiteNavigationElement",
      name: l.label,
      url: l.href.startsWith("http")
        ? l.href
        : `https://winitmedia.com${l.href}`,
      description: l.description,
    }));

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "WinIt Media",
    image: SITE_LOGO_URL,
    url: "https://winitmedia.com",
    telephone: content.contactPhone,
    address,
    geo: {
      "@type": "GeoCoordinates",
      latitude: 28.5244,
      longitude: 77.2066,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      {navItems.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SiteNavigationElement",
              name: "Main Navigation",
              hasPart: navItems,
            }),
          }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
    </>
  );
}
