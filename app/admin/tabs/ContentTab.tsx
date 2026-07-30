"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useAdmin, SiteContent } from "@/components/AdminProvider";
import { Section, Field } from "../components/FormElements";
import ImageUpload from "../components/ImageUpload";
import { SaveButton } from "../components/SaveIndicator";
import DragReorder from "@/components/ui/DragReorder";

export default function ContentTab() {
  const { data, updateContent, revertedCount } = useAdmin();
  const [local, setLocal] = useState(data);
  const [prevReverted, setPrevReverted] = useState(revertedCount);

  if (revertedCount !== prevReverted) {
    setPrevReverted(revertedCount);
    setLocal(data);
  }

  const field = (key: keyof SiteContent, value: unknown) => {
    setLocal((p) => ({ ...p, [key]: value }));
  };

  const save = () => updateContent(local);

  return (
    <div className="space-y-6">
      <Section title="Page Metadata">
        <Field label="Page Title" value={local.pageTitle} onChange={(v) => field("pageTitle", v)} showCount maxLength={60} hint="Appears as the browser tab title & the default Google headline. 50–60 chars — lead with your core service + location (e.g. 'Influencer Marketing Agency in Delhi | WinIt')." />
        <Field label="Page Description" value={local.pageDescription} onChange={(v) => field("pageDescription", v)} textarea showCount maxLength={160} hint="The homepage meta description in Google search results. 140–160 chars — summarise what WinIt does, where (New Delhi), and a reason to click." />
      </Section>

      <Section title="Navbar">
        <ImageUpload label="Logo" value={local.logoUrl} onChange={(v) => field("logoUrl", v)} folder="winit/logo" />
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Navigation Links</label>
          <DragReorder
            items={local.navLinks}
            onReorder={(links) => field("navLinks", links)}
            keyExtractor={(link, i) => `${link.href}-${i}`}
            renderItem={(link, i, handle) => (
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  {handle}
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
                    className="text-red-400 hover:text-red-600 p-2 rounded-md hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <input
                  value={link.description ?? ""}
                  onChange={(e) => {
                    const links = [...local.navLinks];
                    links[i] = { ...links[i], description: e.target.value };
                    field("navLinks", links);
                  }}
                  className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand ml-8"
                  placeholder="Description (for SEO, optional)"
                />
              </div>
            )}
          />
          <button
            onClick={() => field("navLinks", [...local.navLinks, { label: "New", href: "", description: "" }])}
            className="flex items-center gap-1 text-sm text-brand hover:text-brand-dark font-medium"
          >
            <Plus size={14} /> Add Link
          </button>
        </div>
      </Section>

      <Section title="Hero">
        <Field label="Heading Text" value={local.heroHeading} onChange={(v) => field("heroHeading", v)} showCount maxLength={100} />
        <Field label="Subtext" value={local.heroSubtext} onChange={(v) => field("heroSubtext", v)} textarea showCount maxLength={500} />
        <Field label="CTA Button Text" value={local.heroCtaText} onChange={(v) => field("heroCtaText", v)} showCount maxLength={30} />
      </Section>

      <Section title="What We Do">
        <Field label='Section Title (e.g. "What we do")' value={local.whatWeDoTitle} onChange={(v) => field("whatWeDoTitle", v)} />
      </Section>

      <Section title="Our Work">
        <Field label="Section Title" value={local.carouselTitle} onChange={(v) => field("carouselTitle", v)} />
      </Section>

      <Section title="Our Brand">
        <Field label="Section Title" value={local.brandTitle} onChange={(v) => field("brandTitle", v)} />
      </Section>

      <Section title="Why Choose Us">
        <Field label="Section Title" value={local.whyChooseUsTitle} onChange={(v) => field("whyChooseUsTitle", v)} />
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">Stats</label>
          <DragReorder
            items={local.stats}
            onReorder={(stats) => field("stats", stats)}
            keyExtractor={(_, i) => `stat-${i}`}
            renderItem={(stat, i, handle) => (
              <div className="flex items-center gap-2">
                {handle}
                <input
                  type="number"
                  value={stat.number}
                  onChange={(e) => {
                    const stats = [...local.stats];
                    stats[i] = { ...stats[i], number: Number(e.target.value) };
                    field("stats", stats);
                  }}
                  className="w-24 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                  placeholder="Number"
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
                  className="text-red-400 hover:text-red-600 p-2 rounded-md hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            )}
          />
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
                  className="text-red-400 hover:text-red-600 p-2 rounded-md hover:bg-red-50 transition-colors"
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
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand resize-y"
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
        <Field label="Section Title" value={local.testimonialsTitle} onChange={(v) => field("testimonialsTitle", v)} />
        <Field label="Subtitle (above title)" value={local.testimonialsSubtitle} onChange={(v) => field("testimonialsSubtitle", v)} />
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
          <DragReorder
            items={local.footerQuickLinks}
            onReorder={(links) => field("footerQuickLinks", links)}
            keyExtractor={(link, i) => `${link.href}-${i}`}
            renderItem={(link, i, handle) => (
              <div className="flex items-center gap-2">
                {handle}
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
                  className="text-red-400 hover:text-red-600 p-2 rounded-md hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            )}
          />
          <button
            onClick={() => field("footerQuickLinks", [...local.footerQuickLinks, { label: "New", href: "" }])}
            className="flex items-center gap-1 text-sm text-brand hover:text-brand-dark font-medium"
          >
            <Plus size={14} /> Add Link
          </button>
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

      <div className="flex justify-end">
        <SaveButton onClick={save} />
      </div>
    </div>
  );
}
