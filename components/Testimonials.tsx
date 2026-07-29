"use client";

import { useState, useEffect, useCallback, useRef, useMemo, memo } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAdmin, SiteContent } from "./AdminProvider";
import { ChevronLeft, ChevronRight, Quote, X } from "lucide-react";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useScrollLock } from "@/hooks/useScrollLock";

function TestimonialCard({
  t,
  onReadMore,
}: {
  t: SiteContent["testimonials"][0];
  onReadMore: () => void;
}) {
  return (
    <div className="testimonial-slide bg-white rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.06)] border-2 border-brand/20 p-6 sm:p-10 flex flex-col items-center text-center snap-center flex-1">
      {t.logoUrl ? (
        <div className="h-16 mb-5 flex items-center justify-center shrink-0">
          <img
            src={t.logoUrl}
            alt={t.company}
            className="max-h-full w-auto object-contain"
          />
        </div>
      ) : (
        <div className="h-16 mb-5 flex items-center justify-center shrink-0">
          <span className="text-3xl font-bold text-gray-300">
            {t.company?.charAt(0)}
          </span>
        </div>
      )}

      <Quote size={24} className="text-brand mb-4 fill-brand/10 shrink-0" />

      <p className="text-gray-600 text-[15px] leading-relaxed line-clamp-4 mb-4 flex-1 w-full text-center">
        {t.review}
      </p>

      {t.review.length > 120 && (
        <button
          onClick={onReadMore}
          className="text-brand text-sm font-semibold hover:text-brand-dark transition-colors mb-2 shrink-0"
        >
          Read More
        </button>
      )}

      <div className="border-t border-gray-100 pt-5 w-full mt-auto">
        <p className="font-semibold text-brand text-[15px]">{t.name}</p>
        <p className="text-gray-500 text-sm mt-1">
          {t.designation}
          {t.company && (
            <span className="text-gray-400 block mt-0.5">@{t.company}</span>
          )}
        </p>
      </div>
    </div>
  );
}

function TestimonialModal({
  t,
  onClose,
}: {
  t: SiteContent["testimonials"][0];
  onClose: () => void;
}) {
  const containerRef = useFocusTrap(true);
  useScrollLock(true);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 px-4"
      onClick={onClose}
    >
      <motion.div
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="testimonial-modal-title"
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-y-auto ios-scroll p-10"
        style={{ maxHeight: 'min(85svh, 85vh)' } as React.CSSProperties}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Close testimonial"
        >
          <X size={18} />
        </button>

        <div className="flex flex-col items-center text-center">
          {t.logoUrl ? (
            <div className="h-16 mb-5 flex items-center justify-center">
              <img
                src={t.logoUrl}
                alt={t.company}
                className="max-h-full w-auto object-contain"
              />
            </div>
          ) : (
            <div className="h-16 mb-5 flex items-center justify-center">
              <span className="text-3xl font-bold text-gray-300">
                {t.company?.charAt(0)}
              </span>
            </div>
          )}

          <Quote
            size={28}
            className="text-brand mb-4 fill-brand/10"
          />

          <p className="text-gray-600 text-[15px] leading-relaxed mb-6">
            {t.review}
          </p>

          <div className="border-t border-gray-100 pt-5 w-full">
            <p id="testimonial-modal-title" className="font-semibold text-brand text-[15px]">{t.name}</p>
            <p className="text-gray-500 text-sm mt-1">
              {t.designation}
              {t.company && (
                <span className="text-gray-400 block mt-0.5">@{t.company}</span>
              )}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default memo(function Testimonials() {
  const { data } = useAdmin();
  const testimonials = data.testimonials;
  const [selected, setSelected] = useState<
    SiteContent["testimonials"][0] | null
  >(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const jumpingRef = useRef(false);
  const oneSetWidthRef = useRef(0);
  const [dotDir, setDotDir] = useState<"left" | "right">("right");
  const [dotKey, setDotKey] = useState(0);

  const tripled = useMemo(
    () => [...testimonials, ...testimonials, ...testimonials],
    [testimonials]
  );

  const count = testimonials.length;
  const handleClose = useCallback(() => setSelected(null), []);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container || count === 0) return;

    requestAnimationFrame(() => {
      const wrappers = container.querySelectorAll<HTMLElement>(".testimonial-slide-wrapper");
      if (wrappers.length < count * 2) return;
      oneSetWidthRef.current = wrappers[count].offsetLeft - wrappers[0].offsetLeft;
      const mid = wrappers[count];
      container.scrollLeft = mid.offsetLeft - (container.clientWidth - mid.offsetWidth) / 2;
    });
  }, [count]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container || count === 0) return;

    let ticking = false;

    const handleScroll = () => {
      if (jumpingRef.current) return;

      const wrappers = container.querySelectorAll<HTMLElement>(".testimonial-slide-wrapper");
      const center = container.scrollLeft + container.clientWidth / 2;

      let closestIdx = 0;
      let closestDist = Infinity;
      wrappers.forEach((w, i) => {
        const wCenter = w.offsetLeft + w.offsetWidth / 2;
        const d = Math.abs(wCenter - center);
        if (d < closestDist) { closestDist = d; closestIdx = i; }
      });
      setActiveIndex(closestIdx % count);

      const oneSet = oneSetWidthRef.current;
      if (oneSet <= 0 || ticking) return;

      if (container.scrollLeft < oneSet * 0.1 || container.scrollLeft > oneSet * 1.9) {
        ticking = true;
        requestAnimationFrame(() => {
      const mid = wrappers[count + 2];
          if (mid) {
            jumpingRef.current = true;
            container.scrollLeft = mid.offsetLeft - (container.clientWidth - mid.offsetWidth) / 2;
            requestAnimationFrame(() => { jumpingRef.current = false; });
          }
          ticking = false;
        });
      }
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => container.removeEventListener("scroll", handleScroll);
  }, [count]);

  const scrollToIndex = useCallback((logicalIndex: number) => {
    const container = scrollRef.current;
    if (!container) return;
    const wrappers = container.querySelectorAll<HTMLElement>(".testimonial-slide-wrapper");
    const target = wrappers[count + logicalIndex];
    if (!target) return;
    container.scrollTo({
      left: target.offsetLeft - (container.clientWidth - target.offsetWidth) / 2,
      behavior: "smooth",
    });
  }, [count]);

  const goPrev = useCallback(() => {
    setDotDir("left");
    setDotKey((k) => k + 1);
    scrollToIndex((activeIndex - 1 + count) % count);
  }, [activeIndex, count, scrollToIndex]);

  const goNext = useCallback(() => {
    setDotDir("right");
    setDotKey((k) => k + 1);
    scrollToIndex((activeIndex + 1) % count);
  }, [activeIndex, count, scrollToIndex]);

  if (count === 0) return null;

  return (
    <section id="testimonials" className="relative bg-gradient-to-b from-white via-gray-50/50 to-white pt-12 pb-6 lg:pt-16 lg:pb-8 overflow-hidden flex flex-col justify-center section-lazy ios-gpu-stable pattern-bg" data-theme="light">
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6 lg:mb-6">
          <span className="text-brand font-semibold tracking-wider uppercase text-sm mb-2 lg:mb-4 block">
            {data.testimonialsSubtitle}
          </span>
          <h2 className="text-5xl sm:text-6xl md:text-7xl font-display font-bold text-brand tracking-tight leading-[1.1]">
            {data.testimonialsTitle.replace(/from /i, "from \n").split('\n').map((line, i, arr) => (
              <span key={i}>
                {line}
                {i < arr.length - 1 && <br className="block md:hidden" />}
              </span>
            ))}
          </h2>
          <div className="mx-auto mt-4 lg:mt-6 h-1 w-20 bg-gradient-to-r from-brand to-brand-light rounded-full" />
        </div>

        <div className="relative group">
          <div
            ref={scrollRef}
            className="testimonial-scroll flex overflow-x-auto snap-x snap-mandatory pb-2 scroll-smooth gap-4"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {tripled.map((t, index) => (
              <div
                key={`${t.id}-${index}`}
                className="testimonial-slide-wrapper shrink-0 w-[85vw] sm:w-[60vw] md:w-[45vw] lg:w-[calc((100%-2rem)/3)] flex flex-col"
              >
                <TestimonialCard
                  t={t}
                  onReadMore={() => setSelected(t)}
                />
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-4 mt-6 lg:mt-8">
            <button
              onClick={goPrev}
              className="md:absolute md:left-0 lg:-left-6 md:top-1/2 md:-translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-gray-500 hover:text-brand hover:border-brand/30 hover:shadow-lg transition-all duration-300 opacity-100 md:opacity-0 group-hover:opacity-100 shrink-0"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="relative flex items-center justify-center gap-3 h-3">
              <div
                key={dotKey}
                className={`absolute w-7 h-2.5 rounded-full bg-brand ${dotDir === "left" ? "dot-bounce-left" : "dot-bounce-right"}`}
              />
              <div className="w-2.5 h-2.5 rounded-full bg-brand relative z-10" />
              <div className="w-2.5 h-2.5 rounded-full bg-brand relative z-10" />
              <div className="w-2.5 h-2.5 rounded-full bg-brand relative z-10" />
            </div>
            <button
              onClick={goNext}
              className="md:absolute md:right-0 lg:-right-6 md:top-1/2 md:-translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-gray-500 hover:text-brand hover:border-brand/30 hover:shadow-lg transition-all duration-300 opacity-100 md:opacity-0 group-hover:opacity-100 shrink-0"
              aria-label="Next testimonial"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {createPortal(
        <AnimatePresence>
          {selected && <TestimonialModal t={selected} onClose={handleClose} />}
        </AnimatePresence>,
        document.body
      )}
    </section>
  );
});
