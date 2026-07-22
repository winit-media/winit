"use client";

import { useEffect, useRef, memo, useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import { useAdmin } from "./AdminProvider";

const subscribe = () => () => {};
const getServerViewportHeight = () => 800;
const getClientViewportHeight = () => window.visualViewport?.height ?? window.innerHeight;

const TYPING_SPEED = 80;
const TYPING_DELAY = 400;

export default memo(function Hero() {
  const { data } = useAdmin();
  const typedRef = useRef<HTMLSpanElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const indexRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const viewportHeight = useSyncExternalStore(subscribe, getClientViewportHeight, getServerViewportHeight);

  const headingText = data.heroHeading;
  const prefersReducedMotion = typeof window !== "undefined"
    && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    indexRef.current = 0;
    if (typedRef.current) typedRef.current.textContent = "";
    if (cursorRef.current) cursorRef.current.style.display = "inline-block";

    let timer: ReturnType<typeof setInterval> | null = null;

    const startTyping = () => {
      timer = setInterval(() => {
        indexRef.current += 1;
        if (indexRef.current <= headingText.length && typedRef.current) {
          typedRef.current.textContent = headingText.slice(0, indexRef.current);
        } else {
          if (timer) clearInterval(timer);
          if (cursorRef.current) cursorRef.current.style.display = "none";
        }
      }, TYPING_SPEED);
      timerRef.current = timer;
    };

    if (prefersReducedMotion) {
      if (typedRef.current) typedRef.current.textContent = headingText;
      if (cursorRef.current) cursorRef.current.style.display = "none";
    } else {
      const delayTimer = setTimeout(startTyping, TYPING_DELAY);
      return () => {
        clearTimeout(delayTimer);
        if (timer) clearInterval(timer);
      };
    }

    const handleVisibility = () => {
      if (document.hidden) {
        if (timer) clearInterval(timer);
      } else if (indexRef.current < headingText.length) {
        if (timer) clearInterval(timer);
        startTyping();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      if (timer) clearInterval(timer);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [headingText, prefersReducedMotion]);

  return (
    <section
      id="home"
      data-theme="dark"
      className="relative pt-20 pb-12 md:py-0 h-auto md:min-h-svh flex items-center justify-center bg-brand overflow-hidden ios-gpu-stable pattern-bg pattern-bg-hero"
    >
      <style>{`
        @media (max-width: 767px) {
          #home::before {
            transform: scale(1.25);
            transform-origin: center center;
          }
        }
      `}</style>
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={prefersReducedMotion ? false : { y: -viewportHeight }}
          animate={{ y: 0 }}
          transition={{ duration: 1.0, ease: "easeOut" }}
        >
          <h1
            className="font-display text-white text-5xl leading-[1.1] sm:text-6xl md:text-7xl lg:text-8xl font-black mt-8 mb-4 md:mt-16 md:mb-2 relative tracking-wide"
          >
            {/* Ghost text to preserve layout height during typing animation */}
            <span className="opacity-0 pointer-events-none select-none block" aria-hidden="true">
              {"SHAPING SUCCESS STORIES".split(' ').map((word, index, array) => (
                <span key={`ghost-${index}`}>
                  {word}
                  {index === 0 && index < array.length - 1 && (
                    <>
                      <br className="block md:hidden" />
                      <span className="hidden md:inline"> </span>
                    </>
                  )}
                  {index === 1 && index < array.length - 1 && <br className="block" />}
                </span>
              ))}
            </span>
            {/* Actual typed text â€” updated via ref to avoid React re-renders */}
            <span className="absolute top-0 left-0 w-full h-full">
              <span ref={typedRef} />
              <span ref={cursorRef} className="dot-cursor inline-block align-baseline" />
            </span>
          </h1>
        </motion.div>

        <motion.div
          initial={prefersReducedMotion ? false : { y: -viewportHeight }}
          animate={{ y: 0 }}
          transition={{ duration: 1.0, ease: "easeOut" }}
          className="mt-6 md:mt-8"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.dispatchEvent(new CustomEvent("open-contact-modal"))}
            className="bg-white text-[#912dbf] px-8 py-3 rounded-full font-semibold text-lg transition-all duration-300 hover:bg-white/95 shadow-[0_8px_20px_rgba(0,0,0,0.12)] hover:shadow-[0_15px_25px_rgba(0,0,0,0.15)] shadow-[inset_0_-2px_4px_rgba(0,0,0,0.05)]"
          >
            {data.heroCtaText}
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
});
