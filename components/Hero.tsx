"use client";

import { useEffect, useRef, memo } from "react";
import { motion } from "framer-motion";
import { useAdmin } from "./AdminProvider";

const TYPING_SPEED = 80;

export default memo(function Hero() {
  const { data } = useAdmin();
  const typedRef = useRef<HTMLSpanElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const indexRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const headingText = data.heroHeading;

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

    startTyping();

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
  }, [headingText]);

  return (
    <section
      id="home"
      data-theme="dark"
      className="relative pt-20 pb-12 md:py-0 h-auto md:min-h-dvh flex items-center justify-center bg-brand overflow-hidden ios-gpu-stable pattern-bg"
      style={{ '--pattern-opacity': '0.16', '--pattern-mobile-opacity': '0.35' } as React.CSSProperties}
    >
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{ y: "-100dvh" }}
          animate={{ y: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
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
            {/* Actual typed text — updated via ref to avoid React re-renders */}
            <span className="absolute top-0 left-0 w-full h-full">
              <span ref={typedRef} />
              <span ref={cursorRef} className="dot-cursor inline-block align-baseline" />
            </span>
          </h1>
        </motion.div>

        <motion.div
          initial={{ y: "-100dvh" }}
          animate={{ y: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
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
