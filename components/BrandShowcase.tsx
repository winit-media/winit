"use client";

import { useAdmin } from "./AdminProvider";
import PatternOverlay from "./PatternOverlay";
import Image from "next/image";

const getLocalImageUrl = (url: string) => {
  if (!url) return url;
  if (url.includes('RRfavicon.png')) return '/brands/RRfavicon.png';
  if (url.includes('lokmat-logo')) return '/brands/lokmat.png';
  if (url.includes('Brand-Concepts')) return '/brands/brandconcepts.png';
  if (url.includes('augmont-logo')) return '/brands/augmont.webp';
  if (url.includes('New-Logo-01-2.png')) return '/brands/everestfleet.png';
  return url;
};

function VerticalCarousel({
  items,
  direction,
  variant = "minimal",
}: {
  items: { id: string; name: string; imageUrl: string; link?: string }[];
  direction: "up" | "down";
  variant?: "minimal" | "glass";
}) {
  const duplicated = [...items, ...items, ...items, ...items];

  const variantClasses = {
    minimal: "bg-white border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:-translate-y-1 hover:shadow-[0_15px_30px_rgba(0,0,0,0.06)] hover:border-brand/40",
    glass: "bg-white/40 backdrop-blur-md border border-white/60 shadow-[0_4px_24px_rgb(0,0,0,0.02)] hover:-translate-y-1 hover:bg-white/60 hover:shadow-[0_15px_35px_rgba(0,0,0,0.06)] hover:border-brand/50"
  };

  return (
    <div className="overflow-hidden h-full pt-8 pb-8">
      <div
        className={
          direction === "down" ? "animate-marquee-down" : "animate-marquee-up"
        }
      >
        {duplicated.map((item, i) => {
          const finalUrl = getLocalImageUrl(item.imageUrl);
          return (
          <div
            key={`${item.id}-${i}`}
            className={`group block mx-auto mb-4 w-[35vw] max-w-[140px] aspect-square md:w-[180px] md:h-[180px] md:max-w-none rounded-2xl flex items-center justify-center p-4 sm:p-5 md:p-6 transition-all duration-500 ease-out ${variantClasses[variant]}`}
          >
            {finalUrl ? (
              <div className="relative w-full h-full">
                <Image
                  src={finalUrl}
                  alt={item.name}
                  fill
                  className="object-contain transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 140px, 180px"
                  unoptimized={finalUrl.startsWith('http')}
                />
              </div>
            ) : (
              <span className="text-gray-400 text-sm text-center">{item.name}</span>
            )}
          </div>
        )})}
      </div>
    </div>
  );
}

export default function BrandShowcase() {
  const { data } = useAdmin();
  const brands = data.brands;

  return (
    <section className="relative bg-[#fcfcfc] h-screen snap-section overflow-hidden">
      <PatternOverlay opacity={0.05} />
      <div className="relative z-10 h-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center lg:gap-12 lg:px-8">
        
        {/* Title Section */}
        <div className="w-full lg:w-2/5 flex items-center justify-center lg:justify-start pt-20 pb-6 lg:pt-0 lg:pb-0 shrink-0 z-20">
          <div className="px-6 lg:p-0 text-center lg:text-left">
            <h2 className="font-display font-bold text-brand drop-shadow-sm lg:drop-shadow-none" style={{ fontSize: "clamp(3.5rem, 8vw, 7rem)", lineHeight: "0.95" }}>
              Our<br className="hidden lg:block" /> Brands
            </h2>
            <p className="mt-4 text-gray-500 text-sm md:text-base max-w-xs mx-auto lg:mx-0">
              Trusted by industry leaders and innovative companies worldwide.
            </p>
          </div>
        </div>

        {/* Carousel Section */}
        <div 
          className="flex-1 w-full h-full flex gap-4 sm:gap-8 justify-center relative z-10 overflow-hidden"
          style={{ maskImage: "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)", WebkitMaskImage: "-webkit-linear-gradient(top, transparent, black 10%, black 90%, transparent)" }}
        >
          {brands.length > 0 ? (
            <>
              {/* Left Carousel - Glass Variant */}
              <VerticalCarousel items={brands} direction="down" variant="glass" />
              {/* Right Carousel - Glass Variant */}
              <VerticalCarousel items={[...brands].reverse()} direction="up" variant="glass" />
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
    </section>
  );
}
