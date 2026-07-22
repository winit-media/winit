import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import localFont from "next/font/local";
import Analytics from "./components/Analytics";
import "./globals.css";

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

const clashDisplay = localFont({
  src: [
    { path: "../fonts/clash-display-400.woff2", weight: "400", style: "normal" },
    { path: "../fonts/clash-display-500.woff2", weight: "500", style: "normal" },
    { path: "../fonts/clash-display-600.woff2", weight: "600", style: "normal" },
    { path: "../fonts/clash-display-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-clash",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "WinIt - Shaping Success Stories",
    template: "%s | WinIt Media",
  },
  description:
    "WinIt Media is a leading brand storytelling and influencer marketing agency based in New Delhi. We transform brand stories into powerful narratives that drive success through influencer marketing, celebrity endorsements, and creative strategy.",
  keywords: [
    "influencer marketing agency",
    "brand storytelling",
    "celebrity endorsement",
    "digital marketing India",
    "content marketing",
    "social media marketing",
    "UGC marketing",
    "podcast marketing",
    "talent management",
    "creative strategy",
    "brand marketing Delhi",
    "marketing agency India",
  ],
  authors: [{ name: "WinIt Media" }],
  creator: "WinIt Media",
  publisher: "WinIt Media",
  metadataBase: new URL("https://winitmedia.com"),
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "WinIt",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://winitmedia.com",
    siteName: "WinIt Media",
    title: "WinIt - Shaping Success Stories",
    description:
      "We transform brand stories into powerful narratives that drive success through influencer marketing, celebrity endorsements, and creative strategy.",
  },
  twitter: {
    card: "summary_large_image",
    site: "@WinItMedia",
    creator: "@WinItMedia",
    title: "WinIt - Shaping Success Stories",
    description:
      "We transform brand stories into powerful narratives that drive success.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: "https://winitmedia.com",
  },
};

export const viewport: Viewport = {
  themeColor: "#912dbf",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} ${clashDisplay.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://firestore.googleapis.com" />
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <script dangerouslySetInnerHTML={{ __html: "(function(){var ua=navigator.userAgent;if(/iPhone|iPad|iPod/.test(ua)||(navigator.maxTouchPoints>1&&/Macintosh/.test(ua)))document.documentElement.classList.add('is-ios')})()" }} />
      </head>
      <body className="min-h-svh antialiased">
        <Analytics />
        {children}
      </body>
    </html>
  );
}
