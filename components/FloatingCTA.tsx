"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageSquarePlus } from "lucide-react";
import ContactModal from "./ContactModal";

export default function FloatingCTA() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkBg, setIsDarkBg] = useState(false);
  const [onFooter, setOnFooter] = useState(false);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("open-contact-modal", handleOpen);

    const checkBackground = () => {
      const sections = document.querySelectorAll<HTMLElement>("[data-theme]");
      if (sections.length === 0) return;

      if (typeof IntersectionObserver === "undefined") {
        setIsDarkBg(sections[0]?.getAttribute("data-theme") === "dark");
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsDarkBg(entry.target.getAttribute("data-theme") === "dark");
            }
          });
        },
        { threshold: 0.3 }
      );

      sections.forEach((s) => observer.observe(s));

      return () => observer.disconnect();
    };

    // Hide FAB when footer (#contact) is on screen
    const footer = document.getElementById("contact");
    let footerObserver: IntersectionObserver | null = null;
    if (footer && typeof IntersectionObserver !== "undefined") {
      footerObserver = new IntersectionObserver(
        ([entry]) => setOnFooter(entry.isIntersecting),
        { threshold: 0.4 }
      );
      footerObserver.observe(footer);
    }

    const cleanup = checkBackground();

    return () => {
      window.removeEventListener("open-contact-modal", handleOpen);
      cleanup?.();
      footerObserver?.disconnect();
    };
  }, []);

  return (
    <>
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: onFooter ? 0 : 1, opacity: onFooter ? 0 : 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 200, damping: 20 }}
        whileHover={{ scale: onFooter ? 0 : 1.1 }}
        whileTap={{ scale: onFooter ? 0 : 0.9 }}
        onClick={() => setIsOpen(true)}
        className={`fixed z-[50] w-14 h-14 rounded-full shadow-[0_8px_30px_rgba(145,45,191,0.4)] flex items-center justify-center transition-colors duration-500 ${
          isDarkBg
            ? "bg-white text-brand hover:bg-gray-100"
            : "bg-brand text-white hover:bg-[#8025a8]"
        }`}
        style={{
          bottom: "calc(1.5rem + env(safe-area-inset-bottom))",
          right: "calc(1.5rem + env(safe-area-inset-right))",
          pointerEvents: onFooter ? "none" : "auto",
        }}
        aria-label="Open contact form"
      >
        <MessageSquarePlus size={24} />
      </motion.button>
      
      <ContactModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
