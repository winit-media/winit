"use client";

import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from "react";
import {
  fetchSiteContent,
  saveSiteContent,
  SiteContent,
  defaultSiteContent,
} from "@/lib/firebase";
import { useToast as useToastSafe } from "@/components/ui/Toast";

function useToast() {
  try {
    return useToastSafe();
  } catch {
    return { toast: () => {} };
  }
}

export type { SiteContent };

interface AdminContextType {
  data: SiteContent;
  loaded: boolean;
  saving: boolean;
  hasChanges: boolean;
  updateContent: (partial: Partial<SiteContent>, silent?: boolean) => Promise<void>;
  addBrand: (brand: SiteContent["brands"][0]) => Promise<void>;
  removeBrand: (id: string) => Promise<void>;
  addTestimonial: (t: SiteContent["testimonials"][0]) => Promise<void>;
  removeTestimonial: (id: string) => Promise<void>;
  addCarouselVideo: (v: SiteContent["carouselVideos"][0]) => Promise<void>;
  removeCarouselVideo: (id: string) => Promise<void>;
  addService: (s: SiteContent["services"][0]) => Promise<void>;
  removeService: (index: number) => Promise<void>;
  updateService: (index: number, s: SiteContent["services"][0]) => Promise<void>;
  saveNow: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | null>(null);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<SiteContent>(defaultSiteContent);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const { toast } = useToast();
  const originalRef = useRef<SiteContent>(defaultSiteContent);
  const pendingRef = useRef<SiteContent | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetchSiteContent().then((content) => {
      setData(content);
      originalRef.current = content;
      setLoaded(true);
    });
  }, []);

  const persist = useCallback(async (updated: SiteContent, silent = false) => {
    setSaving(true);
    try {
      await saveSiteContent(updated);
      originalRef.current = updated;
      setHasChanges(false);
      if (!silent) toast("Changes saved", "success");
    } catch (err) {
      console.error("Failed to save:", err);
      setData(originalRef.current);
      setHasChanges(false);
      toast("Failed to save changes. Reverted.", "error");
    }
    setSaving(false);
  }, [toast]);

  const updateContent = useCallback(async (partial: Partial<SiteContent>, silent = false) => {
    setData((prev) => {
      const updated = { ...prev, ...partial };
      pendingRef.current = updated;
      setHasChanges(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      const pending = pendingRef.current;
      timerRef.current = setTimeout(() => {
        if (pendingRef.current) {
          persist(pendingRef.current, silent);
          pendingRef.current = null;
        }
      }, 800);
      return updated;
    });
  }, [persist]);

  const saveNow = useCallback(async () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (pendingRef.current) {
      await persist(pendingRef.current);
      pendingRef.current = null;
    } else {
      await persist(data);
    }
  }, [persist, data]);

  const addBrand = useCallback(async (brand: SiteContent["brands"][0]) => {
    setData((prev) => {
      const updated = { ...prev, brands: [...prev.brands, brand] };
      pendingRef.current = updated;
      setHasChanges(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        if (pendingRef.current) {
          persist(pendingRef.current);
          pendingRef.current = null;
        }
      }, 800);
      return updated;
    });
  }, [persist]);

  const removeBrand = useCallback(async (id: string) => {
    setData((prev) => {
      const updated = { ...prev, brands: prev.brands.filter((b) => b.id !== id) };
      pendingRef.current = updated;
      setHasChanges(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        if (pendingRef.current) {
          persist(pendingRef.current);
          pendingRef.current = null;
        }
      }, 800);
      return updated;
    });
  }, [persist]);

  const addTestimonial = useCallback(async (t: SiteContent["testimonials"][0]) => {
    setData((prev) => {
      const updated = { ...prev, testimonials: [...prev.testimonials, t] };
      pendingRef.current = updated;
      setHasChanges(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        if (pendingRef.current) {
          persist(pendingRef.current);
          pendingRef.current = null;
        }
      }, 800);
      return updated;
    });
  }, [persist]);

  const removeTestimonial = useCallback(async (id: string) => {
    setData((prev) => {
      const updated = { ...prev, testimonials: prev.testimonials.filter((t) => t.id !== id) };
      pendingRef.current = updated;
      setHasChanges(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        if (pendingRef.current) {
          persist(pendingRef.current);
          pendingRef.current = null;
        }
      }, 800);
      return updated;
    });
  }, [persist]);

  const addCarouselVideo = useCallback(async (v: SiteContent["carouselVideos"][0]) => {
    setData((prev) => {
      const updated = { ...prev, carouselVideos: [...prev.carouselVideos, v] };
      pendingRef.current = updated;
      setHasChanges(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        if (pendingRef.current) {
          persist(pendingRef.current);
          pendingRef.current = null;
        }
      }, 800);
      return updated;
    });
  }, [persist]);

  const removeCarouselVideo = useCallback(async (id: string) => {
    setData((prev) => {
      const updated = { ...prev, carouselVideos: prev.carouselVideos.filter((v) => v.id !== id) };
      pendingRef.current = updated;
      setHasChanges(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        if (pendingRef.current) {
          persist(pendingRef.current);
          pendingRef.current = null;
        }
      }, 800);
      return updated;
    });
  }, [persist]);

  const addService = useCallback(async (s: SiteContent["services"][0]) => {
    setData((prev) => {
      const updated = { ...prev, services: [...prev.services, s] };
      pendingRef.current = updated;
      setHasChanges(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        if (pendingRef.current) {
          persist(pendingRef.current);
          pendingRef.current = null;
        }
      }, 800);
      return updated;
    });
  }, [persist]);

  const removeService = useCallback(async (index: number) => {
    setData((prev) => {
      const updated = { ...prev, services: prev.services.filter((_, i) => i !== index) };
      pendingRef.current = updated;
      setHasChanges(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        if (pendingRef.current) {
          persist(pendingRef.current);
          pendingRef.current = null;
        }
      }, 800);
      return updated;
    });
  }, [persist]);

  const updateService = useCallback(async (index: number, s: SiteContent["services"][0]) => {
    setData((prev) => {
      const services = [...prev.services];
      services[index] = s;
      const updated = { ...prev, services };
      pendingRef.current = updated;
      setHasChanges(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        if (pendingRef.current) {
          persist(pendingRef.current);
          pendingRef.current = null;
        }
      }, 800);
      return updated;
    });
  }, [persist]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <AdminContext.Provider
      value={{
        data,
        loaded,
        saving,
        hasChanges,
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
        saveNow,
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
