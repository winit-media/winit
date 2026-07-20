"use client";

import { memo } from "react";
import { useAdmin } from "./AdminProvider";
import { Phone, MapPin, Mail } from "lucide-react";

export default memo(function Footer() {
  const { data } = useAdmin();

  return (
    <footer id="contact" className="relative bg-brand overflow-hidden section-lazy ios-gpu-stable pattern-bg" data-theme="dark" style={{ '--pattern-opacity': '0.08' } as React.CSSProperties}>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        {/* Desktop: 2-col grid — Brand (40%) + Contact Us (60%). */}
        <div className="grid grid-cols-2 md:grid-cols-[2fr_3fr] gap-6 lg:gap-12">
          {/* Left Column — Brand + Social Icons */}
          <div className="flex flex-col gap-3 lg:gap-4 order-1 md:order-1 col-span-1 min-w-0">
            <h3 className="text-white font-display text-lg lg:text-xl font-bold">{data.footerTitle}</h3>
            <p className="text-white/70 text-xs lg:text-sm leading-relaxed max-w-xs">
              {data.footerTagline}
            </p>

            {/* Social Icons — single row */}
            <div className="flex flex-nowrap gap-1.5 lg:gap-2 mt-1 lg:mt-2">
              {data.socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="bg-white/15 hover:bg-white/25 text-white rounded-full w-8 h-8 lg:w-10 lg:h-10 flex items-center justify-center transition-colors shrink-0"
                >
                  <SocialIcon label={social.label} />
                </a>
              ))}
            </div>
          </div>

          {/* Right Column — Contact Us */}
          <div className="flex flex-col gap-2 lg:gap-4 order-2 md:order-2 col-span-1 min-w-0">
            <h3 className="text-white font-display text-lg lg:text-xl font-bold">{data.footerContactTitle}</h3>
            <div className="flex flex-col gap-2 lg:gap-3.5">
              <a
                href={`tel:${data.contactPhone.replace(/\s/g, "")}`}
                className="flex items-start gap-2.5 lg:gap-3 group"
              >
                <Phone className="text-white mt-0.5 flex-shrink-0 w-4 h-4 lg:w-[18px] lg:h-[18px]" />
                <span className="text-white/80 text-xs lg:text-sm group-hover:text-white transition-colors break-words">{data.contactPhone}</span>
              </a>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.contactAddress)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2.5 lg:gap-3 group"
              >
                <MapPin className="text-white mt-0.5 flex-shrink-0 w-4 h-4 lg:w-[18px] lg:h-[18px]" />
                <span className="text-white/80 text-xs lg:text-sm leading-relaxed group-hover:text-white transition-colors break-words">{data.contactAddress}</span>
              </a>
              <a
                href={`mailto:${data.contactEmail}`}
                className="flex items-start gap-2.5 lg:gap-3 group"
              >
                <Mail className="text-white mt-0.5 flex-shrink-0 w-4 h-4 lg:w-[18px] lg:h-[18px]" />
                <span className="text-white/80 text-xs lg:text-sm group-hover:text-white transition-colors break-all">{data.contactEmail}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 mt-6 lg:mt-10 pt-4 lg:pt-6 text-center">
          <p className="text-white/60 text-xs lg:text-sm">
            {data.footerCopyright}
          </p>
        </div>
      </div>
    </footer>
  );
});

function SocialIcon({ label }: { label: string }) {
  const s = 16;
  switch (label) {
    case "Facebook":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      );
    case "Instagram":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>
      );
    case "Twitter":
    case "X":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
    case "YouTube":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 0 0-2.122 2.136C0 8.07 0 12 0 12s0 3.93.501 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.55 9.377.55 9.377.55s7.505 0 9.377-.55a3.016 3.016 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      );
    case "LinkedIn":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect width="4" height="12" x="2" y="9" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      );
    default:
      return null;
  }
}
