"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "Work", href: "#work" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = (href: string) => {
    setOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-md" : "bg-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-1 flex justify-start">
            <button onClick={() => handleClick("#home")} className="flex-shrink-0">
              <Image src="/logo.png" alt="WiNit" width={48} height={32} priority className="h-8 w-auto" style={{ width: "auto", height: "auto" }} />
            </button>
          </div>

          <div className="hidden md:flex flex-1 justify-center space-x-8">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleClick(link.href)}
                className="text-gray-700 hover:text-brand font-medium transition-colors text-sm tracking-wide"
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="flex-1 flex justify-end">
            <div className="md:hidden">
              <button onClick={() => setOpen(!open)} className="text-gray-700 p-2">
                {open ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed top-0 right-0 h-full w-72 bg-white shadow-2xl z-50 md:hidden"
          >
            <div className="flex justify-end p-4">
              <button onClick={() => setOpen(false)} className="text-gray-700 p-2">
                <X size={24} />
              </button>
            </div>
            <div className="flex flex-col items-start px-8 space-y-6 mt-4">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleClick(link.href)}
                  className="text-gray-700 hover:text-brand font-medium text-lg transition-colors"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40 md:hidden"
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>
    </nav>
  );
}
