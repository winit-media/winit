"use client";

import { AdminProvider } from "@/components/AdminProvider";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import { useLenis } from "@/hooks/useLenis";
import { useIOSBodyClass } from "@/hooks/useIOSDetect";
import dynamic from "next/dynamic";

const VideoSection = dynamic(() => import("@/components/VideoSection"), { ssr: false });
const MobileBrandMarquee = dynamic(() => import("@/components/MobileBrandMarquee"), { ssr: false });
const WhatWeDo = dynamic(() => import("@/components/WhatWeDo"), { ssr: false });
const MediaCarousel = dynamic(() => import("@/components/MediaCarousel"), { ssr: false });
const BrandShowcase = dynamic(() => import("@/components/BrandShowcase"), { ssr: false });
const WhyChooseUs = dynamic(() => import("@/components/WhyChooseUs"), { ssr: false });
const Testimonials = dynamic(() => import("@/components/Testimonials"), { ssr: false });
const Footer = dynamic(() => import("@/components/Footer"), { ssr: false });
const FloatingCTA = dynamic(() => import("@/components/FloatingCTA"), { ssr: false });

export default function Home() {
  useLenis();
  useIOSBodyClass();
  return (
    <AdminProvider>
      <Navbar />
      <main>
        <Hero />
        <VideoSection />
        <MobileBrandMarquee />
        <WhatWeDo />
        <MediaCarousel />
        <div className="hidden lg:block"><BrandShowcase /></div>
        <WhyChooseUs />
        <Testimonials />
      </main>
      <Footer />
      <FloatingCTA />
    </AdminProvider>
  );
}
