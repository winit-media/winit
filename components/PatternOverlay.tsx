"use client";

export default function PatternOverlay({ opacity = 0.16 }: { opacity?: number }) {
  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      <div
        className="w-full h-full bg-cover bg-center"
        style={{
          backgroundImage: "url(/pattern.svg)",
          opacity,
        }}
      />
    </div>
  );
}
