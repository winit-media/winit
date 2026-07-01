import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import FontLoader from "@/components/FontLoader";

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "WiNit - Shaping Success Stories",
  description: "We transform brand stories into powerful narratives that drive success.",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={poppins.variable}>
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
      </head>
      <body className="min-h-screen antialiased">
        <FontLoader />
        {children}
      </body>
    </html>
  );
}
