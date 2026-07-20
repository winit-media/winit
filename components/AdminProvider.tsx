"use client";

import { createContext, useContext, useState, useEffect, useCallback, useRef, useMemo, ReactNode } from "react";
import { saveSiteContent } from "@/lib/firebase";
import { SiteContent, defaultSiteContent } from "@/lib/siteContent";
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
  revertedCount: number;
  updateContent: (partial: Partial<SiteContent>, silent?: boolean) => void;
  saveNow: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | null>(null);

export function AdminProvider({ children, initialContent }: { children: ReactNode; initialContent?: SiteContent }) {
  const [data, setData] = useState<SiteContent>(initialContent ?? defaultSiteContent);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [revertedCount, setRevertedCount] = useState(0);
  const { toast } = useToast();
  const originalRef = useRef<SiteContent>(initialContent ?? defaultSiteContent);
  const pendingRef = useRef<SiteContent | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dataRef = useRef<SiteContent>(data);

  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  const persist = useCallback(async (updated: SiteContent, silent = false) => {
    setSaving(true);
    try {
      await saveSiteContent(updated);
      originalRef.current = updated;
      setHasChanges(false);
      if (!silent) toast("Changes saved", "success");
    } catch (err) {
      console.error("Failed to save:", err);
      const message = err instanceof Error ? err.message : "Unknown error";
      setData(originalRef.current);
      dataRef.current = originalRef.current;
      setHasChanges(false);
      setRevertedCount((c) => c + 1);
      toast(`Save failed: ${message}`, "error");
    }
    setSaving(false);
  }, [toast]);

  const schedulePersist = useCallback((updated: SiteContent, silent: boolean) => {
    pendingRef.current = updated;
    setHasChanges(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (pendingRef.current) {
        persist(pendingRef.current, silent);
        pendingRef.current = null;
      }
    }, 800);
  }, [persist]);

  const updateContent = useCallback((partial: Partial<SiteContent>, silent = false) => {
    const updated = { ...dataRef.current, ...partial };
    dataRef.current = updated;
    setData(updated);
    schedulePersist(updated, silent);
  }, [schedulePersist]);

  const saveNow = useCallback(async () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (pendingRef.current) {
      await persist(pendingRef.current);
      pendingRef.current = null;
    } else {
      await persist(dataRef.current);
    }
  }, [persist]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const contextValue = useMemo(() => ({
    data,
    loaded: true,
    saving,
    hasChanges,
    revertedCount,
    updateContent,
    saveNow,
  }), [data, saving, hasChanges, revertedCount, updateContent, saveNow]);

  return (
    <AdminContext.Provider value={contextValue}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
  return ctx;
}
