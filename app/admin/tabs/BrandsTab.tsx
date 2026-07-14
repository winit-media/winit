"use client";

import { useState, useRef } from "react";
import { Plus, ImageIcon, Loader2 } from "lucide-react";
import { useAdmin } from "@/components/AdminProvider";
import { uploadToCloudinary } from "@/lib/cloudinary";
import DragReorder from "@/components/ui/DragReorder";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";
import { uid } from "@/lib/uid";

function BrandRow({
  brand,
  onUpdate,
  onRemove,
}: {
  brand: { id: string; name: string; imageUrl: string; link?: string };
  onUpdate: (field: string, value: string) => void;
  onRemove: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file, "winit/brands");
      onUpdate("imageUrl", url);
    } catch (err) {
      console.error("Upload failed:", err);
    }
    setUploading(false);
  };

  return (
    <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 group">
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="hidden"
      />
      <button
        onClick={() => fileRef.current?.click()}
        disabled={uploading}
        className="shrink-0 w-10 h-10 rounded border bg-white flex items-center justify-center overflow-hidden hover:border-brand transition-colors"
        title="Click to upload"
      >
        {uploading ? (
          <Loader2 size={14} className="animate-spin text-gray-400" />
        ) : brand.imageUrl ? (
          <img src={brand.imageUrl} alt={brand.name || "Brand logo"} className="w-full h-full object-contain" />
        ) : (
          <ImageIcon size={14} className="text-gray-300" />
        )}
      </button>
      <input
        value={brand.name}
        onChange={(e) => onUpdate("name", e.target.value)}
        className="w-32 px-2 py-1 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-brand bg-white"
        placeholder="Brand name"
      />
      <input
        value={brand.imageUrl}
        onChange={(e) => onUpdate("imageUrl", e.target.value)}
        className="flex-1 min-w-0 px-2 py-1 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-brand bg-white"
        placeholder="Image URL"
      />
      <button
        onClick={onRemove}
        className="shrink-0 text-red-400 hover:text-red-600 p-1 opacity-0 group-hover:opacity-100 transition-opacity rounded hover:bg-red-50"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
        </svg>
      </button>
    </div>
  );
}

export default function BrandsTab() {
  const { data, updateContent, revertedCount } = useAdmin();
  const [local, setLocal] = useState(data);
  const [prevReverted, setPrevReverted] = useState(revertedCount);

  if (revertedCount !== prevReverted) {
    setPrevReverted(revertedCount);
    setLocal(data);
  }
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { toast } = useToast();

  const add = () => {
    const updated = {
      ...local,
      brands: [{ id: uid(), name: "", imageUrl: "", link: "" }, ...local.brands],
    };
    setLocal(updated);
    updateContent(updated);
  };

  const updateField = (id: string, field: string, value: string) => {
    setLocal((p) => {
      const brands = p.brands.map((b) => (b.id === id ? { ...b, [field]: value } : b));
      updateContent({ brands }, true);
      return { ...p, brands };
    });
  };

  const remove = (id: string) => {
    const updated = { ...local, brands: local.brands.filter((b) => b.id !== id) };
    setLocal(updated);
    updateContent(updated);
    toast("Brand removed", "success");
    setDeleteId(null);
  };

  const handleReorder = (newBrands: typeof local.brands) => {
    setLocal((p) => ({ ...p, brands: newBrands }));
    updateContent({ brands: newBrands });
  };

  return (
    <div className="space-y-4">
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
        <DragReorder
          items={local.brands}
          onReorder={handleReorder}
          keyExtractor={(b) => b.id}
          renderItem={(b, _i, handle) => (
            <div className="flex items-center gap-2">
              {handle}
              <div className="flex-1">
                <BrandRow
                  brand={b}
                  onUpdate={(field, value) => updateField(b.id, field, value)}
                  onRemove={() => setDeleteId(b.id)}
                />
              </div>
            </div>
          )}
        />
      )}

      <ConfirmDialog
        open={deleteId !== null}
        title="Delete Brand"
        message="Are you sure you want to delete this brand? This action cannot be undone."
        onConfirm={() => deleteId && remove(deleteId)}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
