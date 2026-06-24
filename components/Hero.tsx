"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PatternOverlay from "./PatternOverlay";
import { useAdmin } from "./AdminProvider";

const TYPING_SPEED = 80;

export default function Hero() {
  const { data } = useAdmin();
  const [typedText, setTypedText] = useState("");
  const [typingDone, setTypingDone] = useState(false);
  const [showSubtext, setShowSubtext] = useState(false);
  const indexRef = useRef(0);

  const headingText = data.heroHeading;

  useEffect(() => {
    indexRef.current = 0;
    setTypedText("");
    setTypingDone(false);
    setShowSubtext(false);

    const interval = setInterval(() => {
      indexRef.current += 1;
      if (indexRef.current <= headingText.length) {
        setTypedText(headingText.slice(0, indexRef.current));
      } else {
        clearInterval(interval);
        setTypingDone(true);
      }
    }, TYPING_SPEED);
    return () => clearInterval(interval);
  }, [headingText]);

  useEffect(() => {
    if (typingDone) {
      const timer = setTimeout(() => setShowSubtext(true), 600);
      return () => clearTimeout(timer);
    }
  }, [typingDone]);

  const scrollToContact = () => {
    document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center bg-brand overflow-hidden snap-section"
    >
      <PatternOverlay opacity={0.16} />
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          animate={showSubtext ? { y: -60 } : { y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1
            className="font-serif text-white text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black mt-16 mb-2"
            style={{ letterSpacing: "-0.03em", lineHeight: "0.95" }}
          >
            <span>{typedText}</span>
            {!typingDone && <span className="dot-cursor" />}
          </h1>
        </motion.div>

        <AnimatePresence>
          {showSubtext && (
            <>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="mt-2 max-w-3xl mx-auto"
              >
                <p className="text-white text-base sm:text-lg md:text-xl leading-relaxed font-medium mx-auto" style={{ maxWidth: '60ch', opacity: 0.85 }}>
                  {data.heroSubtext}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                className="mt-8"
              >
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 8px 20px rgba(255,255,255,0.3)' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={scrollToContact}
                  className="bg-white text-[#912dbf] px-8 py-3 rounded-full font-semibold text-lg transition-all duration-300 hover:bg-white/90"
                >
                  {data.heroCtaText}
                </motion.button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
