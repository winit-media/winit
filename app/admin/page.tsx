"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Trash2,
  Plus,
  Film,
  Image as ImageIcon,
  MessageSquare,
  ArrowLeft,
  Type,
  Link as LinkIcon,
  Briefcase,
  Save,
  Loader2,
  LogOut,
} from "lucide-react";
import { AdminProvider, useAdmin, SiteContent } from "@/components/AdminProvider";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { app, fetchSiteContent } from "@/lib/firebase";
import Link from "next/link";

const auth = getAuth(app);

function LoginGate({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onLogin();
    } catch (err: any) {
      setError(err.message || "Login failed");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">Admin Dashboard</h1>
        <p className="text-gray-500 text-sm text-center mb-6">Sign in with your email and password</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
            required
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand text-white py-3 rounded-lg font-semibold hover:bg-brand-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

function ImageUpload({
  value,
  onChange,
  folder,
  label,
}: {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file, folder || "winit");
      onChange(url);
    } catch (err) {
      console.error("Upload failed:", err);
    }
    setUploading(false);
  };

  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      {value && (
        <img src={value} alt="" className="h-16 w-auto object-contain rounded border bg-gray-50 p-1" />
      )}
      <div className="flex items-center gap-2">
        <input
          ref={fileRef}
          type="file"
          accept="image/*,video/*"
          onChange={handleFile}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 px-3 py-2 border rounded-lg text-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
          {uploading ? "Uploading..." : "Upload File"}
        </button>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand"
          placeholder="Or paste URL"
        />
      </div>
    </div>
  );
}

function SaveIndicator({ saving }: { saving: boolean }) {
  if (!saving) return null;
  return (
    <div className="fixed bottom-4 right-4 bg-brand text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 z-50">
      <Loader2 size={14} className="animate-spin" />
      Saving...
    </div>
  );
}

type Tab = "content" | "videos" | "services" | "brands" | "testimonials" | "social";

function ContentTab() {
  const { data, updateContent } = useAdmin();
  const [local, setLocal] = useState(data);

  useEffect(() => { setLocal(data); }, [data]);

  const field = (key: keyof SiteContent, value: any) => {
    setLocal((p) => ({ ...p, [key]: value }));
  };

  const save = () => updateContent(local);

  return (
    <div className="space-y-6">
      <Section title="Page Metadata">
        <Field label="Page Title" value={local.pageTitle} onChange={(v) => field("pageTitle", v)} />
        <Field label="Page Description" value={local.pageDescription} onChange={(v) => field("pageDescription", v)} textarea />
      </Section>

      <Section title="Navbar">
        <ImageUpload label="Logo" value={local.logoUrl} onChange={(v) => field("logoUrl", v)} folder="winit/logo" />
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Navigation Links</label>
          {local.navLinks.map((link, i) => (
            <div key={i} className="flex gap-2">
              <input
                value={link.label}
                onChange={(e) => {
                  const links = [...local.navLinks];
                  links[i] = { ...links[i], label: e.target.value };
                  field("navLinks", links);
                }}
                className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                placeholder="Label"
              />
              <input
                value={link.href}
                onChange={(e) => {
                  const links = [...local.navLinks];
                  links[i] = { ...links[i], href: e.target.value };
                  field("navLinks", links);
                }}
                className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                placeholder="Anchor (e.g. #home)"
              />
              <button
                onClick={() => field("navLinks", local.navLinks.filter((_, j) => j !== i))}
                className="text-red-400 hover:text-red-600 p-2"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          <button
            onClick={() => field("navLinks", [...local.navLinks, { label: "New", href: "#" }])}
            className="flex items-center gap-1 text-sm text-brand hover:text-brand-dark font-medium"
          >
            <Plus size={14} /> Add Link
          </button>
        </div>
      </Section>

      <Section title="Hero">
        <Field label="Heading Text" value={local.heroHeading} onChange={(v) => field("heroHeading", v)} />
        <Field label="Subtext" value={local.heroSubtext} onChange={(v) => field("heroSubtext", v)} textarea />
        <Field label="CTA Button Text" value={local.heroCtaText} onChange={(v) => field("heroCtaText", v)} />
      </Section>

      <Section title="What We Do">
        <Field label='Section Title (e.g. "What we do")' value={local.whatWeDoTitle} onChange={(v) => field("whatWeDoTitle", v)} />
      </Section>

      <Section title="Our Work">
        <Field label='Section Title' value={local.carouselTitle} onChange={(v) => field("carouselTitle", v)} />
      </Section>

      <Section title="Our Brand">
        <Field label='Section Title' value={local.brandTitle} onChange={(v) => field("brandTitle", v)} />
      </Section>

      <Section title="Why Choose Us">
        <Field label='Section Title' value={local.whyChooseUsTitle} onChange={(v) => field("whyChooseUsTitle", v)} />
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">Stats</label>
          {local.stats.map((stat, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="number"
                value={stat.number}
                onChange={(e) => {
                  const stats = [...local.stats];
                  stats[i] = { ...stats[i], number: Number(e.target.value) };
                  field("stats", stats);
                }}
                className="w-20 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                placeholder="Num"
              />
              <input
                value={stat.suffix}
                onChange={(e) => {
                  const stats = [...local.stats];
                  stats[i] = { ...stats[i], suffix: e.target.value };
                  field("stats", stats);
                }}
                className="w-16 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                placeholder="Suffix"
              />
              <input
                value={stat.label}
                onChange={(e) => {
                  const stats = [...local.stats];
                  stats[i] = { ...stats[i], label: e.target.value };
                  field("stats", stats);
                }}
                className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                placeholder="Label"
              />
              <button
                onClick={() => field("stats", local.stats.filter((_, j) => j !== i))}
                className="text-red-400 hover:text-red-600 p-2"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          <button
            onClick={() => field("stats", [...local.stats, { number: 0, suffix: "+", label: "New Stat" }])}
            className="flex items-center gap-1 text-sm text-brand hover:text-brand-dark font-medium"
          >
            <Plus size={14} /> Add Stat
          </button>
        </div>
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">Reasons</label>
          {local.reasons.map((reason, i) => (
            <div key={i} className="space-y-2 p-3 bg-gray-50 rounded-lg">
              <div className="flex gap-2">
                <input
                  value={reason.title}
                  onChange={(e) => {
                    const reasons = [...local.reasons];
                    reasons[i] = { ...reasons[i], title: e.target.value };
                    field("reasons", reasons);
                  }}
                  className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                  placeholder="Title"
                />
                <button
                  onClick={() => field("reasons", local.reasons.filter((_, j) => j !== i))}
                  className="text-red-400 hover:text-red-600 p-2"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <textarea
                value={reason.desc}
                onChange={(e) => {
                  const reasons = [...local.reasons];
                  reasons[i] = { ...reasons[i], desc: e.target.value };
                  field("reasons", reasons);
                }}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                placeholder="Description"
                rows={2}
              />
            </div>
          ))}
          <button
            onClick={() => field("reasons", [...local.reasons, { title: "New Reason", desc: "" }])}
            className="flex items-center gap-1 text-sm text-brand hover:text-brand-dark font-medium"
          >
            <Plus size={14} /> Add Reason
          </button>
        </div>
      </Section>

      <Section title="Testimonials">
        <Field label='Section Title' value={local.testimonialsTitle} onChange={(v) => field("testimonialsTitle", v)} />
        <Field label='Subtitle (above title)' value={local.testimonialsSubtitle} onChange={(v) => field("testimonialsSubtitle", v)} />
      </Section>

      <Section title="Footer">
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Brand</h4>
          <Field label="Footer Title (e.g. Lets WIN-IT)" value={local.footerTitle} onChange={(v) => field("footerTitle", v)} />
          <Field label="Tagline" value={local.footerTagline} onChange={(v) => field("footerTagline", v)} textarea />
        </div>

        <div className="space-y-4 pt-4 border-t">
          <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Quick Links</h4>
          <Field label="Section Title" value={local.footerQuickLinksTitle} onChange={(v) => field("footerQuickLinksTitle", v)} />
          <div className="space-y-2">
            {local.footerQuickLinks.map((link, i) => (
              <div key={i} className="flex gap-2">
                <input
                  value={link.label}
                  onChange={(e) => {
                    const links = [...local.footerQuickLinks];
                    links[i] = { ...links[i], label: e.target.value };
                    field("footerQuickLinks", links);
                  }}
                  className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                  placeholder="Label"
                />
                <input
                  value={link.href}
                  onChange={(e) => {
                    const links = [...local.footerQuickLinks];
                    links[i] = { ...links[i], href: e.target.value };
                    field("footerQuickLinks", links);
                  }}
                  className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                  placeholder="Anchor (e.g. #home)"
                />
                <button
                  onClick={() => field("footerQuickLinks", local.footerQuickLinks.filter((_, j) => j !== i))}
                  className="text-red-400 hover:text-red-600 p-2"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            <button
              onClick={() => field("footerQuickLinks", [...local.footerQuickLinks, { label: "New", href: "#" }])}
              className="flex items-center gap-1 text-sm text-brand hover:text-brand-dark font-medium"
            >
              <Plus size={14} /> Add Link
            </button>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t">
          <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Contact Info</h4>
          <Field label="Section Title" value={local.footerContactTitle} onChange={(v) => field("footerContactTitle", v)} />
          <Field label="Phone Number" value={local.contactPhone} onChange={(v) => field("contactPhone", v)} />
          <Field label="Address" value={local.contactAddress} onChange={(v) => field("contactAddress", v)} textarea />
          <Field label="Email" value={local.contactEmail} onChange={(v) => field("contactEmail", v)} />
        </div>

        <div className="space-y-4 pt-4 border-t">
          <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Copyright</h4>
          <Field label="Copyright Text" value={local.footerCopyright} onChange={(v) => field("footerCopyright", v)} />
        </div>
      </Section>

      <button
        onClick={save}
        className="bg-brand text-white px-6 py-3 rounded-lg font-semibold hover:bg-brand-dark transition-colors flex items-center gap-2"
      >
        <Save size={16} /> Save Changes
      </button>
    </div>
  );
}

function VideosTab() {
  const { data, updateContent } = useAdmin();
  const [local, setLocal] = useState(data);
  const [videoName, setVideoName] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ name: string; percent: number }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setLocal(data); }, [data]);

  const addVideo = () => {
    if (!videoUrl.trim()) return;
    const updated = {
      ...local,
      carouselVideos: [
        ...local.carouselVideos,
        { id: Date.now().toString(), name: videoName || "Untitled", url: videoUrl.trim() },
      ],
    };
    setLocal(updated);
    updateContent(updated);
    setVideoName("");
    setVideoUrl("");
  };

  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    setUploadProgress(Array.from(files).map((f) => ({ name: f.name, percent: 0 })));
    const fileArray = Array.from(files);
    const newVideos: { id: string; name: string; url: string }[] = [];
    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];
      const name = file.name.replace(/\.[^/.]+$/, "");
      try {
        const url = await uploadToCloudinary(file, "winit/videos", (percent) => {
          setUploadProgress((prev) =>
            prev.map((p, idx) => (idx === i ? { ...p, percent } : p))
          );
        });
        newVideos.push({ id: (Date.now() + i).toString(), name, url });
        setUploadProgress((prev) =>
          prev.map((p, idx) => (idx === i ? { ...p, percent: 100 } : p))
        );
      } catch (err) {
        console.error(`Failed to upload ${file.name}:`, err);
        setUploadProgress((prev) =>
          prev.map((p, idx) => (idx === i ? { ...p, percent: -1 } : p))
        );
      }
    }
    if (newVideos.length > 0) {
      const updated = { ...local, carouselVideos: [...local.carouselVideos, ...newVideos] };
      setLocal(updated);
      updateContent(updated);
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeVideo = (id: string) => {
    const updated = {
      ...local,
      carouselVideos: local.carouselVideos.filter((v) => v.id !== id),
    };
    setLocal(updated);
    updateContent(updated);
  };

  return (
    <div className="space-y-6">
      <Section title="Default Fallback Video">
        <Field
          label="Fallback Video URL"
          value={local.defaultVideoUrl}
          onChange={(v) => {
            setLocal((p) => ({ ...p, defaultVideoUrl: v }));
          }}
        />
        <button
          onClick={() => updateContent({ defaultVideoUrl: local.defaultVideoUrl })}
          className="bg-brand text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-dark transition-colors flex items-center gap-2"
        >
          <Save size={14} /> Save
        </button>
      </Section>

      <Section title="Add Video">
        <Field label="Video Name" value={videoName} onChange={setVideoName} placeholder="Campaign name" />
        <Field label="Video URL" value={videoUrl} onChange={setVideoUrl} placeholder="Cloudinary or direct link" />
        <button
          onClick={addVideo}
          className="bg-brand text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-dark transition-colors flex items-center gap-2"
        >
          <Plus size={14} /> Add
        </button>
      </Section>

      <Section title="Bulk Upload Videos">
        <p className="text-sm text-gray-500 mb-2">Select multiple video files to upload at once</p>
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          multiple
          onChange={handleBulkUpload}
          className="hidden"
          id="bulk-video-upload"
        />
        <label
          htmlFor="bulk-video-upload"
          className={`flex items-center justify-center gap-2 w-full px-4 py-6 border-2 border-dashed rounded-lg transition-colors cursor-pointer ${
            uploading
              ? "bg-gray-50 border-gray-300 cursor-not-allowed"
              : "border-brand/40 hover:border-brand hover:bg-brand/5"
          }`}
        >
          {uploading ? (
            <Loader2 size={20} className="animate-spin text-brand" />
          ) : (
            <Upload size={20} className="text-brand" />
          )}
          <span className="text-sm font-medium text-gray-700">
            {uploading ? "Uploading..." : "Click or drag to upload videos"}
          </span>
        </label>
        {uploadProgress.length > 0 && (
          <div className="mt-3 space-y-2">
            {uploadProgress.map((p, i) => (
              <div key={i} className="flex items-center gap-3">
                <Film size={14} className="text-gray-400 flex-shrink-0" />
                <span className="text-xs text-gray-600 truncate flex-1">{p.name}</span>
                {p.percent === -1 ? (
                  <span className="text-xs text-red-500">Failed</span>
                ) : p.percent === 100 ? (
                  <span className="text-xs text-green-600">Done</span>
                ) : (
                  <span className="text-xs text-brand">{p.percent}%</span>
                )}
                {p.percent > 0 && p.percent < 100 && p.percent !== -1 && (
                  <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand rounded-full transition-all duration-200"
                      style={{ width: `${p.percent}%` }}
                    />
                  </div>
                )}
              </div>
            ))}
            {!uploading && (
              <button
                onClick={() => setUploadProgress([])}
                className="text-xs text-gray-400 hover:text-gray-600 mt-1"
              >
                Clear
              </button>
            )}
          </div>
        )}
      </Section>

      <Section title={`Carousel Videos (${local.carouselVideos.length})`}>
        {local.carouselVideos.length === 0 ? (
          <p className="text-gray-400 text-sm">No videos added yet</p>
        ) : (
          <div className="space-y-2">
            {local.carouselVideos.map((v) => (
              <div key={v.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  {v.url ? (
                    <video
                      src={v.url}
                      className="h-12 w-16 object-cover rounded border bg-gray-900"
                      muted
                      preload="metadata"
                    />
                  ) : (
                    <Film size={16} className="text-gray-400" />
                  )}
                  <div>
                    <p className="font-medium text-sm">{v.name}</p>
                    <p className="text-xs text-gray-400 truncate max-w-[300px]">{v.url}</p>
                  </div>
                </div>
                <button onClick={() => removeVideo(v.id)} className="text-red-400 hover:text-red-600 p-1">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </Section>
    </div>
  );
}

function ServicesTab() {
  const { data, updateContent } = useAdmin();
  const [local, setLocal] = useState(data);
  const [editing, setEditing] = useState<number | null>(null);

  useEffect(() => { setLocal(data); }, [data]);

  const update = (index: number, key: string, value: string) => {
    const services = [...local.services];
    (services[index] as any)[key] = value;
    setLocal((p) => ({ ...p, services }));
  };

  const remove = (index: number) => {
    const updated = { ...local, services: local.services.filter((_, i) => i !== index) };
    setLocal(updated);
    updateContent(updated);
  };

  const add = () => {
    const updated = {
      ...local,
      services: [...local.services, { sub: "New Service", content: "", bg: "bg-gray-400" }],
    };
    setLocal(updated);
    updateContent(updated);
    setEditing(updated.services.length - 1);
  };

  const saveService = (index: number) => {
    updateContent({ services: local.services });
    setEditing(null);
  };

  const bgOptions = [
    "bg-blue-500", "bg-red-500", "bg-purple-400", "bg-pink-400",
    "bg-orange-400", "bg-green-400", "bg-yellow-400", "bg-teal-400",
    "bg-indigo-400", "bg-cyan-400",
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-lg">Services ({local.services.length})</h3>
        <button
          onClick={add}
          className="bg-brand text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-dark transition-colors flex items-center gap-2"
        >
          <Plus size={14} /> Add Service
        </button>
      </div>

      {local.services.map((s, i) => (
        <div key={i} className="bg-white rounded-xl p-5 shadow-sm border">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded ${s.bg}`} />
              <span className="font-semibold text-sm">{s.sub}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setEditing(editing === i ? null : i)}
                className="text-brand hover:text-brand-dark text-sm font-medium"
              >
                {editing === i ? "Close" : "Edit"}
              </button>
              <button onClick={() => remove(i)} className="text-red-400 hover:text-red-600 p-1">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
          {editing === i && (
            <div className="space-y-3 pt-3 border-t">
              <Field label="Service Name" value={s.sub} onChange={(v) => update(i, "sub", v)} />
              <Field label="Description" value={s.content} onChange={(v) => update(i, "content", v)} textarea />
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Background Color</label>
                <div className="flex gap-2 flex-wrap">
                  {bgOptions.map((bg) => (
                    <button
                      key={bg}
                      onClick={() => update(i, "bg", bg)}
                      className={`w-8 h-8 rounded-lg ${bg} ${s.bg === bg ? "ring-2 ring-offset-2 ring-brand" : ""} transition-all`}
                    />
                  ))}
                </div>
              </div>
              <button
                onClick={() => saveService(i)}
                className="bg-brand text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-dark transition-colors flex items-center gap-2"
              >
                <Save size={14} /> Save Service
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function BrandsTab() {
  const { data, updateContent } = useAdmin();
  const [local, setLocal] = useState(data);

  useEffect(() => { setLocal(data); }, [data]);

  const add = () => {
    const updated = {
      ...local,
      brands: [...local.brands, { id: Date.now().toString(), name: "", imageUrl: "", link: "" }],
    };
    setLocal(updated);
    updateContent(updated);
  };

  const updateField = (id: string, field: string, value: string) => {
    const brands = local.brands.map((b) => (b.id === id ? { ...b, [field]: value } : b));
    setLocal((p) => ({ ...p, brands }));
    updateContent({ brands });
  };

  const remove = (id: string) => {
    const updated = { ...local, brands: local.brands.filter((b) => b.id !== id) };
    setLocal(updated);
    updateContent(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Brands ({local.brands.length})</h3>
        <button
          onClick={add}
          className="bg-brand text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-dark transition-colors flex items-center gap-2"
        >
          <Plus size={14} /> Add Brand
        </button>
      </div>

      {local.brands.length === 0 ? (
        <p className="text-gray-400 text-sm">No brands added yet</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {local.brands.map((b) => (
            <div key={b.id} className="bg-gray-50 rounded-lg p-4 relative group">
              <button
                onClick={() => remove(b.id)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={12} />
              </button>

              {b.imageUrl && (
                <img src={b.imageUrl} alt={b.name} className="h-16 w-auto object-contain mb-3 mx-auto" />
              )}

              <ImageUpload
                value={b.imageUrl}
                onChange={(v) => updateField(b.id, "imageUrl", v)}
                folder="winit/brands"
              />

              <input
                value={b.name}
                onChange={(e) => updateField(b.id, "name", e.target.value)}
                className="w-full mt-3 px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                placeholder="Brand name"
              />

              <input
                value={b.link || ""}
                onChange={(e) => updateField(b.id, "link", e.target.value)}
                className="w-full mt-2 px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                placeholder="Link (https://...)"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TestimonialsTab() {
  const { data, updateContent } = useAdmin();
  const [local, setLocal] = useState(data);
  const [editing, setEditing] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    name: "", designation: "", company: "", service: "", review: "", website: "", logoUrl: "",
  });
  const [form, setForm] = useState({
    name: "", designation: "", company: "", service: "", review: "", website: "", logoUrl: "",
  });

  useEffect(() => { setLocal(data); }, [data]);

  const startEdit = (t: SiteContent["testimonials"][0]) => {
    setEditing(t.id);
    setEditForm({
      name: t.name,
      designation: t.designation,
      company: t.company,
      service: t.service,
      review: t.review,
      website: t.website,
      logoUrl: t.logoUrl,
    });
  };

  const saveEdit = (id: string) => {
    const updated = {
      ...local,
      testimonials: local.testimonials.map((t) =>
        t.id === id ? { ...t, ...editForm } : t
      ),
    };
    setLocal(updated);
    updateContent(updated);
    setEditing(null);
  };

  const add = () => {
    if (!form.name.trim() || !form.review.trim()) return;
    const updated = {
      ...local,
      testimonials: [...local.testimonials, { id: Date.now().toString(), ...form }],
    };
    setLocal(updated);
    updateContent(updated);
    setForm({ name: "", designation: "", company: "", service: "", review: "", website: "", logoUrl: "" });
  };

  const remove = (id: string) => {
    const updated = { ...local, testimonials: local.testimonials.filter((t) => t.id !== id) };
    setLocal(updated);
    updateContent(updated);
  };

  return (
    <div className="space-y-6">
      <Section title="Add Testimonial">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {(["name", "designation", "company", "service", "website"] as const).map((key) => (
            <Field
              key={key}
              label={key.charAt(0).toUpperCase() + key.slice(1)}
              value={form[key]}
              onChange={(v) => setForm((p) => ({ ...p, [key]: v }))}
              placeholder={key === "name" ? "Name *" : ""}
            />
          ))}
          <div className="sm:col-span-2">
            <ImageUpload
              label="Company Logo"
              value={form.logoUrl}
              onChange={(v) => setForm((p) => ({ ...p, logoUrl: v }))}
              folder="winit/testimonials"
            />
          </div>
          <div className="sm:col-span-2">
            <Field
              label="Review *"
              value={form.review}
              onChange={(v) => setForm((p) => ({ ...p, review: v }))}
              textarea
            />
          </div>
        </div>
        <button
          onClick={add}
          className="bg-brand text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-dark transition-colors flex items-center gap-2"
        >
          <Plus size={14} /> Add Testimonial
        </button>
      </Section>

      <Section title={`Testimonials (${local.testimonials.length})`}>
        {local.testimonials.length === 0 ? (
          <p className="text-gray-400 text-sm">No testimonials added yet</p>
        ) : (
          <div className="space-y-3">
            {local.testimonials.map((t) => (
              <div key={t.id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.designation} at {t.company}</p>
                    <p className="text-xs text-brand mt-1">Service: {t.service}</p>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-2">{t.review}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-3 flex-shrink-0">
                    <button
                      onClick={() => editing === t.id ? setEditing(null) : startEdit(t)}
                      className="text-brand hover:text-brand-dark text-sm font-medium"
                    >
                      {editing === t.id ? "Close" : "Edit"}
                    </button>
                    <button onClick={() => remove(t.id)} className="text-red-400 hover:text-red-600 p-1">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {editing === t.id && (
                  <div className="mt-4 pt-4 border-t space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {(["name", "designation", "company", "service", "website"] as const).map((key) => (
                        <Field
                          key={key}
                          label={key.charAt(0).toUpperCase() + key.slice(1)}
                          value={editForm[key]}
                          onChange={(v) => setEditForm((p) => ({ ...p, [key]: v }))}
                        />
                      ))}
                      <div className="sm:col-span-2">
                        <ImageUpload
                          label="Company Logo"
                          value={editForm.logoUrl}
                          onChange={(v) => setEditForm((p) => ({ ...p, logoUrl: v }))}
                          folder="winit/testimonials"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <Field
                          label="Review"
                          value={editForm.review}
                          onChange={(v) => setEditForm((p) => ({ ...p, review: v }))}
                          textarea
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => saveEdit(t.id)}
                      className="bg-brand text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-dark transition-colors flex items-center gap-2"
                    >
                      <Save size={14} /> Save Changes
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Section>
    </div>
  );
}

function SocialTab() {
  const { data, updateContent } = useAdmin();
  const [local, setLocal] = useState(data);

  useEffect(() => { setLocal(data); }, [data]);

  const update = (i: number, key: string, value: string) => {
    const links = [...local.socialLinks];
    (links[i] as any)[key] = value;
    setLocal((p) => ({ ...p, socialLinks: links }));
  };

  const add = () => {
    setLocal((p) => ({
      ...p,
      socialLinks: [...p.socialLinks, { label: "New Platform", href: "#" }],
    }));
  };

  const remove = (i: number) => {
    setLocal((p) => ({
      ...p,
      socialLinks: p.socialLinks.filter((_, j) => j !== i),
    }));
  };

  return (
    <div className="space-y-6">
      <Section title="Social Media Links">
        <div className="space-y-3">
          {local.socialLinks.map((link, i) => (
            <div key={i} className="flex gap-2">
              <input
                value={link.label}
                onChange={(e) => update(i, "label", e.target.value)}
                className="w-40 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                placeholder="Platform"
              />
              <input
                value={link.href}
                onChange={(e) => update(i, "href", e.target.value)}
                className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                placeholder="https://..."
              />
              <button onClick={() => remove(i)} className="text-red-400 hover:text-red-600 p-2">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-3 mt-3">
          <button
            onClick={add}
            className="flex items-center gap-1 text-sm text-brand hover:text-brand-dark font-medium"
          >
            <Plus size={14} /> Add Link
          </button>
          <button
            onClick={() => updateContent({ socialLinks: local.socialLinks })}
            className="bg-brand text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-dark transition-colors flex items-center gap-2"
          >
            <Save size={14} /> Save
          </button>
        </div>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h3 className="font-bold text-lg mb-4">{title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  textarea,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700 mb-1 block">{label}</label>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
          rows={3}
          placeholder={placeholder}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
          placeholder={placeholder}
        />
      )}
    </div>
  );
}

function AdminDashboard() {
  const [tab, setTab] = useState<Tab>("content");
  const { saving } = useAdmin();

  const tabs: { key: Tab; label: string; icon: typeof Film }[] = [
    { key: "content", label: "Content", icon: Type },
    { key: "videos", label: "Videos", icon: Film },
    { key: "services", label: "Services", icon: Briefcase },
    { key: "brands", label: "Brands", icon: ImageIcon },
    { key: "testimonials", label: "Testimonials", icon: MessageSquare },
    { key: "social", label: "Social Links", icon: LinkIcon },
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
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
              View Site
            </Link>
            <button
              onClick={() => signOut(auth)}
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
            >
              <LogOut size={14} /> Sign Out
            </button>
          </div>
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
            {tab === "content" && <ContentTab />}
            {tab === "videos" && <VideosTab />}
            {tab === "services" && <ServicesTab />}
            {tab === "brands" && <BrandsTab />}
            {tab === "testimonials" && <TestimonialsTab />}
            {tab === "social" && <SocialTab />}
          </motion.div>
        </AnimatePresence>
      </div>

      <SaveIndicator saving={saving} />
    </div>
  );
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [siteData, setSiteData] = useState<SiteContent | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthed(!!user);
      setChecking(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (authed) {
      fetchSiteContent().then(setSiteData);
    }
  }, [authed]);

  if (checking || (authed && !siteData)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-brand" />
      </div>
    );
  }

  if (!authed) {
    return <LoginGate onLogin={() => setAuthed(true)} />;
  }

  return (
    <AdminProvider initialData={siteData!}>
      <AdminDashboard />
    </AdminProvider>
  );
}
