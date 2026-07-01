"use client";

import { useState, useEffect } from "react";
import { MessageSquarePlus } from "lucide-react";
import ContactModal from "./ContactModal";

export default function FloatingCTA() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkBg, setIsDarkBg] = useState(false);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("open-contact-modal", handleOpen);

    const checkBackground = () => {
      // The button is roughly 52px from bottom and right
      const x = window.innerWidth - 52;
      const y = window.innerHeight - 52;
      
      // Get all elements at the button's center
      const elements = document.elementsFromPoint(x, y);
      
      // Find the structural section/footer behind it
      const container = elements.find(
        (el) => el.tagName === "SECTION" || el.tagName === "FOOTER" || el.classList.contains("snap-section")
      );

      if (container) {
        const className = container.className || "";
        const id = container.id || "";
        
        // Check if the container is a dark/purple section
        if (
          className.includes("bg-brand") || 
          className.includes("bg-black") || 
          id === "hero" ||
          className.includes("from-[#1a0a2e]")
        ) {
          setIsDarkBg(true);
        } else {
          setIsDarkBg(false);
        }
      }
    };

    window.addEventListener("scroll", checkBackground, { passive: true });
    window.addEventListener("resize", checkBackground, { passive: true });
    
    // Initial check
    setTimeout(checkBackground, 100);

    return () => {
      window.removeEventListener("open-contact-modal", handleOpen);
      window.removeEventListener("scroll", checkBackground);
      window.removeEventListener("resize", checkBackground);
    };
  }, []);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-[0_8px_30px_rgba(145,45,191,0.4)] flex items-center justify-center transition-all duration-500 animate-cta-entrance hover:scale-110 active:scale-90 ${
          isDarkBg
            ? "bg-white text-brand hover:bg-gray-100"
            : "bg-brand text-white hover:bg-[#8025a8]"
        }`}
        aria-label="Open contact form"
      >
        <MessageSquarePlus size={24} />
      </button>
      
      <ContactModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
