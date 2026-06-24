"use client";

import { useAdmin } from "./AdminProvider";
import PatternOverlay from "./PatternOverlay";
import { Phone, MapPin, Mail } from "lucide-react";

export default function Footer() {
  const { data } = useAdmin();

  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer id="contact" className="relative bg-brand snap-section overflow-hidden">
      <PatternOverlay opacity={0.08} />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Left Column — Brand */}
          <div className="flex flex-col gap-4">
            <h3 className="text-white font-serif text-xl font-bold">{data.footerTitle}</h3>
            <p className="text-white/70 text-sm leading-relaxed max-w-xs">
              {data.footerTagline}
            </p>
            <div className="flex gap-3 mt-2">
              {data.socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="bg-white/15 hover:bg-white/25 text-white rounded-full w-9 h-9 flex items-center justify-center transition-colors"
                >
                  <SocialIcon label={social.label} />
                </a>
              ))}
            </div>
          </div>

          {/* Middle Column — Quick Links */}
          <div className="flex flex-col gap-4">
            <h3 className="text-white font-serif text-xl font-bold">{data.footerQuickLinksTitle}</h3>
            <div className="flex flex-col gap-2.5">
              {data.footerQuickLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  className="text-white/70 hover:text-white transition-colors text-sm text-left w-fit"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          {/* Right Column — Contact Us */}
          <div className="flex flex-col gap-4">
            <h3 className="text-white font-serif text-xl font-bold">{data.footerContactTitle}</h3>
            <div className="flex flex-col gap-3.5">
              <a
                href={`tel:${data.contactPhone.replace(/\s/g, "")}`}
                className="flex items-start gap-3 group"
              >
                <Phone size={18} className="text-white mt-0.5 flex-shrink-0" />
                <span className="text-white/80 text-sm group-hover:text-white transition-colors">{data.contactPhone}</span>
              </a>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.contactAddress)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 group"
              >
                <MapPin size={18} className="text-white mt-0.5 flex-shrink-0" />
                <span className="text-white/80 text-sm leading-relaxed group-hover:text-white transition-colors">{data.contactAddress}</span>
              </a>
              <a
                href={`mailto:${data.contactEmail}`}
                className="flex items-start gap-3 group"
              >
                <Mail size={18} className="text-white mt-0.5 flex-shrink-0" />
                <span className="text-white/80 text-sm group-hover:text-white transition-colors">{data.contactEmail}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 mt-12 pt-8 text-center">
          <p className="text-white/60 text-sm">
            {data.footerCopyright}
          </p>
        </div>
      </div>
    </footer>
  );
}

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
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor">
          <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
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
