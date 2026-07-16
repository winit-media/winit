"use client";

import { memo } from "react";
import { useAdmin } from "./AdminProvider";
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

export default memo(function MobileBrandMarquee() {
  const { data } = useAdmin();
  const brands = data?.brands || [];

  if (brands.length === 0) return null;

  // Duplicate the array multiple times to ensure the marquee fills the screen and scrolls seamlessly
  const duplicated = [...brands, ...brands];
  const duration = Math.max(30, brands.length * 6);

  return (
    <div className="block lg:hidden w-full overflow-hidden bg-white py-4 border-b border-gray-100 section-lazy">
      <div 
        className="flex w-max animate-marquee-left items-center hover:[animation-play-state:paused]"
        style={{ animationDuration: `${duration}s` }}
      >
        {duplicated.map((item, i) => {
          const finalUrl = getLocalImageUrl(item.imageUrl);
          return (
            <div
              key={`${item.id}-${i}`}
              className="flex-shrink-0 mx-2 w-[80px] h-[32px] relative flex items-center justify-center transition-all duration-300"
            >
              {finalUrl ? (
                <Image
                  src={finalUrl}
                  alt={item.name}
                  fill
                  className="object-contain"
                  sizes="100px"
                  unoptimized={finalUrl.startsWith('http')}
                />
              ) : (
                <span className="text-gray-400 text-xs text-center">{item.name}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
});
