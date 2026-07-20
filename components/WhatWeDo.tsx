"use client";

import { useRef, useState, useLayoutEffect, memo } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { useAdmin } from "./AdminProvider";
import { scrollToTarget } from "@/hooks/useLenis";
import { getViewportHeight } from "@/hooks/useViewportHeight";

const ROTATION_AMOUNT = 15;

function StackedCard({
  item,
  index,
  total,
  progress,
  onClick,
}: {
  item: { sub: string; content: string; bg: string };
  index: number;
  total: number;
  progress: MotionValue<number>;
  onClick: () => void;
}) {
  const isLast = index === total - 1;
  const step = 1 / total;

  const startFly = index * step;
  const endFly = startFly + step;

  const dir = -1;
  const initialRotation = dir * index * ROTATION_AMOUNT;

  // Use percentage units (not vh) so the translate resolves against the
  // card's own bounding box rather than window.innerHeight. On iOS Safari,
  // innerHeight is the small viewport but CSS 100vh is the large viewport;
  // using "vh" here makes cards under-travel and leave a visible sliver
  // that the next card overlaps â€” the iOS-only stacking glitch.
  const y = useTransform(
    progress,
    [startFly, endFly],
    ["0%", isLast ? "0%" : "-250%"]
  );

  const rotate = useTransform(
    progress,
    [0, startFly, endFly],
    [initialRotation, 0, isLast ? 0 : initialRotation + dir * 45]
  );

  const opacity = useTransform(
    progress,
    [startFly, endFly - step * 0.2],
    [1, isLast ? 1 : 0]
  );

  const scale = useTransform(
    progress,
    [startFly, endFly],
    [1, isLast ? 1 : 0.8]
  );

  const zIndex = total - index;

  return (
    <motion.div
      onClick={onClick}
      className="absolute inset-0 flex items-center justify-center origin-center cursor-pointer whatwedo-card"
      style={{
        y,
        rotate,
        opacity,
        scale,
        zIndex,
      }}
    >
      <div
        className={`${item.bg} w-full h-full rounded-3xl shadow-2xl p-8 lg:p-12 flex flex-col justify-center text-white`}
      >
        <h3 className="text-3xl lg:text-4xl font-bold mb-4 font-display">{item.sub}</h3>
        <p className="text-white/90 text-[15px] lg:text-base leading-relaxed">{item.content}</p>
      </div>
    </motion.div>
  );
}

export default memo(function WhatWeDo() {
  const { data } = useAdmin();
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardData = data.services;
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );
  const [sectionHeight, setSectionHeight] = useState<number>(0);
  const prefersReducedMotion = typeof window !== "undefined"
    && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useLayoutEffect(() => {
    const update = () => {
      const vh = getViewportHeight();
      const pct = isMobile ? 70 : 60;
      setSectionHeight((cardData.length * pct / 100) * vh);
      setIsMobile(window.innerWidth < 768);
    };
    update();
    window.addEventListener("resize", update);
    window.visualViewport?.addEventListener("resize", update);
    return () => {
      window.removeEventListener("resize", update);
      window.visualViewport?.removeEventListener("resize", update);
    };
  }, [cardData.length, isMobile]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const handleCardClick = () => {
    const scrollAmount = (window.visualViewport?.height ?? window.innerHeight) * 0.8;
    const currentScroll = window.scrollY ?? window.pageYOffset ?? 0;
    scrollToTarget(currentScroll + scrollAmount);
  };

  return (
    <section
      id="services"
      ref={sectionRef}
      data-theme="light"
      className="relative bg-white w-full"
      style={prefersReducedMotion ? undefined : { height: sectionHeight || undefined }}
    >
      {prefersReducedMotion ? (
        <div className="relative w-full min-h-svh flex items-center overflow-hidden ios-gpu-stable pattern-bg" style={{ '--pattern-opacity': '0.12' } as React.CSSProperties}>
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 flex flex-col lg:flex-row items-center">
            <div className="w-full lg:w-5/12 flex items-center justify-center lg:justify-start mb-8 lg:mb-0">
              <div className="relative flex items-center justify-center lg:justify-start">
                <span
                  className="absolute text-brand font-display font-medium opacity-25 select-none pointer-events-none"
                  style={{ fontSize: "clamp(18rem, 40vw, 36rem)", lineHeight: 1, top: "50%", left: "50%", transform: "translate(-50%, -50%) scaleX(0.8)", zIndex: -1 }}
                >?</span>
                <h2 className="font-display font-bold text-brand leading-[0.95] text-center relative z-10" style={{ fontSize: "clamp(3.5rem, 8vw, 7rem)" }}>What<br />we do</h2>
              </div>
            </div>
            <div className="w-full lg:w-7/12 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {cardData.map((item, i) => (
                <div key={i} className={`${item.bg} rounded-3xl shadow-2xl p-8 flex flex-col justify-center text-white aspect-square max-w-[340px] sm:max-w-none mx-auto sm:mx-0 w-full`}>
                  <h3 className="text-3xl lg:text-4xl font-bold mb-4 font-display">{item.sub}</h3>
                  <p className="text-white/90 text-[15px] lg:text-base leading-relaxed">{item.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="sticky top-0 h-svh w-full flex items-center overflow-clip z-0 pattern-bg" style={{ '--pattern-opacity': '0.12' } as React.CSSProperties}>
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 flex flex-col lg:flex-row h-full relative z-10">
            <div className="w-full lg:w-5/12 flex items-center justify-center lg:justify-start h-[35%] lg:h-full pt-20 lg:pt-0">
              <div className="relative flex items-center justify-center lg:justify-start">
                <span
                  className="absolute text-brand font-display font-medium opacity-25 select-none pointer-events-none"
                  style={{ fontSize: "clamp(18rem, 40vw, 36rem)", lineHeight: 1, top: "50%", left: "50%", transform: "translate(-50%, -50%) scaleX(0.8)", zIndex: -1 }}
                >?</span>
                <h2 className="font-display font-bold text-brand leading-[0.95] text-center relative z-10" style={{ fontSize: "clamp(3.5rem, 8vw, 7rem)" }}>What<br />we do</h2>
              </div>
            </div>
            <div className="w-full lg:w-7/12 flex items-center justify-center h-[65%] lg:h-full pb-6 lg:pb-0">
              <div className="relative w-full aspect-square max-w-[340px] sm:max-w-[400px] lg:max-w-[440px] flex items-center justify-center">
                {cardData.map((item, i) => (
                  <StackedCard key={i} item={item} index={i} total={cardData.length} progress={scrollYProgress} onClick={handleCardClick} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
});
