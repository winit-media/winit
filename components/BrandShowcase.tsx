"use client";

import { useAdmin } from "./AdminProvider";
import PatternOverlay from "./PatternOverlay";

function VerticalCarousel({
  items,
  direction,
}: {
  items: { id: string; name: string; imageUrl: string }[];
  direction: "up" | "down";
}) {
  const duplicated = [...items, ...items, ...items];

  return (
    <div className="overflow-hidden h-[500px] md:h-[600px]">
      <div
        className={
          direction === "down" ? "animate-marquee-down" : "animate-marquee-up"
        }
      >
        {duplicated.map((item, i) => (
          <div
            key={`${item.id}-${i}`}
            className="brand-glow mx-auto mb-4 w-[160px] h-[160px] bg-white rounded-xl shadow-md flex items-center justify-center p-6 transition-shadow duration-300"
          >
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.name}
                className="max-w-full max-h-full object-contain"
              />
            ) : (
              <span className="text-gray-400 text-sm text-center">{item.name}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function BrandShowcase() {
  const { data } = useAdmin();
  const brands = data.brands;

  return (
    <section className="relative bg-white min-h-screen snap-section">
      <PatternOverlay opacity={0.08} />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex items-center justify-center lg:justify-start">
            <h2 className="text-5xl md:text-6xl font-serif font-bold text-gray-900">
              Our Brand
            </h2>
          </div>

          <div className="flex gap-6 justify-center">
            {brands.length > 0 ? (
              <>
                <VerticalCarousel items={brands} direction="down" />
                <VerticalCarousel items={[...brands].reverse()} direction="up" />
              </>
            ) : (
              <div className="flex gap-6 justify-center">
                <div className="h-[500px] md:h-[600px] flex items-center justify-center text-gray-400">
                  <p>Brands coming soon</p>
                </div>
                <div className="h-[500px] md:h-[600px] flex items-center justify-center text-gray-400">
                  <p>Brands coming soon</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
