"use client";

import { useAdmin } from "./AdminProvider";
import PatternOverlay from "./PatternOverlay";

function VerticalCarousel({
  items,
  direction,
}: {
  items: { id: string; name: string; imageUrl: string; link?: string }[];
  direction: "up" | "down";
}) {
  const duplicated = [...items, ...items, ...items, ...items];

  return (
    <div className="overflow-hidden h-full">
      <div
        className={
          direction === "down" ? "animate-marquee-down" : "animate-marquee-up"
        }
      >
        {duplicated.map((item, i) => (
          <a
            key={`${item.id}-${i}`}
            href={item.link || "#"}
            target={item.link ? "_blank" : undefined}
            rel={item.link ? "noopener noreferrer" : undefined}
            className="brand-glow block mx-auto mb-4 w-[220px] h-[220px] rounded-xl flex items-center justify-center p-5 transition-shadow duration-300"
          >
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.name}
                className="brand-logo max-w-full max-h-full object-contain"
              />
            ) : (
              <span className="text-gray-400 text-sm text-center">{item.name}</span>
            )}
          </a>
        ))}
      </div>
    </div>
  );
}

export default function BrandShowcase() {
  const { data } = useAdmin();
  const brands = data.brands;

  return (
    <section className="relative bg-white h-screen snap-section overflow-hidden">
      <PatternOverlay opacity={0.08} />
      <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex items-center">
        <div className="w-full flex items-center gap-12">
          <div className="shrink-0 w-2/5 flex items-center justify-center lg:justify-start">
            <h2 className="text-5xl md:text-6xl font-serif font-bold text-gray-900">
              {data.brandTitle || "Our Brands"}
            </h2>
          </div>

          <div className="flex-1 h-[calc(100vh-10rem)] flex gap-6 justify-center">
            {brands.length > 0 ? (
              <>
                <VerticalCarousel items={brands} direction="down" />
                <VerticalCarousel items={[...brands].reverse()} direction="up" />
              </>
            ) : (
              <>
                <div className="flex-1 flex items-center justify-center text-gray-400">
                  <p>Brands coming soon</p>
                </div>
                <div className="flex-1 flex items-center justify-center text-gray-400">
                  <p>Brands coming soon</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
