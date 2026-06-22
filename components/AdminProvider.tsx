"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Brand {
  id: string;
  name: string;
  imageUrl: string;
}

export interface Testimonial {
  id: string;
  name: string;
  designation: string;
  company: string;
  service: string;
  review: string;
  website: string;
  logoUrl: string;
}

export interface CarouselVideo {
  id: string;
  name: string;
  url: string;
}

interface AdminData {
  brands: Brand[];
  testimonials: Testimonial[];
  carouselVideos: CarouselVideo[];
  defaultVideoUrl: string;
}

interface AdminContextType {
  data: AdminData;
  addBrand: (brand: Brand) => void;
  removeBrand: (id: string) => void;
  addTestimonial: (t: Testimonial) => void;
  removeTestimonial: (id: string) => void;
  addCarouselVideo: (v: CarouselVideo) => void;
  removeCarouselVideo: (id: string) => void;
  setDefaultVideoUrl: (url: string) => void;
}

const defaultData: AdminData = {
  brands: [],
  testimonials: [],
  carouselVideos: [],
  defaultVideoUrl: "/fallback-video.mp4",
};

const AdminContext = createContext<AdminContextType | null>(null);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AdminData>(defaultData);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("winit-admin-data");
    if (stored) {
      try {
        setData(JSON.parse(stored));
      } catch {
        /* ignore */
      }
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem("winit-admin-data", JSON.stringify(data));
    }
  }, [data, loaded]);

  const addBrand = (brand: Brand) => setData((p) => ({ ...p, brands: [...p.brands, brand] }));
  const removeBrand = (id: string) => setData((p) => ({ ...p, brands: p.brands.filter((b) => b.id !== id) }));

  const addTestimonial = (t: Testimonial) => setData((p) => ({ ...p, testimonials: [...p.testimonials, t] }));
  const removeTestimonial = (id: string) => setData((p) => ({ ...p, testimonials: p.testimonials.filter((t) => t.id !== id) }));

  const addCarouselVideo = (v: CarouselVideo) => setData((p) => ({ ...p, carouselVideos: [...p.carouselVideos, v] }));
  const removeCarouselVideo = (id: string) => setData((p) => ({ ...p, carouselVideos: p.carouselVideos.filter((v) => v.id !== id) }));

  const setDefaultVideoUrl = (url: string) => setData((p) => ({ ...p, defaultVideoUrl: url }));

  return (
    <AdminContext.Provider
      value={{
        data,
        addBrand,
        removeBrand,
        addTestimonial,
        removeTestimonial,
        addCarouselVideo,
        removeCarouselVideo,
        setDefaultVideoUrl,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
  return ctx;
}
