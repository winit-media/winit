"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Trash2,
  Plus,
  Film,
  Image,
  MessageSquare,
  LogOut,
  ArrowLeft,
  GripVertical,
} from "lucide-react";
import { AdminProvider, useAdmin, Brand, Testimonial, CarouselVideo } from "@/components/AdminProvider";
import Link from "next/link";

function LoginGate({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "winit2024") {
      localStorage.setItem("winit-admin-auth", "true");
      onLogin();
    } else {
      setError("Invalid password");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">Admin Dashboard</h1>
        <p className="text-gray-500 text-sm text-center mb-6">Enter password to continue</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-brand text-white py-3 rounded-lg font-semibold hover:bg-brand-dark transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

function VideoManager() {
  const { data, addCarouselVideo, removeCarouselVideo, setDefaultVideoUrl } = useAdmin();
  const [videoUrl, setVideoUrl] = useState("");
  const [videoName, setVideoName] = useState("");

  const handleAdd = () => {
    if (!videoUrl.trim()) return;
    addCarouselVideo({
      id: Date.now().toString(),
      name: videoName || "Untitled",
      url: videoUrl.trim(),
    });
    setVideoUrl("");
    setVideoName("");
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="font-bold text-lg mb-4">Default Fallback Video</h3>
        <p className="text-sm text-gray-500 mb-3">Current: {data.defaultVideoUrl}</p>
        <div className="flex gap-2">
          <input
            type="text"
            value={data.defaultVideoUrl}
            onChange={(e) => setDefaultVideoUrl(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
            placeholder="/fallback-video.mp4"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="font-bold text-lg mb-4">Add Carousel Video</h3>
        <div className="space-y-3">
          <input
            type="text"
            value={videoName}
            onChange={(e) => setVideoName(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
            placeholder="Video name"
          />
          <input
            type="text"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
            placeholder="Video URL (Cloudinary or direct link)"
          />
          <button
            onClick={handleAdd}
            className="bg-brand text-white px-6 py-2 rounded-lg font-medium hover:bg-brand-dark transition-colors flex items-center gap-2"
          >
            <Plus size={16} /> Add Video
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="font-bold text-lg mb-4">Carousel Videos ({data.carouselVideos.length})</h3>
        {data.carouselVideos.length === 0 ? (
          <p className="text-gray-400 text-sm">No videos added yet</p>
        ) : (
          <div className="space-y-2">
            {data.carouselVideos.map((v) => (
              <div key={v.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Film size={16} className="text-gray-400" />
                  <div>
                    <p className="font-medium text-sm">{v.name}</p>
                    <p className="text-xs text-gray-400 truncate max-w-[300px]">{v.url}</p>
                  </div>
                </div>
                <button
                  onClick={() => removeCarouselVideo(v.id)}
                  className="text-red-400 hover:text-red-600 p-1"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function BrandManager() {
  const { data, addBrand, removeBrand } = useAdmin();
  const [brandName, setBrandName] = useState("");
  const [brandImage, setBrandImage] = useState("");

  const handleAdd = () => {
    if (!brandName.trim() || !brandImage.trim()) return;
    addBrand({
      id: Date.now().toString(),
      name: brandName.trim(),
      imageUrl: brandImage.trim(),
    });
    setBrandName("");
    setBrandImage("");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setBrandImage(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="font-bold text-lg mb-4">Add Brand</h3>
        <div className="space-y-3">
          <input
            type="text"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
            placeholder="Brand name"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
          />
          <p className="text-xs text-gray-400">Or paste an image URL:</p>
          <input
            type="text"
            value={brandImage}
            onChange={(e) => setBrandImage(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
            placeholder="Image URL"
          />
          <button
            onClick={handleAdd}
            className="bg-brand text-white px-6 py-2 rounded-lg font-medium hover:bg-brand-dark transition-colors flex items-center gap-2"
          >
            <Plus size={16} /> Add Brand
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="font-bold text-lg mb-4">Brands ({data.brands.length})</h3>
        {data.brands.length === 0 ? (
          <p className="text-gray-400 text-sm">No brands added yet</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {data.brands.map((b) => (
              <div key={b.id} className="relative group bg-gray-50 rounded-lg p-4 flex flex-col items-center">
                <img src={b.imageUrl} alt={b.name} className="h-16 w-auto object-contain mb-2" />
                <p className="text-xs font-medium text-gray-600 text-center">{b.name}</p>
                <button
                  onClick={() => removeBrand(b.id)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TestimonialManager() {
  const { data, addTestimonial, removeTestimonial } = useAdmin();
  const [form, setForm] = useState({
    name: "",
    designation: "",
    company: "",
    service: "",
    review: "",
    website: "",
    logoUrl: "",
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAdd = () => {
    if (!form.name.trim() || !form.review.trim()) return;
    addTestimonial({ id: Date.now().toString(), ...form });
    setForm({ name: "", designation: "", company: "", service: "", review: "", website: "", logoUrl: "" });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="font-bold text-lg mb-4">Add Testimonial</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { key: "name", label: "Name", required: true },
            { key: "designation", label: "Designation" },
            { key: "company", label: "Company" },
            { key: "service", label: "Service" },
            { key: "website", label: "Website URL" },
            { key: "logoUrl", label: "Company Logo URL" },
          ].map((field) => (
            <input
              key={field.key}
              type="text"
              value={(form as any)[field.key]}
              onChange={(e) => handleChange(field.key, e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
              placeholder={field.label + (field.required ? " *" : "")}
            />
          ))}
          <textarea
            value={form.review}
            onChange={(e) => handleChange("review", e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand sm:col-span-2"
            placeholder="Review *"
            rows={3}
          />
        </div>
        <button
          onClick={handleAdd}
          className="mt-3 bg-brand text-white px-6 py-2 rounded-lg font-medium hover:bg-brand-dark transition-colors flex items-center gap-2"
        >
          <Plus size={16} /> Add Testimonial
        </button>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="font-bold text-lg mb-4">Testimonials ({data.testimonials.length})</h3>
        {data.testimonials.length === 0 ? (
          <p className="text-gray-400 text-sm">No testimonials added yet</p>
        ) : (
          <div className="space-y-3">
            {data.testimonials.map((t) => (
              <div key={t.id} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-sm">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.designation} at {t.company}</p>
                  <p className="text-xs text-brand mt-1">Service: {t.service}</p>
                  <p className="text-xs text-gray-400 mt-1 line-clamp-2">{t.review}</p>
                </div>
                <button
                  onClick={() => removeTestimonial(t.id)}
                  className="text-red-400 hover:text-red-600 p-1 ml-3 flex-shrink-0"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

type Tab = "videos" | "brands" | "testimonials";

function AdminDashboard() {
  const [tab, setTab] = useState<Tab>("videos");

  const tabs: { key: Tab; label: string; icon: typeof Film }[] = [
    { key: "videos", label: "Videos", icon: Film },
    { key: "brands", label: "Brands", icon: Image },
    { key: "testimonials", label: "Testimonials", icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-gray-400 hover:text-gray-600">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
          </div>
          <Link
            href="/"
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
          >
            View Site
          </Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-colors whitespace-nowrap ${
                tab === t.key
                  ? "bg-brand text-white"
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
            {tab === "videos" && <VideoManager />}
            {tab === "brands" && <BrandManager />}
            {tab === "testimonials" && <TestimonialManager />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("winit-admin-auth");
    if (stored === "true") setAuthed(true);
    setChecking(true);
  }, []);

  if (!checking) return null;

  if (!authed) {
    return <LoginGate onLogin={() => setAuthed(true)} />;
  }

  return (
    <AdminProvider>
      <AdminDashboard />
    </AdminProvider>
  );
}
