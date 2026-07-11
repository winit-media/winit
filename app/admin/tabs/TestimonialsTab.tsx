"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useAdmin, SiteContent } from "@/components/AdminProvider";
import { Section, Field } from "../components/FormElements";
import ImageUpload from "../components/ImageUpload";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";

type Testimonial = SiteContent["testimonials"][0];

export default function TestimonialsTab() {
  const { data, updateContent } = useAdmin();
  const [local, setLocal] = useState(data);
  const [editing, setEditing] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    name: "", designation: "", company: "", service: "", review: "", website: "", logoUrl: "",
  });
  const [form, setForm] = useState({
    name: "", designation: "", company: "", service: "", review: "", website: "", logoUrl: "",
  });
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { toast } = useToast();

  const startEdit = (t: Testimonial) => {
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
    toast("Testimonial updated", "success");
  };

  const add = () => {
    if (!form.name.trim() || !form.review.trim()) {
      toast("Name and review are required", "error");
      return;
    }
    const updated = {
      ...local,
      testimonials: [...local.testimonials, { id: crypto.randomUUID(), ...form }],
    };
    setLocal(updated);
    updateContent(updated);
    setForm({ name: "", designation: "", company: "", service: "", review: "", website: "", logoUrl: "" });
    toast("Testimonial added", "success");
  };

  const remove = (id: string) => {
    const updated = { ...local, testimonials: local.testimonials.filter((t) => t.id !== id) };
    setLocal(updated);
    updateContent(updated);
    toast("Testimonial removed", "success");
    setDeleteId(null);
  };

  return (
    <div className="space-y-6">
      <Section title="Add Testimonial">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {(["name", "designation", "company", "service", "website"] as const).map((key) => (
            <Field
              key={key}
              label={key.charAt(0).toUpperCase() + key.slice(1) + (key === "name" ? " *" : "")}
              value={form[key]}
              onChange={(v) => setForm((p) => ({ ...p, [key]: v }))}
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
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.designation} at {t.company}</p>
                    <p className="text-xs text-brand mt-1">Service: {t.service}</p>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-2">{t.review}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-3 shrink-0">
                    <button
                      onClick={() => editing === t.id ? setEditing(null) : startEdit(t)}
                      className="text-brand hover:text-brand-dark text-sm font-medium px-2 py-1 rounded hover:bg-brand/5 transition-colors"
                    >
                      {editing === t.id ? "Close" : "Edit"}
                    </button>
                    <button
                      onClick={() => setDeleteId(t.id)}
                      className="text-red-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition-colors"
                    >
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
                      Save Changes
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Section>

      <ConfirmDialog
        open={deleteId !== null}
        title="Delete Testimonial"
        message="Are you sure you want to delete this testimonial? This action cannot be undone."
        onConfirm={() => deleteId && remove(deleteId)}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
