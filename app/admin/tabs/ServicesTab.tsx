"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useAdmin } from "@/components/AdminProvider";
import { Field } from "../components/FormElements";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";

export default function ServicesTab() {
  const { data, updateContent } = useAdmin();
  const [local, setLocal] = useState(data);
  const [editing, setEditing] = useState<number | null>(null);
  const [deleteIdx, setDeleteIdx] = useState<number | null>(null);
  const { toast } = useToast();

  type ServiceField = "sub" | "content" | "bg";
  const update = (index: number, key: ServiceField, value: string) => {
    const services = [...local.services];
    services[index] = { ...services[index], [key]: value };
    setLocal((p) => ({ ...p, services }));
  };

  const remove = (index: number) => {
    const updated = { ...local, services: local.services.filter((_, i) => i !== index) };
    setLocal(updated);
    updateContent(updated);
    toast("Service removed", "success");
    setDeleteIdx(null);
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

  const saveService = () => {
    updateContent({ services: local.services });
    setEditing(null);
    toast("Service saved", "success");
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
        <div key={i} className="bg-white rounded-lg shadow-sm border">
          <div className="px-4 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className={`w-3 h-3 rounded-sm shrink-0 ${s.bg}`} />
              <span className="font-medium text-sm">{s.sub}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setEditing(editing === i ? null : i)}
                className="text-brand hover:text-brand-dark text-sm font-medium px-2 py-1 rounded hover:bg-brand/5 transition-colors"
              >
                {editing === i ? "Close" : "Edit"}
              </button>
              <button
                onClick={() => setDeleteIdx(i)}
                className="text-red-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition-colors"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
          {editing === i && (
            <div className="px-4 pb-4 pt-2 space-y-3 border-t">
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
                onClick={saveService}
                className="bg-brand text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-dark transition-colors flex items-center gap-2"
              >
                Save Service
              </button>
            </div>
          )}
        </div>
      ))}

      <ConfirmDialog
        open={deleteIdx !== null}
        title="Delete Service"
        message={`Are you sure you want to delete "${deleteIdx !== null ? local.services[deleteIdx]?.sub : ""}"? This action cannot be undone.`}
        onConfirm={() => deleteIdx !== null && remove(deleteIdx)}
        onCancel={() => setDeleteIdx(null)}
      />
    </div>
  );
}
