"use client";

import { useRef, useState, useEffect, useLayoutEffect, useMemo, memo } from "react";
import { useAdmin } from "./AdminProvider";
import { scrollToTarget } from "@/hooks/useLenis";
import { getViewportHeight } from "@/hooks/useViewportHeight";

const ROTATION_STEP = 15;

function generateCardKeyframes(total: number): string {
  let css = "";
  for (let i = 0; i < total; i++) {
    const initialRot = i * -ROTATION_STEP;
    const exitRot = initialRot - 45;
    const centerPct = (i / total) * 100;
    const exitPct = ((i + 1) / total) * 100;
    const isLast = i === total - 1;

    css += `@keyframes whatwedo-card-${i} {`;
    css += `0%{transform:translateY(0) rotate(${initialRot}deg) scale(1);opacity:1}`;
    css += `${centerPct.toFixed(2)}%{transform:translateY(0) rotate(0deg) scale(1);opacity:1}`;
    if (isLast) {
      css += `100%{transform:translateY(0) rotate(0deg) scale(1);opacity:1}`;
    } else {
      css += `${exitPct.toFixed(2)}%{transform:translateY(-250%) rotate(${exitRot}deg) scale(0.8);opacity:0}`;
      css += `100%{transform:translateY(-250%) rotate(${exitRot}deg) scale(0.8);opacity:0}`;
    }
    css += `}`;
  }
  return css;
}

function StackedCard({
  item,
  index,
  total,
  scrollRange,
  onClick,
}: {
  item: { sub: string; content: string; bg: string };
  index: number;
  total: number;
  scrollRange: [number, number];
  onClick: () => void;
}) {
  const zIndex = total - index;

  const prefersReducedMotion = typeof window !== "undefined"
    && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      className="absolute inset-0 flex items-center justify-center origin-center cursor-pointer whatwedo-card"
      style={
        prefersReducedMotion
          ? { zIndex }
          : ({
              zIndex,
              animation: `whatwedo-card-${index} linear both`,
              animationTimeline: "scroll(root block)",
              animationRange: `${scrollRange[0].toFixed(2)}% ${scrollRange[1].toFixed(2)}%`,
            } as React.CSSProperties)
      }
    >
      <div
        className={`${item.bg} w-full h-full rounded-3xl shadow-2xl p-8 lg:p-12 flex flex-col justify-center text-white`}
      >
        <h3 className="text-3xl lg:text-4xl font-bold mb-4 font-display">{item.sub}</h3>
        <p className="text-white/90 text-[15px] lg:text-base leading-relaxed">{item.content}</p>
      </div>
    </div>
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
  const [scrollRange, setScrollRange] = useState<[number, number]>([0, 100]);
  const prefersReducedMotion = typeof window !== "undefined"
    && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const keyframesCSS = useMemo(
    () => generateCardKeyframes(cardData.length),
    [cardData.length]
  );

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

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion) return;

    const computeRange = () => {
      const docScrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docScrollHeight <= 0) { setScrollRange([0, 100]); return; }
      const rect = section.getBoundingClientRect();
      const sectionTop = window.scrollY + rect.top;
      const sectionBottom = sectionTop + section.offsetHeight;
      setScrollRange([
        Math.max(0, (sectionTop / docScrollHeight) * 100),
        Math.min(100, (sectionBottom / docScrollHeight) * 100),
      ]);
    };

    requestAnimationFrame(computeRange);

    const ro = new ResizeObserver(computeRange);
    ro.observe(section);
    window.addEventListener("resize", computeRange);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", computeRange);
    };
  }, [prefersReducedMotion, sectionHeight]);

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
      {!prefersReducedMotion && (
        <style dangerouslySetInnerHTML={{ __html: `@supports (animation-timeline: scroll()) { ${keyframesCSS} }` }} />
      )}
      {prefersReducedMotion ? (
        <div className="relative w-full min-h-svh flex items-center overflow-hidden ios-gpu-stable pattern-bg">
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
        <div className="sticky top-0 h-svh w-full flex items-center overflow-clip z-0 pattern-bg">
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
                  <StackedCard
                    key={i}
                    item={item}
                    index={i}
                    total={cardData.length}
                    scrollRange={scrollRange}
                    onClick={handleCardClick}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
});
