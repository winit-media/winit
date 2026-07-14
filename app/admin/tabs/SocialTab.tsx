"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useAdmin } from "@/components/AdminProvider";
import { Section } from "../components/FormElements";
import { SaveButton } from "../components/SaveIndicator";
import DragReorder from "@/components/ui/DragReorder";
import { useToast } from "@/components/ui/Toast";

export default function SocialTab() {
  const { data, updateContent, revertedCount } = useAdmin();
  const [local, setLocal] = useState(data);
  const [prevReverted, setPrevReverted] = useState(revertedCount);

  if (revertedCount !== prevReverted) {
    setPrevReverted(revertedCount);
    setLocal(data);
  }
  const { toast } = useToast();

  const update = (i: number, key: "label" | "href", value: string) => {
    setLocal((p) => {
      const links = p.socialLinks.map((link, idx) =>
        idx === i ? { ...link, [key]: value } : link
      );
      return { ...p, socialLinks: links };
    });
  };

  const save = () => {
    updateContent({ socialLinks: local.socialLinks });
    toast("Social links saved", "success");
  };

  const add = () => {
    const updated = {
      ...local,
      socialLinks: [...local.socialLinks, { label: "New Platform", href: "#" }],
    };
    setLocal(updated);
    updateContent(updated);
  };

  const remove = (i: number) => {
    const updated = {
      ...local,
      socialLinks: local.socialLinks.filter((_, j) => j !== i),
    };
    setLocal(updated);
    updateContent(updated);
    toast("Social link removed", "success");
  };

  const handleReorder = (newLinks: typeof local.socialLinks) => {
    setLocal((p) => ({ ...p, socialLinks: newLinks }));
    updateContent({ socialLinks: newLinks });
  };

  return (
    <div className="space-y-6">
      <Section
        title="Social Media Links"
        actions={
          <SaveButton onClick={save} size="sm" label="Save" />
        }
      >
        <DragReorder
          items={local.socialLinks}
          onReorder={handleReorder}
          keyExtractor={(link, i) => `${link.label}-${i}`}
          renderItem={(link, i, handle) => (
            <div className="flex items-center gap-2">
              {handle}
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
              <button
                onClick={() => remove(i)}
                className="text-red-400 hover:text-red-600 p-2 rounded-md hover:bg-red-50 transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>
          )}
        />
        <button
          onClick={add}
          className="flex items-center gap-1 text-sm text-brand hover:text-brand-dark font-medium mt-2"
        >
          <Plus size={14} /> Add Link
        </button>
      </Section>
    </div>
  );
}
