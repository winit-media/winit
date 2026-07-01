"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useAdmin } from "./AdminProvider";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("#home");
  const { data } = useAdmin();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = data.navLinks.map((link) => document.querySelector(link.href));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(`#${entry.target.id}`);
          }
        });
      },
      { rootMargin: "-20% 0px -60% 0px" }
    );
    sections.forEach((section) => section && observer.observe(section));
    return () => observer.disconnect();
  }, [data.navLinks]);

  const handleClick = (href: string) => {
    setOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[9999] transition-all duration-300 ${
          scrolled ? "bg-brand/90 backdrop-blur-sm shadow-md" : "bg-brand/80 md:bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0">
              <button onClick={() => handleClick("#home")} className="flex-shrink-0">
                <Image src={data.logoUrl} alt="WiNit" width={48} height={32} priority className="h-12 w-auto" />
              </button>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              {data.navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleClick(link.href)}
                  className={`text-white hover:text-white/80 font-medium transition-colors text-sm tracking-wide uppercase relative ${
                    activeSection === link.href ? "after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2px] after:bg-white" : ""
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>

            <div className="flex items-center md:hidden">
              <button onClick={() => setOpen(!open)} className="text-white p-2">
                {open ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-[9998] md:hidden"
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed top-0 right-0 h-full w-72 bg-white shadow-2xl z-[9999] md:hidden"
          >
            <div className="flex justify-end p-4">
              <button onClick={() => setOpen(false)} className="text-gray-700 p-2">
                <X size={24} />
              </button>
            </div>
            <div className="flex flex-col items-start px-8 space-y-6 mt-4">
              {data.navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleClick(link.href)}
                  className={`text-brand hover:text-brand-dark font-medium text-lg transition-colors uppercase relative ${
                    activeSection === link.href ? "after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2px] after:bg-brand" : ""
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
