"use client";

import { Loader2, Save, Check } from "lucide-react";

export default function SaveIndicator({ saving }: { saving: boolean }) {
  if (!saving) return null;
  return (
    <div className="fixed bottom-4 right-4 bg-brand text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 z-50">
      <Loader2 size={14} className="animate-spin" />
      Saving...
    </div>
  );
}

export function SaveButton({
  onClick,
  saving = false,
  disabled = false,
  label = "Save Changes",
  size = "md",
}: {
  onClick: () => void;
  saving?: boolean;
  disabled?: boolean;
  label?: string;
  size?: "sm" | "md";
}) {
  const sizeClasses = size === "sm"
    ? "px-3 py-1.5 text-sm"
    : "px-6 py-2.5 text-base";

  return (
    <button
      onClick={onClick}
      disabled={saving || disabled}
      className={`bg-brand text-white ${sizeClasses} rounded-lg font-semibold hover:bg-brand-dark transition-colors flex items-center gap-2 disabled:opacity-50`}
    >
      {saving ? <Loader2 size={size === "sm" ? 14 : 16} className="animate-spin" /> : <Save size={size === "sm" ? 14 : 16} />}
      {label}
    </button>
  );
}

export function SavedBadge() {
  return (
    <span className="inline-flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
      <Check size={10} /> Saved
    </span>
  );
}
