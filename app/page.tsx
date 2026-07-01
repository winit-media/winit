import dynamic from 'next/dynamic';
import { AdminProvider } from "@/components/AdminProvider";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import { fetchSiteContent } from "@/lib/firebase";

const VideoSection = dynamic(() => import("@/components/VideoSection"));
const WhatWeDo = dynamic(() => import("@/components/WhatWeDo"));
const MediaCarousel = dynamic(() => import("@/components/MediaCarousel"));
const BrandShowcase = dynamic(() => import("@/components/BrandShowcase"));
const WhyChooseUs = dynamic(() => import("@/components/WhyChooseUs"));
const Testimonials = dynamic(() => import("@/components/Testimonials"));
const Footer = dynamic(() => import("@/components/Footer"));
const FloatingCTA = dynamic(() => import("@/components/FloatingCTA"));

export default async function Home() {
  const initialData = await fetchSiteContent();

  return (
    <AdminProvider initialData={initialData}>
      <Navbar />
      <main>
        <Hero />
        <VideoSection />
        <WhatWeDo />
        <MediaCarousel />
        <BrandShowcase />
        <WhyChooseUs />
        <Testimonials />
      </main>
      <Footer />
      <FloatingCTA />
    </AdminProvider>
  );
}
