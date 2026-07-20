"use client";

import { useRef, useState, useLayoutEffect, memo } from "react";
import { useAdmin } from "./AdminProvider";
import { scrollToTarget } from "@/hooks/useLenis";
import { getViewportHeight } from "@/hooks/useViewportHeight";

const ROTATION_AMOUNT = 15;

function StackedCards({
  cardData,
}: {
  cardData: { sub: string; content: string; bg: string }[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useLayoutEffect(() => {
    const section = containerRef.current?.parentElement?.parentElement;
    if (!section) return;

    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const rect = section.getBoundingClientRect();
        const sectionTop = -rect.top;
        const sectionH = rect.height - window.innerHeight;
        const progress = Math.max(0, Math.min(1, sectionTop / sectionH));

        const total = cardData.length;
        const step = 1 / total;

        cardsRef.current.forEach((card, index) => {
          if (!card) return;
          const isLast = index === total - 1;
          const startFly = index * step;
          const endFly = startFly + step;
          const dir = -1;
          const initialRotation = dir * index * ROTATION_AMOUNT;

          let y: number;
          let rotate: number;
          let opacity: number;
          let scale: number;

          if (progress <= startFly) {
            y = 0;
            rotate = initialRotation;
            opacity = 1;
            scale = 1;
          } else if (progress >= endFly) {
            if (isLast) {
              y = 0;
              rotate = 0;
              opacity = 1;
              scale = 1;
            } else {
              const flyProgress = Math.min(1, (progress - startFly) / step);
              y = flyProgress * -250;
              rotate = initialRotation + dir * 45 * flyProgress;
              opacity = 1 - flyProgress * 1.25;
              scale = 1 - flyProgress * 0.2;
            }
          } else {
            if (isLast) {
              y = 0;
              rotate = 0;
              opacity = 1;
              scale = 1;
            } else {
              const flyProgress = (progress - startFly) / step;
              y = flyProgress * -250;
              rotate = initialRotation + dir * 45 * flyProgress;
              opacity = 1 - flyProgress * 1.25;
              scale = 1 - flyProgress * 0.2;
            }
          }

          card.style.transform = `translateY(${y}%) rotate(${rotate}deg) scale(${scale})`;
          card.style.opacity = String(Math.max(0, opacity));
          card.style.zIndex = String(cardData.length - index);
        });
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true } as AddEventListenerOptions);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [cardData.length]);

  return (
    <div ref={containerRef} className="relative w-full aspect-square max-w-[340px] sm:max-w-[400px] lg:max-w-[440px] flex items-center justify-center">
      {cardData.map((item, i) => (
        <div
          key={i}
          ref={(el) => { cardsRef.current[i] = el; }}
          onClick={() => {
            const scrollAmount = (window.visualViewport?.height ?? window.innerHeight) * 0.8;
            const currentScroll = window.scrollY ?? window.pageYOffset ?? 0;
            scrollToTarget(currentScroll + scrollAmount);
          }}
          className="absolute inset-0 flex items-center justify-center origin-center cursor-pointer whatwedo-card"
          style={{
            zIndex: cardData.length - i,
          }}
        >
          <div
            className={`${item.bg} w-full h-full rounded-3xl shadow-2xl p-8 lg:p-12 flex flex-col justify-center text-white`}
          >
            <h3 className="text-3xl lg:text-4xl font-bold mb-4 font-display">{item.sub}</h3>
            <p className="text-white/90 text-[15px] lg:text-base leading-relaxed">{item.content}</p>
          </div>
        </div>
      ))}
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
              <StackedCards cardData={cardData} />
            </div>
          </div>
        </div>
      )}
    </section>
  );
});
