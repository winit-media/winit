"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { useAdmin, SiteContent } from "./AdminProvider";
import { ChevronLeft, ChevronRight, Quote, X } from "lucide-react";
import PatternOverlay from "./PatternOverlay";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

function TestimonialCard({
  t,
  onReadMore,
}: {
  t: SiteContent["testimonials"][0];
  onReadMore: () => void;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.06)] border border-gray-100 p-10 flex flex-col items-center text-center h-[480px] mx-3">
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

      <p className="text-gray-600 text-[15px] leading-relaxed line-clamp-8 mb-4 overflow-hidden">
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
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-10"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors"
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
            <p className="font-semibold text-brand text-[15px]">{t.name}</p>
            <p className="text-gray-500 text-sm mt-1">
              {t.designation}
              {t.company && (
                <span className="text-gray-400 block mt-0.5">@{t.company}</span>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  const { data } = useAdmin();
  const testimonials = data.testimonials;
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const [selected, setSelected] = useState<
    SiteContent["testimonials"][0] | null
  >(null);

  const handleClose = useCallback(() => setSelected(null), []);

  if (testimonials.length === 0) return null;

  return (
    <section className="relative bg-gradient-to-b from-white via-gray-50/50 to-white pt-16 pb-10 lg:pt-32 lg:pb-16 overflow-hidden snap-section min-h-screen flex flex-col justify-center">
      <PatternOverlay opacity={0.06} />
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6 lg:mb-6">
          <span className="text-brand font-semibold tracking-wider uppercase text-sm mb-2 lg:mb-4 block">
            {data.testimonialsSubtitle}
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 tracking-tight">
            {data.testimonialsTitle}
          </h2>
          <div className="mx-auto mt-4 lg:mt-6 h-1 w-20 bg-gradient-to-r from-brand to-brand-light rounded-full" />
        </div>

        <div className="relative group">
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={0}
            slidesPerView={1}
            centeredSlides={true}
            loop={true}
            speed={500}
            pagination={{
              clickable: true,
              el: ".testimonial-pagination",
            }}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            onBeforeInit={(swiper: SwiperType) => {
              if (
                swiper.params.navigation &&
                typeof swiper.params.navigation !== "boolean"
              ) {
                swiper.params.navigation.prevEl = prevRef.current;
                swiper.params.navigation.nextEl = nextRef.current;
              }
            }}
            breakpoints={{
              640: {
                slidesPerView: 1.5,
                spaceBetween: 0,
              },
              768: {
                slidesPerView: 2.2,
                spaceBetween: 0,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 0,
              },
            }}
            className="testimonial-swiper pb-4"
          >
            {testimonials.map((t, index) => (
              <SwiperSlide key={`${t.id}-${index}`} className="py-4">
                <TestimonialCard
                  t={t}
                  onReadMore={() => setSelected(t)}
                />
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="flex items-center justify-center gap-4 mt-6 lg:mt-8">
            <button
              ref={prevRef}
              className="md:absolute md:left-0 lg:-left-6 md:top-1/2 md:-translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-gray-500 hover:text-brand hover:border-brand/30 hover:shadow-lg transition-all duration-300 opacity-100 md:opacity-0 group-hover:opacity-100 shrink-0"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="testimonial-pagination !w-auto flex justify-center gap-2" />
            <button
              ref={nextRef}
              className="md:absolute md:right-0 lg:-right-6 md:top-1/2 md:-translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-gray-500 hover:text-brand hover:border-brand/30 hover:shadow-lg transition-all duration-300 opacity-100 md:opacity-0 group-hover:opacity-100 shrink-0"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {selected && <TestimonialModal t={selected} onClose={handleClose} />}
    </section>
  );
}
