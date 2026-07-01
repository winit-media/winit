import dynamic from "next/dynamic";
import { AdminProvider } from "@/components/AdminProvider";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";

const VideoSection = dynamic(() => import("@/components/VideoSection"), {
  ssr: true,
  loading: () => <div className="w-full aspect-video bg-black" />,
});

const WhatWeDo = dynamic(() => import("@/components/WhatWeDo"), {
  ssr: true,
  loading: () => <div className="h-screen bg-white" />,
});

const MediaCarousel = dynamic(() => import("@/components/MediaCarousel"), {
  ssr: true,
  loading: () => <div className="h-screen bg-brand" />,
});

const BrandShowcase = dynamic(() => import("@/components/BrandShowcase"), {
  ssr: true,
  loading: () => <div className="h-screen bg-white" />,
});

const WhyChooseUs = dynamic(() => import("@/components/WhyChooseUs"), {
  ssr: true,
  loading: () => <div className="min-h-screen bg-brand" />,
});

const Testimonials = dynamic(() => import("@/components/Testimonials"), {
  ssr: true,
  loading: () => <div className="min-h-screen bg-white" />,
});

const Footer = dynamic(() => import("@/components/Footer"), {
  ssr: true,
  loading: () => <div className="h-64 bg-brand" />,
});

const FloatingCTA = dynamic(() => import("@/components/FloatingCTA"), {
  ssr: true,
});

export default function Home() {
  return (
    <AdminProvider>
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
