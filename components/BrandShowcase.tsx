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
          <div
            key={`${item.id}-${i}`}
            className="brand-glow block mx-auto mb-4 w-[40vw] max-w-[225px] aspect-square md:w-[325px] md:h-[325px] md:max-w-none rounded-xl flex items-center justify-center p-4 sm:p-5 md:p-8 transition-shadow duration-300"
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
    <section className="relative bg-white h-screen snap-section overflow-hidden">
      <PatternOverlay opacity={0.08} />
      <div className="relative z-10 h-full max-w-7xl mx-auto flex items-center lg:px-8">
        <div className="w-full h-full flex flex-col lg:flex-row items-center lg:gap-12 relative">
          <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none lg:relative lg:inset-auto lg:z-auto lg:shrink-0 lg:w-2/5 lg:justify-start">
            <div className="px-4 lg:p-0">
              <h2 className="text-5xl md:text-6xl font-display font-bold text-gray-900 text-center lg:text-left drop-shadow-sm lg:drop-shadow-none">
                {data.brandTitle || "Our Brands"}
              </h2>
            </div>
          </div>

          <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none lg:hidden">
            <div className="w-full h-64 bg-gradient-to-b from-transparent via-white to-transparent opacity-80" />
          </div>

          <div className="flex-1 w-full h-full flex gap-4 sm:gap-6 justify-center relative z-0">
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
