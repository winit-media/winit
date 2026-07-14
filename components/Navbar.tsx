"use client";

import { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { scrollToTarget } from "@/hooks/useLenis";
import { useAdmin } from "./AdminProvider";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("#home");
  const [showNav, setShowNav] = useState(true);
  const lastScrollY = useRef(0);
  const { data } = useAdmin();
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";
  const isBlogs = pathname.startsWith("/blogs");
  const canBeTransparent = isHome || isBlogs;
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  const pathMatch = data.navLinks.find(
    (link) => link.href.startsWith("/") && pathname.startsWith(link.href)
  );

  useEffect(() => {
    const onScroll = () => {
      const currentScrollY = window.scrollY ?? window.pageYOffset ?? 0;
      setScrolled(currentScrollY > 10);
      
      if (currentScrollY < 10) {
        setShowNav(true);
      } else if (currentScrollY < lastScrollY.current) {
        setShowNav(true);
      } else if (currentScrollY > lastScrollY.current + 10) {
        setShowNav(false);
      }
      
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = data.navLinks
      .filter((link) => link.href.startsWith("#"))
      .map((link) => document.querySelector(link.href));

    if (typeof IntersectionObserver === "undefined") {
      return;
    }

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
    if (href === "#contact") {
      window.dispatchEvent(new CustomEvent("open-contact-modal"));
      return;
    }
    if (href.startsWith("/")) {
      router.push(href);
      return;
    }
    const el = document.querySelector(href);
    if (el) {
      scrollToTarget(href);
    } else {
      router.push(`/${href}`);
    }
  };

  // Escape key closes mobile menu
  useEffect(() => {
    if (!open) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open]);

  // Focus first menu item when mobile menu opens
  useEffect(() => {
    if (!open || !mobileMenuRef.current) return;
    const timer = setTimeout(() => {
      const first = mobileMenuRef.current?.querySelector<HTMLElement>("button");
      first?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, [open]);

  const currentSection = pathMatch?.href ?? activeSection;

  return (
    <>
      <nav
        role="navigation"
        aria-label="Main navigation"
        className={`fixed top-0 left-0 right-0 z-[9999] transition-all duration-300 ${
          showNav ? "translate-y-0" : "-translate-y-full"
        } ${canBeTransparent && !scrolled ? "bg-transparent" : "bg-brand/90 backdrop-blur-sm shadow-md"}`}
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0">
              <button onClick={() => handleClick("#home")} className="flex-shrink-0">
                <Image src={data.logoUrl} alt="WinIt" width={48} height={32} priority className="h-9 md:h-12 w-auto transition-all" />
              </button>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              {data.navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleClick(link.href)}
                  className={`text-white hover:text-white/80 font-medium transition-colors text-sm tracking-wide uppercase relative ${
                    currentSection === link.href ? "after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2px] after:bg-white" : ""
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>

            <div className="flex items-center md:hidden">
              <button
                ref={hamburgerRef}
                onClick={() => setOpen(!open)}
                className="text-white p-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-expanded={open}
                aria-controls="mobile-menu"
                aria-label="Toggle navigation menu"
              >
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
            ref={mobileMenuRef}
            id="mobile-menu"
            role="dialog"
            aria-label="Navigation menu"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed top-0 right-0 h-dvh w-72 bg-white shadow-2xl z-[9999] md:hidden"
            style={{ paddingTop: "env(safe-area-inset-top)", paddingBottom: "env(safe-area-inset-bottom)" }}
          >
            <div className="flex justify-end p-4">
              <button onClick={() => setOpen(false)} className="text-gray-700 p-2 min-w-[44px] min-h-[44px] flex items-center justify-center" aria-label="Close menu">
                <X size={24} />
              </button>
            </div>
            <div className="flex flex-col items-start px-8 space-y-6 mt-4 overflow-y-auto overscroll-contain flex-1">
              {data.navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleClick(link.href)}
                  className={`text-brand hover:text-brand-dark font-medium text-lg transition-colors uppercase relative py-2 min-h-[44px] flex items-center ${
                    currentSection === link.href ? "after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2px] after:bg-brand" : ""
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
