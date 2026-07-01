"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  fetchSiteContent,
  saveSiteContent,
  SiteContent,
  defaultSiteContent,
} from "@/lib/firebase";

export type { SiteContent };

interface AdminContextType {
  data: SiteContent;
  loaded: boolean;
  saving: boolean;
  updateContent: (partial: Partial<SiteContent>) => Promise<void>;
  addBrand: (brand: SiteContent["brands"][0]) => Promise<void>;
  removeBrand: (id: string) => Promise<void>;
  addTestimonial: (t: SiteContent["testimonials"][0]) => Promise<void>;
  removeTestimonial: (id: string) => Promise<void>;
  addCarouselVideo: (v: SiteContent["carouselVideos"][0]) => Promise<void>;
  removeCarouselVideo: (id: string) => Promise<void>;
  addService: (s: SiteContent["services"][0]) => Promise<void>;
  removeService: (index: number) => Promise<void>;
  updateService: (index: number, s: SiteContent["services"][0]) => Promise<void>;
}

const AdminContext = createContext<AdminContextType | null>(null);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<SiteContent>(defaultSiteContent);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSiteContent().then((content) => {
      console.log("[AdminProvider] Loaded content, testimonials:", content.testimonials.length);
      setData(content);
      setLoaded(true);
    });
  }, []);

  const persist = async (updated: SiteContent) => {
    setSaving(true);
    try {
      await saveSiteContent(updated);
    } catch (err) {
      console.error("Failed to save:", err);
    }
    setSaving(false);
  };

  const updateContent = async (partial: Partial<SiteContent>) => {
    const updated = { ...data, ...partial };
    setData(updated);
    await persist(updated);
  };

  const addBrand = async (brand: SiteContent["brands"][0]) => {
    const updated = { ...data, brands: [...data.brands, brand] };
    setData(updated);
    await persist(updated);
  };

  const removeBrand = async (id: string) => {
    const updated = { ...data, brands: data.brands.filter((b) => b.id !== id) };
    setData(updated);
    await persist(updated);
  };

  const addTestimonial = async (t: SiteContent["testimonials"][0]) => {
    const updated = { ...data, testimonials: [...data.testimonials, t] };
    setData(updated);
    await persist(updated);
  };

  const removeTestimonial = async (id: string) => {
    const updated = {
      ...data,
      testimonials: data.testimonials.filter((t) => t.id !== id),
    };
    setData(updated);
    await persist(updated);
  };

  const addCarouselVideo = async (v: SiteContent["carouselVideos"][0]) => {
    const updated = {
      ...data,
      carouselVideos: [...data.carouselVideos, v],
    };
    setData(updated);
    await persist(updated);
  };

  const removeCarouselVideo = async (id: string) => {
    const updated = {
      ...data,
      carouselVideos: data.carouselVideos.filter((v) => v.id !== id),
    };
    setData(updated);
    await persist(updated);
  };

  const addService = async (s: SiteContent["services"][0]) => {
    const updated = { ...data, services: [...data.services, s] };
    setData(updated);
    await persist(updated);
  };

  const removeService = async (index: number) => {
    const updated = {
      ...data,
      services: data.services.filter((_, i) => i !== index),
    };
    setData(updated);
    await persist(updated);
  };

  const updateService = async (index: number, s: SiteContent["services"][0]) => {
    const services = [...data.services];
    services[index] = s;
    const updated = { ...data, services };
    setData(updated);
    await persist(updated);
  };

  return (
    <AdminContext.Provider
      value={{
        data,
        loaded,
        saving,
        updateContent,
        addBrand,
        removeBrand,
        addTestimonial,
        removeTestimonial,
        addCarouselVideo,
        removeCarouselVideo,
        addService,
        removeService,
        updateService,
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
