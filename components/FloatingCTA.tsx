"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { MessageSquarePlus } from "lucide-react";
import ContactModal from "./ContactModal";

export default function FloatingCTA() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkBg, setIsDarkBg] = useState(false);
  const darkRef = useRef(false);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("open-contact-modal", handleOpen);

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const btnY = window.innerHeight * 0.85;
        const sections = document.querySelectorAll<HTMLElement>("[data-theme]");
        let found = false;
        for (const section of sections) {
          const rect = section.getBoundingClientRect();
          if (rect.top <= btnY && rect.bottom >= btnY) {
            found = true;
            const dark = section.getAttribute("data-theme") === "dark";
            if (dark !== darkRef.current) {
              darkRef.current = dark;
              setIsDarkBg(dark);
            }
            break;
          }
        }
        if (!found) {
          const sectionsArr = Array.from(sections);
          if (sectionsArr.length > 0) {
            const last = sectionsArr[sectionsArr.length - 1];
            const rect = last.getBoundingClientRect();
            const dark = rect.top <= window.innerHeight;
            if (dark !== darkRef.current) {
              darkRef.current = dark;
              setIsDarkBg(dark);
            }
          }
        }
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true } as AddEventListenerOptions);
    onScroll();

    return () => {
      window.removeEventListener("open-contact-modal", handleOpen);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <>
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 200, damping: 20 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className={`fixed z-[50] w-14 h-14 rounded-full shadow-[0_8px_30px_rgba(145,45,191,0.4)] flex items-center justify-center transition-colors duration-500 ${
          isDarkBg
            ? "bg-white text-brand hover:bg-gray-100"
            : "bg-brand text-white hover:bg-[#8025a8]"
        }`}
        style={{
          bottom: "calc(1.5rem + env(safe-area-inset-bottom))",
          right: "calc(1.5rem + env(safe-area-inset-right))",
        }}
        aria-label="Open contact form"
      >
        <MessageSquarePlus size={24} />
      </motion.button>

      <ContactModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
