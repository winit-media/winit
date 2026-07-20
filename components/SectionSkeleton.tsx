"use client";

export default function SectionSkeleton({
  height = "min-h-svh",
  theme = "dark",
}: {
  height?: string;
  theme?: "dark" | "light";
}) {
  return (
    <div
      className={`w-full ${height} flex items-center justify-center animate-pulse ${
        theme === "dark" ? "bg-[#1a0a2e]" : "bg-gray-50"
      }`}
      aria-hidden="true"
    >
      <div
        className={`w-16 h-16 rounded-full ${
          theme === "dark" ? "bg-white/10" : "bg-gray-200"
        }`}
      />
    </div>
  );
}
