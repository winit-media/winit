"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Type, Film, Briefcase, ImageIcon, MessageSquare, Link as LinkIcon, Plus,
  ArrowLeft, LogOut, Moon, Sun,
} from "lucide-react";
import { useAdmin } from "@/components/AdminProvider";
import { getAuth, signOut } from "firebase/auth";
import SaveIndicator from "../components/SaveIndicator";
import { useDarkMode } from "@/hooks/useDarkMode";
import ContentTab from "../tabs/ContentTab";
import VideosTab from "../tabs/VideosTab";
import ServicesTab from "../tabs/ServicesTab";
import BrandsTab from "../tabs/BrandsTab";
import TestimonialsTab from "../tabs/TestimonialsTab";
import SocialTab from "../tabs/SocialTab";
import BlogUsersTab from "../tabs/BlogUsersTab";
import BlogPostsTab from "../tabs/BlogPostsTab";
import Link from "next/link";
import { app } from "@/lib/firebase";

const auth = getAuth(app);

type Tab = "content" | "videos" | "services" | "brands" | "testimonials" | "social" | "blogusers" | "blogs";

const tabs: { key: Tab; label: string; icon: typeof Film }[] = [
  { key: "content", label: "Content", icon: Type },
  { key: "videos", label: "Videos", icon: Film },
  { key: "services", label: "Services", icon: Briefcase },
  { key: "brands", label: "Brands", icon: ImageIcon },
  { key: "testimonials", label: "Testimonials", icon: MessageSquare },
  { key: "social", label: "Social Links", icon: LinkIcon },
  { key: "blogusers", label: "Blog Users", icon: Plus },
  { key: "blogs", label: "Blog Posts", icon: Type },
];

export default function AdminDashboard() {
  const urlParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
  const initialTab = (urlParams?.get("tab") as Tab) || "content";
  const [tab, setTab] = useState<Tab>(tabs.find((t) => t.key === initialTab) ? initialTab : "content");
  const { saving, saveNow } = useAdmin();
  const { dark, toggle: toggleDark } = useDarkMode();

  const handleTabChange = useCallback((newTab: Tab) => {
    const url = new URL(window.location.href);
    url.searchParams.set("tab", newTab);
    window.history.pushState({}, "", url.toString());
    setTab(newTab);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        saveNow();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [saveNow]);

  return (
    <div className={`min-h-screen transition-colors ${dark ? "bg-gray-900" : "bg-gray-50"}`}>
      <header className={`${dark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} border-b sticky top-0 z-10`}>
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className={`${dark ? "text-gray-500 hover:text-gray-300" : "text-gray-400 hover:text-gray-600"} transition-colors`}>
              <ArrowLeft size={20} />
            </Link>
            <h1 className={`text-xl font-bold ${dark ? "text-white" : "text-gray-900"}`}>Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className={`text-sm ${dark ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-700"} transition-colors`}>
              View Site
            </Link>
            <button
              onClick={toggleDark}
              className={`p-2 rounded-lg transition-colors ${dark ? "text-gray-400 hover:text-yellow-400 hover:bg-gray-700" : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"}`}
              title={dark ? "Light mode" : "Dark mode"}
            >
              {dark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button
              onClick={() => signOut(auth)}
              className={`text-sm ${dark ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-700"} flex items-center gap-1 transition-colors`}
            >
              <LogOut size={14} /> Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className={`flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-thin ${dark ? "scrollbar-thumb-gray-700" : ""}`}>
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => handleTabChange(t.key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-colors whitespace-nowrap ${
                tab === t.key
                  ? "bg-brand text-white shadow-md"
                  : dark
                    ? "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200"
                    : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              <t.icon size={16} />
              {t.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {tab === "content" && <ContentTab />}
            {tab === "videos" && <VideosTab />}
            {tab === "services" && <ServicesTab />}
            {tab === "brands" && <BrandsTab />}
            {tab === "testimonials" && <TestimonialsTab />}
            {tab === "social" && <SocialTab />}
            {tab === "blogusers" && <BlogUsersTab />}
            {tab === "blogs" && <BlogPostsTab />}
          </motion.div>
        </AnimatePresence>
      </div>

      <SaveIndicator saving={saving} />
    </div>
  );
}
