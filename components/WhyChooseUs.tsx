"use client";

import { useRef, useEffect, memo } from "react";
import { motion, useInView } from "framer-motion";
import { Users, Briefcase, Megaphone, Eye, Globe, MapPin, Layers, TrendingDown } from "lucide-react";
import { useAdmin } from "./AdminProvider";

const activeCounters = new Map<HTMLSpanElement, { target: number; suffix: string; start: number; duration: number }>();
let rafId: number | null = null;

function tick(now: number) {
  activeCounters.forEach((state, el) => {
    const progress = Math.min((now - state.start) / state.duration, 1);
    el.textContent = Math.floor(progress * state.target).toLocaleString("en-IN") + state.suffix;
    if (progress >= 1) activeCounters.delete(el);
  });
  if (activeCounters.size > 0) {
    rafId = requestAnimationFrame(tick);
  } else {
    rafId = null;
  }
}

function AnimatedCounter({ target, suffix = "", showFinal }: { target: number; suffix?: string; showFinal?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView || showFinal || !ref.current) return;
    const el = ref.current;
    activeCounters.set(el, { target, suffix, start: performance.now(), duration: 2000 });
    if (rafId === null) rafId = requestAnimationFrame(tick);
    return () => {
      activeCounters.delete(el);
      if (activeCounters.size === 0 && rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    };
  }, [inView, target, suffix, showFinal]);

  return (
    <span ref={ref}>
      {showFinal ? target.toLocaleString("en-IN") + suffix : ""}
    </span>
  );
}

const iconMap = [Users, Briefcase, Megaphone, Eye, Globe, MapPin, Layers, TrendingDown];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.5, ease: "easeOut" as const },
  }),
};

export default memo(function WhyChooseUs() {
  const { data } = useAdmin();
  const prefersReducedMotion = typeof window !== "undefined"
    && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <section className="relative bg-brand min-h-svh pt-16 lg:pt-16 pb-6 lg:pb-10 ios-gpu-stable section-lazy pattern-bg" data-theme="dark" style={{ '--pattern-opacity': '0.16' } as React.CSSProperties}>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold text-white text-center mb-6 lg:mb-16 leading-[1.1]">
          {data.whyChooseUsTitle.replace(/Choose /i, "Choose \n").split('\n').map((line, i, arr) => (
            <span key={i}>
              {line}
              {i < arr.length - 1 && <br className="block md:hidden" />}
            </span>
          ))}
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
          {data.stats.map((stat, i) => {
            const Icon = iconMap[i % iconMap.length];
            return (
              <motion.div
                key={i}
                custom={i}
                variants={cardVariants}
                initial={prefersReducedMotion ? "visible" : "hidden"}
                whileInView="visible"
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg text-center flex flex-col items-center justify-center"
              >
                <Icon className="text-brand mb-2 lg:mb-4" size={28} />
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-brand font-display mb-1 lg:mb-2">
                  <AnimatedCounter target={stat.number} suffix={stat.suffix} showFinal={prefersReducedMotion} />
                </div>
                <p className="text-gray-600 font-medium text-xs sm:text-sm lg:text-base leading-tight">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
});
