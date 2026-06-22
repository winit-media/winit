

import { AdminProvider } from "@/components/AdminProvider";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import VideoSection from "@/components/VideoSection";
import WhatWeDo from "@/components/WhatWeDo";
import MediaCarousel from "@/components/MediaCarousel";
import BrandShowcase from "@/components/BrandShowcase";
import WhyChooseUs from "@/components/WhyChooseUs";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";

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
    </AdminProvider>
  );
}
