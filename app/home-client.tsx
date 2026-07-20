"use client";

import { AdminProvider } from "@/components/AdminProvider";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import LazyLoad from "@/components/LazyLoad";
import SectionSkeleton from "@/components/SectionSkeleton";
import { LazyMotion, domAnimation } from "framer-motion";
import { useLenis } from "@/hooks/useLenis";
import { useIOSBodyClass } from "@/hooks/useIOSDetect";
import { useViewportHeight } from "@/hooks/useViewportHeight";
import { SiteContent } from "@/lib/siteContent";
import dynamic from "next/dynamic";

const VideoSection = dynamic(() => import("@/components/VideoSection"), {
  ssr: false,
  loading: () => <SectionSkeleton height="aspect-video" theme="dark" />,
});
const MobileBrandMarquee = dynamic(() => import("@/components/MobileBrandMarquee"), {
  ssr: false,
  loading: () => <SectionSkeleton height="h-16" theme="light" />,
});
const WhatWeDo = dynamic(() => import("@/components/WhatWeDo"), {
  ssr: false,
  loading: () => <SectionSkeleton height="min-h-svh" theme="light" />,
});
const MediaCarousel = dynamic(() => import("@/components/MediaCarousel"), {
  ssr: false,
  loading: () => <SectionSkeleton height="h-svh" theme="dark" />,
});
const BrandShowcase = dynamic(() => import("@/components/BrandShowcase"), {
  ssr: false,
  loading: () => <SectionSkeleton height="h-svh" theme="light" />,
});
const WhyChooseUs = dynamic(() => import("@/components/WhyChooseUs"), {
  ssr: false,
  loading: () => <SectionSkeleton height="min-h-svh" theme="dark" />,
});
const Testimonials = dynamic(() => import("@/components/Testimonials"), {
  ssr: false,
  loading: () => <SectionSkeleton height="min-h-[50vh]" theme="light" />,
});
const Footer = dynamic(() => import("@/components/Footer"), {
  ssr: false,
  loading: () => <SectionSkeleton height="h-64" theme="dark" />,
});
const FloatingCTA = dynamic(() => import("@/components/FloatingCTA"), {
  ssr: false,
});

export default function HomeClient({ initialContent }: { initialContent: SiteContent }) {
  useLenis();
  useIOSBodyClass();
  useViewportHeight();
  return (
    <LazyMotion features={domAnimation} strict>
      <AdminProvider initialContent={initialContent}>
        <Navbar />
        <main>
          <Hero />
          <VideoSection />
          <MobileBrandMarquee />
          <WhatWeDo />
          <MediaCarousel />
          <div className="hidden lg:block"><BrandShowcase /></div>
          <WhyChooseUs />
          <LazyLoad>
            <Testimonials />
          </LazyLoad>
        </main>
        <Footer />
        <FloatingCTA />
      </AdminProvider>
    </LazyMotion>
  );
}
